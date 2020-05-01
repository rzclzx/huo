<template lang="html">
    <div class="">
        <Row type="flex" >
            <Form :model="formData" inline>
                <Row>

                    <FormItem>
                        <Input class="widthInput" :placeholder="$t('UID')" v-model="formItem.uid"/>
                    </FormItem>
                    <FormItem>
                        <Input class="widthInput" :placeholder="$t('ID')" v-model="formItem.id"/>
                    </FormItem>
                    <FormItem>
                        <Input class="widthInput" :placeholder="$t('银行帐号')" v-model="formItem.bankCode"/>
                    </FormItem>

                    <FormItem>
                        <Select :placeholder="$t('状态（全部）')" v-model="formItem.status" v-autoLocale class="widthInput">
                            <Option v-if='item.value!=1' v-for="item in statusArr" :value="item.value" :key="item.value">{{ $t(item.label) }}</Option>
                        </Select>
                    </FormItem>


                    <FormItem>
                        <DatePicker
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            placement="bottom-end"
                            transfer
                            style="width: 322px"
                            :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                            v-model="dateRange"
                        ></DatePicker>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('legal:withdrawls:list')">{{$t('查询')}}</Button>
                    </FormItem>
                </Row>
            </Form>
        </Row>
        <Card class="otherRowTabel">
            <p slot="title">
                {{ $t('提现查询列表') }}
            </p>

<Row>
                <expandTable :columns="columns" :data="dataList" v-if="$store.state.user.checkPerm('legal:withdrawls:list')">
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
</Row>
            <div class="page-pane" v-if="$store.state.user.checkPerm('legal:withdrawls:list')">
                <Button @click='selectPrev()'>{{$t('上一页')}}</Button>
                <Button @click='selectNext()'>{{$t('下一页')}}</Button>


            </div>
            <!-- <Row type="flex" justify="center" align="middle" class="autoQueryList" v-for="item in dataList">

                <Table :columns="columns" :data="[item]" style="width: 100%;"></Table>
                <div class="table-info">
                    <span>{{ $t('付款银行') }}: </span><span style="margin-right: 45px">{{ item.receiptBank }}</span>
                    <span>{{ $t('银行账号') }}: </span><span style="margin-right: 45px">{{ item.receiptNo }}</span>
                    <span>{{ $t('审核人员') }}: </span><span >{{ item.fChecker }}</span>
                    <span>{{ $t('复审人员') }}: </span><span >{{ item.sChecker }}</span>
                    <span>{{ $t('复审拒绝理由') }}: </span><span >{{ item.sCheckMsg }}</span>
                    <span>{{ $t('失败人工确认') }}: </span><span ><span>{{ $t('确认成功') }}</span><span>{{ $t('确认失败') }}</span></span>
                </div>
            </Row>
            <div class="page-pane">

            </div> -->
        </Card>
    </div>
</template>

<script>
import { legalTender } from '__util/api'
import expandTable from '__components/expandTable.vue'
import {Button} from 'iview'
import {statusArr} from './status'
const query = {
  list:{method:'post',url:'v1/legal/withdrawls/list'},

}
import operation from './operation'
export default {
    components:{
        expandTable
    },
    data () {
        return {
            formData: {},

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
                    render:(h,param)=>param.row.createAt?this.$moment(Number(param.row.createAt)).format('YYYY-MM-DD hh:mm:ss'):''
                },


            ],
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('申请时间')
                    },
                    width:100,

                    key: 'withdrawlsDate',
                    render:(h,params)=>params.row.withdrawlsDate?this.$moment(Number(params.row.withdrawlsDate)).format('YYYY-MM-DD  hh:mm:ss'):""

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
                    render:(h,param)=>Number(param.row.withdrawalsAmount)||''
                },
                {
                    renderHeader: (h) => {
                        return this.$t('提现手续费')
                    },
                    key: 'withdrawalsFee',
                    render:(h,param)=>Number(param.row.withdrawalsFee)||''

                },
                {
                    renderHeader: (h) => {
                        return this.$t('实提金额')
                    },
                    key: 'withdrawalsRealAmount',
                    render:(h,param)=>Number(param.row.withdrawalsRealAmount)||''

                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'status',
                    render:(h,param)=>{
                        // return 'xxx'
                        const ret = this.statusArr && this.statusArr.find(v=>v.value==param.row.status)
                        if(ret){
                            return this.$t(ret.label)
                        }else{
                            return ''
                        }


                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('安全判定')
                    },
                    key: 'safe',
                    render:(h, param)=>{
                        // console.log(param)
                        return this.getSafestatus(param.row.safe)
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    key: 'status',
                    render:(h,params)=>{
                        return <div>
                            <Button type='primary' size='small' onClick={()=>{this.expandStatus(params.row)}}>{params.row._expand?this.$t('收起'):this.$t('查看更多')}</Button>
                        </div>
                    }
                },


            ],
            prevList:[],
            dateRange:[],
            dataList: [
                {
                    name: 1
                }
            ],
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            formItem: {
                size:10,
                direct:'',
                from:''
            },
            statusArr:statusArr
        }
    },
    computed: {
        total_amount () {
            return [
                {
                    value: 'asc',
                    label: this.$t('实提金额正序排列')
                },
                {
                    value: 'desc',
                    label: this.$t('实提金额倒序排列')
                }
            ]
        },
        fee_amount () {
            return [
                {
                    value: 'asc',
                    label: this.$t('手续费正序排列')
                },
                {
                    value: 'desc',
                    label: this.$t('手续费倒序排列')
                }
            ]
        }
    },
    mounted () {
        if (this.$store.state.user.checkPerm('legal:withdrawls:list')) {

            this.getList()
        }
    },

    watch: {
        dateRange (val) {
                this.formItem.startDate = val[0]?this.$moment(val[0]).format():''
                this.formItem.endDate = val[1]?this.$moment(val[1]).format():''
        },
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

        getSafestatus(status=''){
            return status && status.indexOf('_RISH')>-1?this.$t('风险'):this.$t('安全')
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

        clickTab(){},
        search () {
            this.getList()
        },
        // 拒绝
        refuse () {

        },
        // 复审
        review () {

        },
        // 通过
        pass () {

        },
        // 获取数据
        getList (prev_next) {
            if(!prev_next){
                this.formItem.direct=''
                this.formItem.from = ''
            }

            const obj = {...query.list ,data:this.formItem}
            // query.list.data.page = page ? page : this.page.currPage
            // query.list.data.limit =  this.page.pageSize
            this.$axios(obj).then((res) => {
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
.widthInput {
    width: 155px;
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
