<template lang="html">
    <div class="">

        <!-- <pre>{{formItem}}</pre> -->
        <Row :gutter="15" style="margin-bottom: 15px">
            <Col span="2">
                <Input :placeholder="$t('UID')" v-model="formItem.uid"/>
            </Col>
            <!-- <Col span="2">
                <Select clearable :placeholder="$t('排序方式')"  v-model="formItem.orderType" @on-change="" v-autoLocale>
                    <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col> -->
            <!-- <Col span="2">
                <Select :placeholder="$t('升降序')" v-model="asc" @on-change="" v-autoLocale>
                    <Option v-for="item in orders" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col> -->
            <Col span="4">
                <Input :placeholder="$t('银行账户')" v-model="formItem.bankCode"/>
            </Col>

            <Col span="7">
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 327px"
                    :placeholder="$t('申请时间-起 -- 申请时间-止')"
                    v-model="dateRange"
                ></DatePicker>
            </Col>
            <Col span="3" v-if="$store.state.user.checkPerm('legal:withdrawls:trial:list')">
                <Button type="primary" @click="search">{{$t('查询')}}</Button>
            </Col>
        </Row>
        <Card class="otherRowTabel">
            <p slot="title">
                {{ $t('提现初审列表') }}
            </p>


                <expandTable :columns="columns" :data="dataList" v-if="$store.state.user.checkPerm('legal:withdrawls:trial:list')">
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
                                <!-- <Table :columns="tabcolumns" :data="props.row.operations" style="width: 100%;"></Table> -->

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

            <!-- <Row v-if='dataList.length' type="flex" justify="center" align="middle" class="autoQueryList" v-for="item in dataList">
                <Table :columns="columns" :data="[item]" style="width: 100%;"></Table>
                <div class="table-info" v-if='!item.hideDetail'>
                    <span>{{ $t('安全判定') }}: </span><span style="margin-right: 45px">{{ getSafestatus(item.safe) }}</span>
                    <span>{{ $t('是否第一次提现') }}: </span><span style="margin-right: 45px">{{ item.firse?'是':'否' }}</span>
                    <span>{{ $t('是否属于大额提现') }}: </span><span style="margin-right: 45px">{{ item.limit?'是':'否' }}</span>
                </div>
            </Row>
            <Row v-if='!dataList.length' type="flex" justify="center" align="middle" class="autoQueryList">

                <Table :columns="columns" :data="dataList" style="width: 100%;"></Table>
            </Row> -->

            <div class="page-pane" v-if="$store.state.user.checkPerm('legal:withdrawls:trial:list')">
                <Button @click='selectPrev()'>{{$t('上一页')}}</Button>
                <Button @click='selectNext()'>{{$t('下一页')}}</Button>
            </div>
        </Card>
        <Modal v-model="modalRefuse" width="500" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('拒绝理由')}}</span>
            </p>
            <div style="text-align:center">
                <Form :label-width="60">
                    <FormItem :label="$t('拒绝理由')">
                      <Select v-model="refuseForm.checkcode" clearable placeholder="" v-autoLocale>
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


        <Modal
            v-model="recheckModal"
            :title="$t('提交复审')"
            class-name="modal-clear-line"
            >
            <p>
                {{$t('确定将此条申请提交复审')}}?
            </p>
            <Row style="margin-top: 15px; margin-bottom: 15px;">
                <Col span="5">
                    {{$t('备注')}}
                </Col>
                <Col span="15">
                    <Input v-model="recheckForm.remark" type="textarea" style="width: 100%" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                </Col>
            </Row>

            <div style="text-align: center;">
                <Button type="primary" @click="confirmRecheck">{{$t('保存')}}</Button>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>

    </div>
</template>

<script>
import { legalTender ,recharge} from '__util/api'
import {Button} from 'iview'
import expandTable from '__components/expandTable.vue'

const query = {
  list: {method: 'post', url: 'v1/legal/withdrawls/trial/list'},
  recheck:{method:'post',url:'v1/legal/withdrawls/trial/submitReview'},
  pass:{method:'post',url:'v1/legal/withdrawls/trial/pass'},
  refuse:{method:'post',url:'v1/legal/withdrawls/trial/refused'},
    refuseList: {method: 'get', url: '/v1/legal/withdraw/refuse/list', data: {}},

}

export default {
    components:{
        expandTable
    },
    data () {
        return {
            refuseForm:{},
            refuses:[],
            recheckModal:false,
            recheckForm:{},
            formItem: {
                size:10,
                direct:'',
                from:''
            },
            modalRefuse: false,
            // 拒绝理由
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
                    width:120,
                    key: 'receiptNo'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('申请提现金额')
                    },
                    key: 'withdrawalsAmount',
                    render:(h,params)=>Number(params.row.withdrawalsAmount)

                },
                {
                    renderHeader: (h) => {
                        return this.$t('手续费')
                    },
                    key: 'withdrawalsFee',
                    render:(h,params)=>Number(params.row.withdrawalsFee)
                },
                {
                    renderHeader: (h) => {
                        return this.$t('实提金额')
                    },
                    key: 'withdrawalsRealAmount',
                    render:(h,params)=>Number(params.row.withdrawalsRealAmount)

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

                        if (this.$store.state.user.checkPerm('legal:withdrawls:trial:refused')) {
                            dom.push(h('span', {
                                style: {
                                    cursor: 'pointer',
                                    'margin-right': '10px'
                                },

                                on: {
                                    click: () => {
                                        this.refuse(params.row)
                                    }
                                }
                            },this.$t('拒绝')))
                        }

                        if (this.$store.state.user.checkPerm('legal:withdrawls:trial:submitReview')) {
                            dom.push(h('span', {
                                style: {
                                    cursor: 'pointer',
                                    'margin-right': '10px',
                                },
                                on: {
                                    click: () => {
                                        this.review(params.row)
                                    }
                                }
                            }, this.$t('提交复审')))
                        }
                        if (this.$store.state.user.checkPerm('legal:withdrawls:trial:pass')) {
                            dom.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size:'small'
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
                size: 10,
                total: 0
            },
            dateRange: [],
            // 当前操作的item
            firstId:'',
            currItem: {
                asc:false
            },
            prevList:[]
        }
    },
    computed: {
        asc:{
            get(){
                return this.formItem.orderType?'desc':''

            },
            set(v){
                console.log(v)
                if(v=='asc'){
                    this.formItem.asc = true

                }else{
                    this.formItem.asc = false

                }
            }
        },
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
        if (this.$store.state.user.checkPerm('legal:withdrawls:trial:list')) {
            this.getList()
        }
        if (this.$store.state.user.checkPerm('legal:withdrawls:refuse:list')) {
            this.getRefuseReasons()
        }

    },
    methods: {
        selectPrev(){
            this.formItem.direct = 'prev'
            this.formItem.from = Number(this.dataList[0].id)-1

            this.getList(true)

        },
        selectNext(){
            this.formItem.direct = 'next'
            this.formItem.from = Number(this.dataList[this.dataList.length-1].id)+1
            
            this.getList(true)

        },
        clickTab(){},
        getSafestatus(status=''){
            return status && status.indexOf('_RISH')>-1?this.$t('风险'):this.$t('安全')
        },
        parse(str){
            return JSON.parse(str).cn
        },
        toggleRow(item){
            console.log('xx')
            item.row.hideDetail=!item.row.hideDetail
        },
        async getRefuseReasons(){
            const res = await this.$axios(query.refuseList)
            // console.log(res.data.list)
            this.refuses = res.data.list.map(v=>{

                try{
                    v.reasons = JSON.parse(v.reasons)
                    return v

                }catch(e){
                    return ''
                    console.log(v.reasons)
                }

            }).filter(v=>v)
        },
        expandStatus (row) {
            this.dataList.some((v,i)=>{
                if(row.id===v.id){
                    let obj = Object.assign({}, v, {_expand: !v._expand})
                    this.dataList.splice(i, 1,obj)
                    return true
                }
            })
        },
        search () {
            this.getList()
        },
        // 取个通用名字怎么了
        getList (prev_next) {
            if(!prev_next){
                this.formItem.direct=''
                this.formItem.from = ''
            }
            query.list.data = {...this.formItem}
            this.$axios(query.list).then((res) => {
                const dataList = res.data.map(v=>{
                    // v.first=true
                    v._expand=true
                    return v
                })
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
        },
        // 拒绝
        refuse (item) {
            this.modalRefuse = true
            this.refuseForm.id = item.id
            this.refuseForm.uid = item.uid
            this.refuseForm.status = 8
        },
        // 提交拒绝理由
        async subRefuse () {
            // this.modalRefuse = false
            this.refuseForm.checkcode = this.refuseForm.checkcode+''
            this.refuseForm.checkMsg = this.refuses && this.refuses.find(v=>v.id==this.refuseForm.checkcode).reasons.cn
            const obj = {...query.refuse,data:this.refuseForm}
            const res = await this.$axios(obj)
            if(res.success){
                this.$Message.success(this.$t('拒绝成功'))
                this.getList()
                this.modalRefuse = false
            }


        },
        // 复审
        async confirmRecheck(){
            const obj = {...query.recheck,data:this.recheckForm}
            const res = await this.$axios(obj)
            if(res.success){
                this.$Message.success(this.$t('提交成功'))
                this.getList()
                this.recheckModal = false
            }
        },

        review (item) {
            this.recheckModal = true
            this.recheckForm.id = item.id
            this.recheckForm.uid= item.uid
        },
        // 通过
        pass (item) {
            this.$Modal.confirm({
                title: this.$t('确认'),
                content: this.$t('是否要通过此条提现申请记录？'),
                onOk: () => {this.passSub(Number(item.id),Number(item.uid),item.withdrawalsRealAmount)}
            })
        },
        async passSub (id, uid,amout) {

            const obj = {...query.pass,data:{id,uid,status:3,withdrawalsRealAmount: amout}}
            const res = await this.$axios(obj)
            if(res.success){
                  this.$Message.success({content: this.$t('操作成功')})
                this.getList()

            }
        }
    },
    watch: {
        dateRange (val) {
            console.log(val)
                this.formItem.startDate = val[0]?this.$moment(val[0]).format():''
                this.formItem.endDate = val[1]?this.$moment(val[1]).format():''
        },
        modalRefuse (val) {
            if (!val) {
                this.refuseReason = ''
            }
        },
        recheckModal(val){
            if(!val){
                this.recheckForm = {}
            }
        },
       modalRefuse(val){
            if(!val){
                this.refuseForm = {}
            }
        }

    }
}

                            // <Button type='text' onClick={()=>{
                            //     params.row.hideDetail = !params.row.hideDetail
                            // }}>
                            //     <span class="text-primary">{params.row.hideDetail?'展开':'收起'}</span>
                            // </Button>
</script>



<style lang="less">
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
