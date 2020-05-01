<template lang="html">
    <div class="autoQuery">
        <Card>
            <p slot="title">
                {{ $t('保证金列表') }}
            </p>
        <Row type="flex" >
            <!-- <pre>{{form}}</pre> -->
            <Form :model="form" inline>


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

                <!-- <FormItem>
                    <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('fince:transfer:history:list')">{{$t('查询')}}</Button>
                </FormItem> -->
                <FormItem>
                    <Button type="primary" @click="output" v-if="$store.state.user.checkPerm('fince:transfer:history:export')">{{$t('导出')}}</Button>
                </FormItem>

            </Form>
        </Row>
        <Row class="flex" style='margin-bottom:15px;'>
          <!--<Button @click='selectAll' :type="allTag?'primary':'ghost'" >{{$t('全选')}}</Button>!-->
          <Button @click='search' :type="allTag?'primary':'ghost'">{{$t('查询')}}</Button>
          <Button :type="curr.select?'primary':'ghost'" @click="selectTag(i)" v-for='(curr,i) in currs' style='width:60px;margin-left:10px'>{{curr.label}}</Button>
        </Row>

            <Row type="flex" justify="center" align="middle" class="autoQueryList">
                <Table :columns="columns" :data="data" style="width: 100%;"></Table>
            </Row>
        </Card>

    </div>

</template>

<script>
import { legalTender } from '__util/api'
import util from '__util/util'
import {Button} from 'iview'
import Drawer from '__components/drawer.vue'
const query = {
  currlist:{method:'get',url:'v1/transfer/history/currency/list'},
  export:{method:'post',url:'v1/transfer/history/export'},
  list:{method:'post',url:'v1/transfer/history/list'},
}
// import BankAccountAdd from './bankAccountAdd.vue'
export default {
    components:{
        Drawer,
        // BankAccountAdd1
    },
    bankinfo:{},
    data () {
        return {
          form:{},
            dateRange:[],
            formTitle:'',
            data:[],
            currs:[],
            modalAdd:false,
            currForm:{},
            ruleItem: {
                accountName: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                bankCode: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                // bankName: [
                //     {
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],

                remark: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],


            },

            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('操作发起方')
                    },
                    key: 'operatorStart'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作方向')
                    },
                    key: 'operatorDirect'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('币种')
                    },
                    key: 'currency'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('金额')
                    },
                    key: 'amount',
                    render:(h,params)=>Number(params.row.amount)
                },
                   {
                    renderHeader: (h) => {
                        return this.$t('操作时间')
                    },
                    key: 'operatorTime',
                    // render:(h,params)=>this.accountType[params.row.customType]
                },

                {
                    renderHeader: (h) => {
                        return this.$t('订单ID')
                    },
                    key: 'withdrawId',
                    // render:(h,params)=>this.accountType[params.row.customType]
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'status',
                    // render:(h,params)=>this.accountType[params.row.customType]
                },

            ]
        }
    },
    mounted () {
        if(this.$store.state.user.checkPerm('fince:transfer:history:list')){
            this.getList()
            this.currlist()

        }
    },

    watch: {
        dateRange (val) {
                this.form.startDate = val[0]?this.$moment(val[0]).format():''
                this.form.endDate = val[1]?this.$moment(val[1]).format():''
        },
    },
    computed:{
      allTag:{
        get(){
          return this.currs.every(v=>v.select)

        },
        set(val){
          this.currs = this.currs.map(v=>{
            v.select=val
            return v
          })
        }
      }

    },
    methods: {
      async output(){
            this.form.currency = this.currs.filter(v=>v.select).map(v=>v.label).join(',')
            query.list.data = this.form
            let res = await this.$axios(query.export)
            if(res.success){
              util.download(res.data)
            }
            // this.data = res.data.items

      },
      selectAll(){
        this.allTag = !this.allTag
      },
      selectTag(i){
        this.currs[i].select = !this.currs[i].select
      },
        search(){
          this.getList()
        },
        async currlist (page) {

            let res = await this.$axios(query.currlist)
            this.currs = res.data.map(v=>{
              return {label:v,select:false}
            })
            // this.banks = res.data.list

        },
        async getList () {
            this.form.currency = this.currs.filter(v=>v.select).map(v=>v.label).join(',')
            query.list.data = this.form
            let res = await this.$axios(query.list)
            this.data = res.data.items||[]

        }
    }
}


</script>

<style lang="less">
.autoQuery {
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
    th.widthcol{
        min-width: 150px;
    }

}










</style>
