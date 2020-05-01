<template lang="html">
    <div class="autoQuery">
        <Row type="flex" >

            <Form :model="form" inline>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('UID')" v-model="form.uid"/>
                </FormItem>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('ID')" v-model="form.id"/>
                </FormItem>


                <FormItem>
                    <Select v-model="form.bankName" clearable :placeholder="$t('开户行')" style="width: 100px" v-autoLocale>
                        <Option v-for="item in bankNames" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('银行帐号')" v-model="form.receiptNo"/>
                </FormItem>

                <!-- <FormItem>
                        <Select :placeholder="$t('状态(全部)')" v-model="form.status" v-autoLocale class="widthInput">
                            <Option v-if='item.value!=1' v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                </FormItem> -->


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
                    <Input class="widthInput" :placeholder="$t('提现金额')" v-model="form.withdrawalsAmount"/>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('legal:withdrawls:trial:list')">{{$t('查询')}}</Button>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="output" v-if="$store.state.user.checkPerm('legal:withdrawls:wait:list:exp')">{{$t('导出')}}</Button>
                </FormItem>

            </Form>
        </Row>
        <Card>
            <p slot="title">
                {{ $t('待打款列表') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="addModal" v-if="$store.state.user.checkPerm('legal:withdrawls:wait:batchConfirm')">{{ $t('批量操作') }}</Button>




            <Row type="flex" justify="center" align="middle" class="autoQueryList">

                <expandTable :columns="columns" :data="banks"  v-if="$store.state.user.checkPerm('legal:withdrawls:trial:list')">
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
                                    <span v-if='row.remark'>{{row.remark}}111111111111</span>
                                </div>
                            </TabPane>

                        </Tabs>

                    </template>
                </expandTable>


                <!-- <Table :columns="columns" :data="banks" style="width: 100%;"></Table> -->
            </Row>
            <div class="page-pane"  v-if="$store.state.user.checkPerm('legal:withdrawls:trial:list')">
                <Button @click='selectPrev()'>{{$t('上一页')}}</Button>
                <Button @click='selectNext()'>{{$t('下一页')}}</Button>

            </div>
        </Card>

        <Drawer :show="modalConfig" @close="modalConfig = false" width="800px" placement="right">
            <p slot="header">{{ $t('批量上传') }}</p>


            <Form :model="obj" :rules="ruleItem" class="modal-form" ref="rule" :label-width="150">
                <FormItem :label="$t('用户状态')">
                    <RadioGroup v-model="obj.checkStatus">
                        <Radio label="10">
                            <span>{{$t('付款成功')}}</span>
                        </Radio>
                        <Radio label="11">
                            <span>{{$t('付款失败')}}</span>
                        </Radio>
                        <Radio label="9">
                            <span>{{$t('不处理')}}</span>
                        </Radio>

                    </RadioGroup>
                </FormItem>

                <FormItem :label="$t('批量上传提现申请单')">




             <FileUpload ref="uploadFile" v-on:success="uploadSuccess" action="/v1/legal/withdrawls/wait/upload" name='uploadFile' :format="format">
            </FileUpload>
              <p>{{$t("请将申请单ID在CSV表格中按列输入并上传")}}</p>
                </FormItem>

                <FormItem :label="$t('备注')" prop="reason">
                    <Input :rows='10' type="textarea" v-model="obj.remark"></Input>
                </FormItem>
                <FormItem :label="$t('')" prop="reason">
                        <Button type="primary" @click="submit">{{$t('保存')}}</Button>

                </FormItem>


            </Form>




            <!-- <BankAccountAdd :bankinfo='editbank' :bankNames="bankNames" @cancel="modalConfig = false" @success="addSuccess"></BankAccountAdd> -->
            <!-- <ApplyListAdd @cancel="drawerShow = false"></ApplyListAdd> -->
        </Drawer>
        <UploadResult :show.sync='resultModal' @output="outputFail" :result="uploadRes" @cancel="cancelUpload" @confirm='confirmUpload' ></UploadResult>

        <Modal v-model="configModal" width="500" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('现将申请单状态置为')}}</span>
            </p>
            <!-- <pre>{{configObj}}</pre> -->
            <Form :model="configObj" :rules="ruleItem" class="modal-form" ref="rule" :label-width="80">
                <FormItem :label="$t('用户状态')">
                    <RadioGroup v-model="configObj.checkStatus">
                        <Radio label="10">
                            <span>{{$t('付款成功')}}</span>
                        </Radio>
                        <Radio label="11">
                            <span>{{$t('付款失败')}}</span>
                        </Radio>
                        <Radio label="9">
                            <span>{{$t('不处理')}}</span>
                        </Radio>

                    </RadioGroup>
                </FormItem>

                <FormItem :label="$t('备注')" prop="reason">
                    <Input :rows='10' style='width:300px;' type="textarea" v-model="configObj.remark"></Input>
                </FormItem>


            </Form>

            <div slot="footer">
                <Button type="primary" @click="confirmConfig">{{$t('确定')}}</Button>
                <Button type="ghost" @click="configModal = false">{{$t('返回')}}</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
import { legalTender } from '__util/api'
import util from '__util/util'
import {Button} from 'iview'
import Drawer from '__components/drawer.vue'
import {statusArr} from './status'
import FileUpload from '__components/fileUpload.vue'
import UploadResult from '@/components/uploadResult'
import expandTable from '__components/expandTable.vue'

const query = {
  list:{method:'post',url:'v1/legal/withdrawls/wait/list'},
  confirm:{method:'post',url:'v1/legal/withdrawls/wait/batchConfirm'},
  cancel:{method:'get',url:'v1/legal/withdrawls/cancelUpload'},
  excel:{method:'get',url:'v1/legal/withdrawls/wait/listExp'},
  outputfail:{method:'get',url:'v1/legal/withdrawls/fileExp'},

  config:{method:'post',url:'v1/legal/withdrawls/confirmation'},

}
export default {
    components:{
        Drawer,
        FileUpload,
        UploadResult,
        expandTable
    },
    bankinfo:{},
    data () {
        return {
            configObj:{
                checkStatus:'10',

            },
            configModal:false,


            resultModal:false,
            uploadRes:{},
            format:['csv','xls','xlsx'],

          obj:{
            checkStatus:'10',
            key:'',
            remark:''
          },
            ruleItem: {

            },
            modalConfig:false,
            accountType:['普通','大客户'],
            useStatus:['使用中','暂停'],
            accountStatus:['正常','停止'],
            banks:[],
            bankNames:[],
            accountNames:[],
            editbank:{},
            form:{
                size:10,
                direct:'',
                from:''
            },
            prevList:[],
            dateRange: [],
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            statusArr:statusArr,

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
                    width:80,
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
                    width:90,
                    key: 'receiptBank'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('银行帐号')
                    },
                    width:140,
                    key: 'receiptNo'
                },

                {
                    renderHeader: (h) => {
                        return this.$t('提现金额')
                    },
                    width:90,
                    key: 'withdrawalsAmount',
                    render:(h,param)=>Number(param.row.withdrawalsAmount)
                },

               {
                    renderHeader: (h) => {
                        return this.$t('手续费')
                    },
                    width:80,
                    key: 'withdrawalsFee',
                    render:(h,param)=>Number(param.row.withdrawalsFee)

                },

                {
                    renderHeader: (h) => {
                        return this.$t('实提金额')
                    },
                    width:100,
                    key: 'withdrawalsRealAmount',
                    render:(h,param)=>Number(param.row.withdrawalsRealAmount)

                },

                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    width:80,
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
                    render:(h,param)=>this.getSafestatus(param.row.safe)
                },



                // {
                //     renderHeader: (h) => {
                //         return this.$t('类型')
                //     },
                //     key: 'customType',
                //     render:(h,params)=>this.accountType[params.row.customType]
                // },




                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width:150,
                    // align:"center",
                    key: 'value',
                    render: (h, params) => {

                        return <div style="width:200px">
                            <Button style='margin-right:10px' type='primary' size='small' onClick={()=>{this.expandStatus(params.row)}}>{params.row._expand?this.$t('收起'):this.$t('更多')}</Button>

                            {this.$store.state.user.checkPerm('legal:withdrawls:confirmation')?<Button type="primary" size='small' onClick={()=>this.config(params.row)}>{this.$t('置为')}</Button>:null}


                        </div>
                    }
                }
            ]
        }
    },
    mounted () {
        if (this.$store.state.user.checkPerm('legal:withdrawls:wait:list')) {
            this.getList()
            this.getBankName()
            this.getAccountName()
        }
    },


    methods: {
        selectPrev(){
            this.form.direct = 'prev'
                this.form.from = Number(this.banks[0].id)-1
            

            this.getList(true)

        },
        selectNext(){
            this.form.direct = 'next'
            this.form.from = Number(this.banks[this.banks.length-1].id)+1
            
            this.getList(true)

        },

        config(item){
            this.configModal = true
            this.configObj.id = item.id
        },
        async confirmConfig(){
            const ret = {
                '9': this.$t('不处理'),
                '10': this.$t('付款成功'),
                '11': this.$t('付款失败'),
            }
            this.configObj.checkMsg = ret[this.configObj.checkStatus]||''

            const obj = {...query.config,data:{...this.configObj,id:Number(this.configObj.id)}}
            const res = await this.$axios(obj)
            if(res.success){
                this.getList()

                this.configModal = false
                this.$Message.success(this.$t('修改成功'))
            }
            console.log(res)
        },
        async outputFail(){
            const res = await this.$axios({...query.outputfail,params:{key:this.obj.key,status:'failure'}})
            if(res.success){
                util.download(res.data)
            }
        },
        async cancelUpload(){
            query.cancel.params = {key:this.obj.key}
            const res = await this.$axios(query.cancel)
            if(res.success){
                this.resultModal = false
            }
            // console.log(res)

        },
        confirmUpload(){
            this.resultModal = false
            this.modalConfig = false
            this.$Message.success("上传成功")
            this.getList()
        },
        uploadSuccess(res){
            this.obj.key = res

        },
        expandStatus (row) {
            this.banks.some((v,i)=>{

                if(row.id===v.id){
                    let obj = Object.assign({}, v, {_expand: !v._expand})
                    this.banks.splice(i, 1,obj)
                    return true
                }
            })
        },

        async upload(){

            const obj = {...query.confirm,data:this.obj}
            const res = await this.$axios(obj)
            if(res.success){
                this.uploadRes=res.data
                this.resultModal = true

            }
        },

        submit () {
            const self = this
            this.$refs['rule'].validate((valid) => {
                if (valid) {
                    this.upload()

                    // this.accountNames = res.data


                }
            });
        },




        getSafestatus(status){
            return status && status.indexOf('_RISH')>-1?this.$t('风险'):this.$t('安全')
        },
    clickTab(){},
        addSuccess(){
            this.modalConfig = false
            this.getList()
        },
        addModal(){
            this.modalConfig = true
            this.editbank = {}
            console.log('add Bank modal')
        },

        async output(){
          this.search()
          if(this.form.withdrawalsAmount){
            this.form.withdrawalsAmount = Number(this.form.withdrawalsAmount)
          }
          query.excel.params = {...this.form}

          const res= await this.$axios(query.excel)
          if(res.success){
              this.$Modal.confirm({
                  title:this.$t('确定导出'),
                  content:this.$t('确定导出')+res.data.total+this.$t('条数据？'),
                  onOk(){
                         util.download(res.data.url)

                  }
              })
          }
        },
        search () {
            this.getList()
        },
        async getAccountName(bankName=''){
            const obj = {...legalTender.accountName,data:{bankName}}
            const res = await this.$axios(obj)
            this.accountNames = res.data

        },
        async getBankName(){
            const res = await this.$axios(legalTender.bankInfo)
            this.bankNames = res.data
            console.log('info',res)
        },
        async getList (prev_next) {

            if(!prev_next){
                this.form.direct=''
                this.form.from = ''
            }


          if(this.form.withdrawalsAmount){
            this.form.withdrawalsAmount = Number(this.form.withdrawalsAmount)
          }

            query.list.data = {...this.form}
            // query.list.data.page = page ? page : this.page.currPage
            // query.list.data.limit =  this.page.pageSize

            let res = await this.$axios(query.list)
            // this.banks = res.data

            let banks = res.data

            if(!prev_next){
                this.banks = banks
                return false                    
            }
            
            
            if(banks.length){
                this.prevList = [...banks]
                this.banks = banks
            }else{
                this.banks = [...this.prevList]
            }

            // console.log(res)
            // this.page.currPage = res.data.currPage
            // this.page.pageSize = res.data.pageSize
            // this.page.total = res.data.totalCount
        }
    },
    watch: {
        dateRange (val) {
                this.form.startDate = val[0]?this.$moment(val[0]).format():''
                this.form.endDate = val[1]?this.$moment(val[1]).format():''
        },
        // resultModal(val){

        // },
        modalConfig(val){
            if(!val){
                this.obj ={
                    checkStatus:'10',
                    key:'',
                    remark:''
                }
                this.uploadRes = {}
                this.$refs.uploadFile.clearFiles()

            }
        },
        configModal(val){
            if(!val){
                this.configObj={
                    checkStatus:'10',

                }

            }
        }
    },
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
