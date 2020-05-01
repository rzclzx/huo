<template lang="html">
    <div class="">

        <Row :gutter="15" style="margin-bottom: 15px">
            <Col span="2">
                <Input :placeholder="$t('UID')" v-model="formItem.uid"/>
            </Col>
            <!-- <Col span="2">
                <Select :placeholder="$t('排序方式')"  v-model="formItem.orderType" @on-change="" v-autoLocale>
                    <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="2">
                <Select :placeholder="$t('手续费排序')" v-model="formItem.asc" @on-change="" v-autoLocale>
                    <Option v-for="item in orders" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col> -->
            <Col span="4">
                <Input :placeholder="$t('银行帐号')" v-model="formItem.bankCode"/>
            </Col>

            <Col span="7">
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 327px"
                    :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                    v-model="dateRange"
                ></DatePicker>
            </Col>
            <Col span="3" v-if="$store.state.user.checkPerm('legal:withdrawls:review:list')">
                <Button type="primary" @click="search">{{$t('查询')}}</Button>
            </Col>
        </Row>

        <Card class="otherRowTabel" >
            <p slot="title">
                {{ $t('提现复审列表') }}
            </p>
            <Row type="flex" justify="center" align="middle" class="autoQueryList"  >

                <expandTable :columns="columns" :data="dataList" v-if="$store.state.user.checkPerm('legal:withdrawls:review:list')">
                    <template slot-scope="props">

    <Tabs value="name1" @on-click="clickTab">
        <TabPane :label="$t('安全判定')" name="name1">

            <div class="table-info" >
                <span>{{ $t('安全判定') }}: </span><span style="margin-right: 45px">{{ getSafestatus(props.row.safe) }}</span>
                <span>{{ $t('是否第一次提现') }}: </span><span style="margin-right: 45px">{{ props.row.first?$t('是'):$t('否') }}</span>
                <span>{{ $t('是否属于大额提现') }}: </span><span style="margin-right: 45px">{{ props.row.limit?$t('是'):$t('否') }}</span>
            </div>
        </TabPane>
        <TabPane :label="$t('其他')" name="name2">
            <div class="history-info" v-for='(row,index) in props.row.operations'>
                <span>{{$t('操作人')}}:</span>
                <span class='person'>{{(index==0&&!row.userName)?$t('用户'):row.userName}}</span>
                <span>{{$t('操作时间')}}:</span>
                <span class='time'>{{$moment(Number(row.createAt)).format('YYYY-MM-DD hh:mm:ss')}}</span>
                <span>{{$t('操作项')}}:</span>
                <span class='content'>{{$t(row.orerationName)}}</span>
                <span v-if='row.remark'>{{$t('备注')}}:</span>
                <span v-if='row.remark'>{{row.remark}}</span>
            </div>
        </TabPane>

    </Tabs>

                    </template>
                </expandTable>

            </Row>


            <div class="page-pane" v-if="$store.state.user.checkPerm('legal:withdrawls:review:list')">
                <Button @click='selectPrev()'>{{$t('上一页')}}</Button>
                <Button @click='selectNext()'>{{$t('下一页')}}</Button>

            </div>
        </Card>
        <!-- <Modal v-model="modalRefuse" width="500" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('拒绝理由')}}</span>
            </p>
            <div style="text-align:center">
                <Form :label-width="60">
                    <FormItem :label="$t('拒绝理由')">
                      <Select v-model="refuseReason" placeholder="" v-autoLocale>
                        <Option v-for="item in refuseReasonArr" :value="item.zhReasons" :key="item.id">{{ item.zhReasons }}</Option>
                      </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="subRefuse">{{$t('确定')}}</Button>
                <Button type="ghost" @click="modalRefuse = false">返回</Button>
            </div>
        </Modal> -->

        <Modal v-model="modalRefuse" width="500" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('拒绝理由')}}</span>
            </p>
            <div style="text-align:center">
                <Form :label-width="60">
                    <FormItem :label="$t('拒绝理由')">
                      <Select v-model="refuseForm.checkcode" placeholder="" v-autoLocale>
                        <Option v-for="item in refuses" :value="item.id" :key="item.id">{{ item.reasons.cn }}  {{item.reasons.en}}</Option>

                      </Select>
                    </FormItem>
                    <FormItem :label="$t('备注')">
                        <Input v-model="refuseForm.remark" type="textarea" style="width: 100%" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>

                    </FormItem>

                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="subRefuse">{{$t('确定')}}</Button>
                <Button type="ghost" @click="modalRefuse = false">{{$t('返回')}}</Button>
            </div>
        </Modal>


    </div>
</template>

<script>
import { legalTender,recharge } from '__util/api'
import expandTable from '__components/expandTable.vue'
import {Button} from 'iview'
const review = {
    list:{method:'post',url:'v1/legal/withdrawls/review/list'},
    pass:{method:'post',url:'v1/legal/withdrawls/review/pass'},
    refuse:{method:'post',url:'v1/legal/withdrawls/review/refused'},
    refuseList: {method: 'get', url: '/v1/legal/withdraw/refuse/list', data: {}},


}


export default {
    components:{expandTable},
    data () {
        return {
            dateRange:[],
            // formItem:{},
            formItem: {
                size:10,
                direct:'',
                from:''
            },

            modalRefuse:false,
            refuseForm:{},
            refuses:[],
            formData: {},
            modalRefuse: false,
            refuseReason: '',
            refuseReasonArr: [
                {
                    id: 1,
                    zhReasons: ''
                }
            ],

                        tabcolumns:[
                {
                    renderHeader: (h) => {
                        return this.$t('ID')
                    },
                    key: 'busiId'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('userId')
                    },
                    key: 'userId'
                },

                {
                    renderHeader: (h) => {
                        return this.$t('内容')
                    },
                    key: 'content'
                },
                // {
                //     renderHeader: (h) => {
                //         return this.$t('操作类型')
                //     },
                //     key: 'operationType',
                //     render:(h,param)=>operation[param.row.operationType]||param.row.operationType
                // },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    key: 'orerationName'
                },

                {
                    renderHeader: (h) => {
                        return this.$t('时间')
                    },
                    key: 'createAt',
                    render:(h,param)=>this.$moment(Number(param.row.createAt)).format('YYYY-MM-DD hh:mm:ss')
                },


            ],
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('申请时间')
                    },
                    key: 'withdrawlsDate',
                    width:100,
                    render:(h,params)=>this.$moment(Number(params.row.withdrawlsDate)).format('YYYY-MM-DD  hh:mm:ss')

                },
                {
                    renderHeader: (h) => {
                        return this.$t('UID')
                    },
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('ID')
                    },
                    key: 'id'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('收款银行')
                    },
                    key: 'receiptBank'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('银行帐号')
                    },
                    key: 'receiptNo'
                },

                {
                    renderHeader: (h) => {
                        return this.$t('提现金额')
                    },
                    key: 'withdrawalsAmount',
                    render:(h,param)=>Number(param.row.withdrawalsAmount)
                },
                {
                    renderHeader: (h) => {
                        return this.$t('提现手续费')
                    },
                    key: 'withdrawalsFee',
                    render:(h,param)=>Number(param.row.withdrawalsFee)

                },
                {
                    renderHeader: (h) => {
                        return this.$t('实提金额')
                    },
                    key: 'withdrawalsRealAmount',
                    render:(h,param)=>Number(param.row.withdrawalsRealAmount)

                },
                {
                    renderHeader: (h) => {
                        return this.$t('安全状态')
                    },
                    key: 'status',
                    width:150,
                    render:(h,params)=>{
                        // console.log()

                        return [<Button type='text'>{this.getSafestatus(params.row.safe)}</Button>,
                            <Button type='primary' size='small' onClick={()=>{this.expandStatus(params.row)}}>{params.row._expand?this.$t('收起'):this.$t('查看')}</Button>]
                    }
                },

                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    key: 'value',
                    width: 200,
                    render: (h, params) => {
                        let dom = []
                        if (this.$store.state.user.checkPerm('legal:withdrawls:review:refused')) {
                            dom.push(h('span', {
                                style: {
                                    cursor: 'pointer',
                                    'margin-right': '10px',

                                },
                                on: {
                                    click: () => {
                                        this.refuse(params.row)
                                    }
                                }
                            }, this.$t('拒绝')))
                        }
                        if (this.$store.state.user.checkPerm('legal:withdrawls:review:pass')) {
                            dom.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size:'small',
                                    disabled: !this.$store.state.user.checkPerm('legal:withdrawls:review:pass')

                                },
                                style:{

                                },
                                on: {
                                    click: () => {
                                        this.pass(params.row)
                                    }
                                }
                            }, this.$t('通过')))
                        }
                        return dom
                    }
                }
            ],
            dataList: [],
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            prevList:[],
            // 当前操作的item
            currItem: {}
        }
    },
    computed: {
        types () {
            return [
                {
                    value: 'amount',
                    label: this.$t('实提金额')
                },
                {
                    value: 'gee',
                    label: this.$t('手续费')
                }
            ]
        },
        orders () {
            return [
                {
                    value: 'asc',
                    label: this.$t('正序')
                },
                {
                    value: 'desc',
                    label: this.$t('倒序')
                }
            ]
        }
    },
    mounted () {
        if (this.$store.state.user.checkPerm('legal:withdrawls:review:list')) {
            this.getList()
        }
        if (this.$store.state.user.checkPerm('legal:withdrawls:refuse:list')) {
            this.getRefuseReasons()
        }
    },
    watch: {
        dateRange (val) {
                this.formItem.startDate = val[0]?this.$moment(val[0]).format():''
                this.formItem.endDate = val[1]?this.$moment(val[1]).format():''
        },
        modalRefuse(val){
            if(!val){
                this.refuseForm = {}
            }
        }
    },

    methods: {
        selectPrev(){
            this.formItem.direct = 'prev'

            this.formItem.from = Number(this.dataList[0].id)-1
            
            // if(this.formItem.asc){
            //     this.formItem.from = this.dataList[0].id-1
            // }else{
            //     this.formItem.from = Number(this.dataList[0].id)+1
            // }
            this.getList(true)

        },
        selectNext(){
            console.log(this.dataList[this.dataList.length-1].id-1)
            this.formItem.direct = 'next'
            this.formItem.from = Number(this.dataList[this.dataList.length-1].id)+1
            
            // if(this.formItem.asc){
            //     this.formItem.from = Number(this.dataList[this.dataList.length-1].id)+1
            // }else{
            //     this.formItem.from = this.dataList[this.dataList.length-1].id-1
            // }
            this.getList(true)

        },

        clickTab(){},

        getSafestatus(status){
            return status.indexOf('_RISH')>-1?this.$t('风险'):this.$t('安全')
        },
        async getRefuseReasons(){
            const res = await this.$axios(review.refuseList)
            // console.log(res.data.list)
            this.refuses = res.data.list.map(v=>{
                try{
                    v.reasons = JSON.parse(v.reasons)
                    return v

                }catch(e){
                    return ''
                    console.log(v.reasons)
                }

                // v.reasons = JSON.parse(v.reasons)
                // return v
            }).filter(v=>v)
        },

        search () {
            this.getList()
        },
        // 拒绝
        refuse (item) {
            this.modalRefuse = true
            this.refuseForm.id = item.id
            this.refuseForm.uid = item.uid
        },
        expandStatus (row) {
            console.log(row)
            this.dataList.some((v,i)=>{

                if(row.id===v.id){
                    let obj = Object.assign({}, v, {_expand: !v._expand})
                    this.dataList.splice(i, 1,obj)
                    return true
                }
            })
        },

        // 提交拒绝理由
        async subRefuse () {
            // this.modalRefuse = false
            this.refuseForm.checkcode = this.refuseForm.checkcode+''
            this.refuseForm.checkMsg = this.refuses && this.refuses.find(v=>v.id==this.refuseForm.checkcode).reasons.cn

            const obj = {...review.refuse,data:this.refuseForm}
            const res = await this.$axios(obj)
            if(res.success){
                this.$Message.success('拒绝成功')
                this.getList()
                this.modalRefuse = false
            }


        },
        // 提交拒绝理由
        // subRefuse () {
        //     this.modalRefuse = false
        //     this.passSub(this.currItem.id, 3)
        // },
        // 通过
        pass (item) {
            this.$Modal.confirm({
                title: this.$t('确认'),
                content: this.$t('是否要通过此条提现申请记录？'),
                onOk: () => {this.passSub(item.id,item.uid,item.withdrawalsRealAmount)}
            })
        },
        // 提交
        async passSub (id, uid,withdrawalsRealAmount) {


            const obj = {...review.pass,data:{id:Number(id),uid,withdrawalsRealAmount}}
            const res = await this.$axios(obj)
            if(res.success){
                  this.$Message.success({content: this.$t('操作成功')})
                this.getList()

            }

        },
        // 获取数据
        getList (prev_next) {
            if(!prev_next){
                this.formItem.direct=''
                this.formItem.from = ''
            }
            review.list.data = {...this.formItem}
            this.$axios(review.list).then((res) => {
                let dataList = res.data
                if(!prev_next){
                    this.dataList = dataList
                    return false                    
                }

                if(dataList.length){
                    this.prevList = [...dataList]
                    this.dataList = dataList
                }else{
                    this.dataList = [...this.prevList]
                }

            })
        }
    }
}
</script>

<style lang="less">
.history-info{
    margin-top:10px;
    span{
        display: inline-block;
        margin-left:10px;
    }
    .person{
        width:100px;
    }
    .time{
        width:200px
    }
    .content{
        vertical-align: middle;
        width: 200px;
    }
}
.otherRowTabel {
    .table-info {
        background-color: #ffffff;
        border: 1px solid #dddee1;
        border-top: none;
        padding: 15px 18px;
        width: 100%;
        padding-top: 15px;
        text-align: left;
    }
    .autoQueryList {
        & .ivu-table-wrapper {
            border-top: 0;
        }
        &:first-child {
            & .ivu-table-wrapper {
                border-top: 1px solid #dddee1;
            }
        }
    }
}
</style>
