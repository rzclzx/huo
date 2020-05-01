<template lang="html">
    <div class="autoQuery" id='vip-admin'>
        <Row type="flex" >
            <Form :model="form" inline>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('UID')" v-model="form.uid"/>
                </FormItem>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('手机号')" v-model="form.phone"/>
                </FormItem>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('邮箱')" v-model="form.email"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('manuallegal:hbvipcustomer:list')">{{$t('查询')}}</Button>
                </FormItem>
            </Form>
        </Row>
        <Card>
            <p slot="title">
                {{ $t('银行信息') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="addModal"  v-if="$store.state.user.checkPerm('manuallegal:hbvipcustomer:add')">{{ $t('添加') }}</Button>
            <Row type="flex" justify="center" align="middle" class="autoQueryList">
                <Table :columns="columns" :data="vips" style="width: 100%;"></Table>
            </Row>
            <div class="page-pane" v-if='vips.length'>
                <Page :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="getList" size="small" show-total  v-if="$store.state.user.checkPerm('manuallegal:hbvipcustomer:list')">
                    <slot>
                        {{ $t('共') + ' ' + page.total + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Drawer :show="modalAdd" @close="modalAdd = false" width="800px" placement="right">
            <p slot="header">{{ $t('添加大客户') }}</p>
            <div id='modal-add'>
            <Row style="margin-top: 15px; margin-bottom: 15px;">
                <Col span="5" style='text-align:center'>
                    UID
                </Col>
                <Col span="15">
                <Tabs type="card">
                    <TabPane :label="$t('添加')">
                        <Input type="textarea" v-model='addForm.uids' :rows='10' style="width: 100%"  :placeholder="$t('')"></Input>
                        <div style="text-align: center;margin-top:20px;">
                            <Button type="primary" @click="save">{{$t('保存')}}</Button>
                        </div>

                    </TabPane>
                    <TabPane :label="$t('批量添加')" v-if="$store.state.user.checkPerm('manuallegal:hbvipcustomer:batchAdd')">
                        <div class="upload-container">
                            <FileUpload ref="uploadfile" v-on:success="uploadSuccess" action="/v1/manuallegal/hbvipcustomer/addCsv" name='uploadFile' :format="format">
                            </FileUpload>
                            <p>{{$t('请将用户UID在CSV表格中按列输入并上传')}}</p>
                        </div>
                    </TabPane>
                </Tabs>
                </Col>
            </Row>
            </div>

            <!-- <BankAccountAdd  @cancel="modalAdd = false"></BankAccountAdd> -->
            <!-- <ApplyListAdd @cancel="drawerShow = false"></ApplyListAdd> -->
        </Drawer>
        <UploadResult :canceltext='cancelText' :noexcel='noexcel' :show.sync='resultModal' @output="outputFail" :result="uploadRes" @cancel="cancelUpload" @confirm='confirmUpload' ></UploadResult>
    </div>
</template>

<script>
import { legalTender } from '__util/api'
import util from '__util/util'
import {Button} from 'iview'
import Drawer from '__components/drawer.vue'
import BankAccountAdd from './bankAccountAdd.vue'
import FileUpload from '__components/fileUpload.vue'
import UploadResult from '__components/uploadResult.vue'
export default {
    components:{
        Drawer,
        BankAccountAdd,
        UploadResult,
        FileUpload
    },
    data () {
        return {
            format:['csv','xls','xlsx'],
            addForm:{},
            modalAdd:false,
            resultModal:false,
            uploadRes:{

            },
            cancelText:'取消',
            noexcel:false,
            vipStatus:[this.$t('正常'),this.$t('关闭')],
            vips:[],
            form:{

            },
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('UID')
                    },
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('姓名')
                    },
                    key: 'name'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('手机号')
                    },
                    key: 'phone'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('邮箱')
                    },
                    key: 'email',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'status',
                    render:(h,params)=>this.vipStatus[params.row.status]
                },

                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width:"200px",
                    align:"center",
                    key: 'value',
                    render: (h, params) => {
                        return <div style="width:200px">
                             {this.$store.state.user.checkPerm('manuallegal:hbvipcustomer:open:close')?<Button style='marginRight:5px' type="primary" size='small' onClick={()=>this.toggle(params.row)}> {params.row.status==0?this.$t('关闭'):this.$t('开启')}</Button>:null}

                            {this.$store.state.user.checkPerm('manuallegal:hbvipcustomer:del')?<Button type="error" size='small' onClick={()=>this.remove(params.row)}>{this.$t('删除')}</Button>:null}
                        </div>
                    }
                }
            ]
        }
    },
    mounted () {
        if (this.$store.state.user.checkPerm('manuallegal:hbvipcustomer:list')) {
            this.getList()
        }
    },

    methods: {
        async outputFail(){
            const res = await this.$axios({...legalTender.bigExcel,data:{key:this.uploadRes.key}})
            if(res.success){
                util.download(res.data)
            }

        },
        cancelUpload(){
            this.resultModal = false
            this.noexcel = false

        },
        async confirmUpload(){
            this.resultModal = false
            this.addForm.key = this.uploadRes.key
            this.addForm.uids = ''

            const obj = {...legalTender.bigComfirmAdd, data:this.addForm}
            const res = await this.$axios(obj)
            if(res.success){
                this.$Message.success(this.$t('添加成功'))
                this.getList()
                this.modalAdd = false
                this.noexcel = false

            }


            // bigComfirmAdd
        },
        uploadSuccess(res){
            this.uploadRes.key = res.key
            this.resultModal = true
            this.uploadRes.successCount = res.normalTotal
            this.uploadRes.failureCount = res.existTotal+res.notExistTotal

            this.uploadRes.totalCount =this.uploadRes.successCount+this.uploadRes.failureCount
            this.uploadRes.failureResults = [
                ...Object.entries(res.exist).map(v=>{
                    return {uid:v[0],reason:this.$t('uid已存在')}
                }),
                ...Object.entries(res.notExist).map(v=>{
                    return {uid:v[0],reason:this.$t('uid不存在')}
                })

            ]
        //   totalCount successCount  failureCount failureResults
                        // {uid: 2723, reason: "uid不存在"}

                    // {uid: 2724, reason: "uid不存在"}
            // @output="outputFail" :result="uploadRes" @cancel="cancelUpload" @confirm='confirmUpload'
        },
        addModal(){
            this.modalAdd = true
        },
        async save(){
            if(this.addForm.uids){
                this.noexcel = true
                const obj = {...legalTender.bigAdd, data:this.addForm}
                const res = await this.$axios(obj)
                if(res.success){
                    this.uploadSuccess(res.data)

                }
            }
            // if(this.addForm.key){
            //     const obj = {...legalTender.bigComfirmAdd, data:this.addForm}
            //     const res = await this.$axios(obj)
            //     if(res.success){
            //         this.$Message.success(this.$t('添加成功'))
            //         this.getList()
            //         this.modalAdd = false
            //     }
            // }
        },
        toggle(item){
            let obj = {}
            if(item.status==0){
                obj.title='关闭大客户'
            }else{
                obj.title='开启大客户'
            }
            const self = this
            this.$Modal.confirm({
                title: this.$t(obj.title),
                content: `<p>${this.$t('确定要'+obj.title)}${item.name}?</p>`,
                async onOk(){
                    if(item.status===0){
                        const obj = {...legalTender.bigClose,data:{id:item.id}}
                        const res = await self.$axios(obj)
                        if(res.success){
                            self.$Message.success(self.$t('停用成功'))
                            self.getList()
                        }
                    }else{
                        const obj = {...legalTender.bigOpen,data:{id:item.id}}
                        const res = await self.$axios(obj)
                        if(res.success){
                            self.$Message.success(self.$t('开启成功'))
                            self.getList()
                        }
                    }

                },
                onCancel: () => {
                    // this.$Message.info('Clicked cancel');
                }
            });
        },
        remove(item){
            // this.$
            const self = this
            this.$Modal.confirm({
                title: this.$t('删除大客户'),
                content: `<p>${this.$t('确定要删除大客户')}${item.name}?</p>`,
                async onOk(){
                    const obj = {...legalTender.bigDel,data:{id:item.id}}
                    const res = await self.$axios(obj)
                    if(res.success){
                        self.$Message.success(self.$t('删除成功'))
                        self.getList()
                    }


                },
                onCancel: () => {
                    // this.$Message.info('Clicked cancel');
                }
            });



        },
        search () {
            this.getList()
        },
        async getInfo(){

        },
        async getList (page) {
            // this.form.uid = Number(this.form.uid)
            legalTender.bigList.data = {...this.form}
            legalTender.bigList.data.page = page ? page : this.page.currPage
            legalTender.bigList.data.limit =  10

            let res = await this.$axios(legalTender.bigList)
            if(!res.data){
                this.vips = []
                return false
            }
            if(res.data.list){
                this.vips = res.data.list
                // console.log(res)
                this.page.currPage = res.data.currPage||1
                this.page.pageSize = res.data.pageSize||10
                this.page.total = res.data.total

            }else{
                this.vips = [res.data]
                this.page.currPage = 1
                this.page.pageSize = 10
                this.page.total = 1
            }

        }
    },
    watch: {
        dateRange (val) {
            this.formItem.startTime = this.$moment(val[0]).format()
            this.formItem.endTime = this.$moment(val[1]).format()
        },
        modalAdd(val){
            if(!val){
                this.addForm = {}
                    this.$refs.uploadfile.clearFiles()

                // this.$refs.uploadfile.clearFiles()
            }
        }
    }
}


const getInput = (vm, h, params, type) => {
    return h('div', {
        style: {
            height: '50px',
            lineHeight: '50px'
        }
    }, [
        h('Input', {
            props: {
                value: params.row[type],
                disabled: !vm.$store.state.user.checkPerm('risk:management:update')
            },
            style: {
                height: '30px',
                lineHeight: '30px'
            },
            on: {
                input: (val) => {
                    params.row[type] = val
                },
                'on-blur': () => {
                    if (params.row[type] === '') {
                        params.row[type] = null
                    }
                }
            }
        })
    ])
}


const getButton = (vm, h, params, type, code) => {
    return h('Button', {
        props: {
            type: 'primary',
        },
        on: {
            click: () => {
                // let obj = handler.clone(limit.common.commonUpdate)
                // legalTender
                let obj = {...legalTender.userLimitUpdate}
                // console.log(params)
                // console.log(obj)
                console.log(code)
                let valid = false
                if(code=='day'){
                    if (validate(vm, params.row.dailyLevel1) && validate(vm, params.row.dailyLevel2) && validate(vm, params.row.dailyLevel3) && validate(vm, params.row.dailyLevel4)) {
                        valid = true
                    }
                }
                if(code=='month'){
                    if (validate(vm, params.row.monthlyLevel1) && validate(vm, params.row.monthlyLevel2) && validate(vm, params.row.monthlyLevel3) && validate(vm, params.row.monthlyLevel4)) {
                        valid = true
                    }
                }


                if (valid) {
                    obj.data = {
                        currency: params.row.currency,
                        // operator: code=='day'?0:1,
                        dailyLevel1: params.row.dailyLevel1,
                        dailyLevel2: params.row.dailyLevel2,
                        dailyLevel3: params.row.dailyLevel3,
                        dailyLevel4: params.row.dailyLevel4,
                        monthlyLevel1: params.row.monthlyLevel1,
                        monthlyLevel2: params.row.monthlyLevel2,
                        monthlyLevel3: params.row.monthlyLevel3,
                        monthlyLevel4: params.row.monthlyLevel4,
                    }

                    vm.$axios(obj).then(res => {
                        vm.$Modal.info({
                            content: vm.$t('修改成功')
                        })
                        vm.refresh()
                    }).catch(res => {
                        vm.$Modal.error({
                            content: vm.$t('errorCode.' + res)
                        })
                        vm.refresh()
                    })
                }
            }
        }
    }, vm.$t('修改'))
}

</script>

<style lang="less">
#modal-add{
    .ivu-tabs-bar{
        margin-bottom:0;
    }
    .ivu-input{
        border-radius: 0;
    }
    .upload-container{
        width:100%;
        height:220px;
        border:1px solid #dddee1;
        border-left:none;
        padding:15px;
    }

}

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


    // #vip-admin > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    //     background: #fff;
    //     padding: 16px;
    // }

    // #vip-admin > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    //     border-color: transparent;
    // }

    // #vip-admin > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    //     border-color: #fff;
    // }








</style>
