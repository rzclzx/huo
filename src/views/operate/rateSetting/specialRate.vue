<template>
    <div class="l-content">
        <div class="l-main">
            <div class="l-search" v-if="$store.state.user.checkPerm('trade:fee:group:list')">
                <Select v-model="groupingTypeVal" class="l-select" :placeholder="$t('分组状态')" style="width: 150px;" v-autoLocale>
                    <Option v-for="item in groupingType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input v-model="groupingVal" :placeholder="$t('用户分组查询')" class="l-grouping-input"></Input>
                <Button type="primary" v-if="$store.state.user.checkPerm('trade:fee:group:list')" v-on:click="groupingFilter">{{$t('查询')}}</Button>
            </div>
            <div class="l-table-body">
                <h2>
                    {{$t('特殊费率分组列表')}}
                    <div class="l-operation">
                        <a @click="dataExport" v-if="$store.state.user.checkPerm('trade:fee:group:list:exp')">{{$t('导出数据')}}</a>
                        <Button type="primary" size="small" v-if="$store.state.user.checkPerm('trade:fee:group:add')" class="m-btn" v-on:click="show">{{$t('添加费率分组')}}</Button>
                    </div>
                </h2>
                <div class="l-table-body-group" v-for="item in groupListData" v-if="groupListData.length > 0">
                    <Table :columns="groupListTable" :data="item" disabled-hover></Table>
                    <div class="l-trade">
                        <span>{{$t('已配交易对')}}：</span><span><span class="trade" v-for="e in item[0].symbolList">{{ e }}</span></span>
                    </div>
                </div>
                <div class="none-data" v-if="groupListData.length === 0">
                    {{$t('暂无数据')}}
                </div>
                <div class="l-tfoot" v-if="totalCount">
                    <Page show-elevator :total="totalCount" :page-size="pageSize" :current="currPage" @on-change="getGroupPage" size="small" show-total>
                        <slot>
                            {{ $t('共') + ' ' + totalCount + ' ' + $t('条') }}
                        </slot>
                    </Page>
                </div>
            </div>
        </div>
        <Modal
            v-model="modalResult"
            :title="$t('结果反馈')"
            class-name="modal-clear-line"
            width="800"
            >
            <div class="result-title">
                {{ $t('共') + result.totalCount + $t('条') + 'UID' + $t('成功添加') + result.successCount + $t('条') + ',' + $t('失败') + result.failureCount + $t('条')  }}
            </div>
            <Table :columns="failCols" :data="result.failureResults" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
             <div slot="footer" style="border-top: 0">
               <a style="margin-right:10px;color:#1991EB;" @click="excpFailure">{{$t('导出失败Excel')}}</a>
               <Button type="primary" @click="cancelUpload">{{$t('取消上传')}}</Button>
               <Button type="primary" @click="modalResult = false">{{$t('确定')}}</Button>
            </div>
        </Modal>

        <Drawer :show="modalRate" @close="modalRate = false" width="800px" placement="right">
            <p slot="header">{{ $t('添加特殊费率组') }}</p>
            <Form :model="formItem" ref="formRateEdit" :label-width="110" :rules="formRules">
                <FormItem prop="groupName" :label="$t('特殊费率组名称')">
                    <Input v-model="formItem.groupName" :placeholder="$t('分组名称')" class="m-input"></Input>
                </FormItem>
                <FormItem prop="symbolName" :label="$t('交易对选择')">
                    <Select v-model="formItem.symbolName" multiple class="m-input" @on-change="symbolEvent" v-autoLocale>
                        <Option :value="$t('全部')">{{$t('全部')}}</Option>
                        <Option v-for="item in symbolNames" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="markerFee" :label="$t('Maker（%）')">
                    <Input v-model="formItem.markerFee" :placeholder="$t('单位：百分比。例如：0.2')" class="m-input"></Input>
                </FormItem>
                <FormItem prop="takerFee" :label="$t('Taker（%）')">
                    <Input v-model="formItem.takerFee" :placeholder="$t('单位：百分比。例如：0.2')" class="m-input"></Input>
                </FormItem>
                <FormItem prop="dateValue" :label="$t('时间')">
                    <DatePicker v-model="formItem.dateValue" type="datetimerange" format="yyyy-MM-dd HH:mm" :placeholder="$t('开始时间 - 起 -- 截止时间 - 止')" class="m-input" :options="chooseDate" @on-change="dateEvent" style="width: 100%"></DatePicker>
                </FormItem>
                <FormItem prop="uid" :label="$t('添加用户')">
                    <Input v-model="formItem.uid" :placeholder="$t('用户UID，以英文逗号分隔')" type="textarea" class="m-input"></Input>
                </FormItem>
                <Form-item :label="$t('分组用户')">
                    <FileUpload
                        :file="formItem.file"
                        action="/v1/pro/operate/tradeFee/batchUpload"
                        :format="['csv']"
                        v-on:error="uploadError"
                        v-on:success="uploadSuccess"
                        name="uploadFile"
                        :disabled="!$store.state.user.checkPerm('trade:fee:group:file:upload')"></FileUpload>
                        <!-- <span>{{ $t('请将用户UID在Excel表格中按列输入并上传') }}</span> -->
                        <a @click="downCSV" v-if="$store.state.user.checkPerm('trade:fee:group:file:exp')">{{ $t('下载用户分组CSV') }}</a>
                </Form-item>
                <FormItem prop="memo" :label="$t('备注说明')">
                    <Input v-model="formItem.memo" placeholder="" type="textarea" class="m-input"></Input>
                </FormItem>
            </Form>
            <div style="text-align: center;">
                <Button type="primary" @click="specialRateSave">{{$t('保存')}}</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import { operation, exchange } from '__util/api'
    import handler from '__util/publicMethod'
    import FileUpload from '@/components/fileUpload'
    import Drawer from '__components/drawer.vue'

    export default {
        components: {
            FileUpload,
            Drawer
        },
        data () {
            // 正整数验证
            const intCheck = (rule, value, callback) => {
                if ( /^\-?[0-9]{1,10}([.][0-9]{1,8})?$/.test(value)) {
                    callback()
                } else {
                    callback(new Error(this.$t('请输入符合规则的数字')))
                }
            }
            // 当前时间验证
            const nowTime = (rule, value, callback) => {
                let now = this.$moment(new Date()).format('YYYY-MM-DD HH:mm')
                let start = this.$moment(value[0]).format('YYYY-MM-DD HH:mm')
                if ( start > now ) {
                    callback()
                } else {
                    callback(new Error(this.$t('开始时间不能小于当前时间')))
                }
            }
            // 分组名称验证
            const wordLength = (rule, value, callback) => {
                if (value.length <= 30 && !/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/.test(value)) {
                    callback()
                } else {
                    callback(new Error(this.$t('分组名称长度不能超过30个字符且不能包含特殊字符')))
                }
            }
            return {
                //特殊费率分组管理
                formItem: {symbolName: []},
                totalCount: 0,
                pageSize: 10,
                currPage: 1,
                failCols: [
                  {
                      key: 'uid',
                      renderHeader:() => {
                          return this.$t('添加失败UID')
                      }
                  },
                  {
                      key: 'reason',
                      renderHeader:() => {
                          return this.$t('失败原因')
                      }
                  }
                ],
                failList: [],
                groupListData: [],
                symbolNames: [],
                startDate: '',
                endDate: '',
                memo: '',
                // 设置日期不可选
                chooseDate: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000
                    }
                },
                formRules:{
                    groupName: [
                        {
                            required: true,
                            message: this.$t('特殊费率组名称不能为空'),
                            trigger: 'blur'
                        },
                        {
                            validator: wordLength,
                            trigger: 'blur'
                        }
                    ],
                    symbolName: [
                        {
                            required: true,
                            type: 'array',
                            message: this.$t('请至少选择一组交易对'),
                            trigger: 'blur'
                        }
                    ],
                    markerFee: [
                        {
                            required: true,
                            message: this.$t('请输入不能为空的数字'),
                            trigger: 'blur'
                        },
                        {
                            validator: intCheck,
                            trigger: 'blur'
                        }
                    ],
                    takerFee: [
                        {
                            required: true,
                            message: this.$t('请输入不能为空的数字'),
                            trigger: 'blur'
                        },
                        {
                            validator: intCheck,
                            trigger: 'blur'
                        }
                    ],
                    dateValue:[
                        {
                            required: true,
                            message: this.$t('请选择时间'),
                            type: 'array',
                            trigger: 'blur'
                        },
                        {
                            validator: nowTime,
                            trigger: 'change'
                        }
                    ]
                },
                modifyId: 0,
                del_loading: false,
                delSwitch: false,
                groupingType : [
                    {
                        value : '0',
                        label : this.$t('全部')
                    },
                    {
                        value : '1',
                        label : this.$t('待生效')
                    },
                    {
                        value : '2',
                        label : this.$t('生效中')
                    },
                    {
                        value : '3',
                        label : this.$t('已过期')
                    }
                ],
                groupingVal : '',
                groupingTypeVal : '',
                groupListTable: [
                    {
                        key: 'groupName',
                        renderHeader:() => {
                            return this.$t('用户组名称')
                        }
                    },
                    {
                        key: 'makerFee',
                        renderHeader:() => {
                            return this.$t('Maker')
                        },
                        render: (h, params) => {
                            return `${params.row.makerFee}%`
                        }
                    },
                    {
                        key: 'takerFee',
                        renderHeader:() => {
                            return this.$t('Taker')
                        },
                        render: (h, params) => {
                            return `${params.row.takerFee}%`
                        }
                    },
                    {
                        key: 'startTime',
                        renderHeader:() => {
                            return this.$t('开始时间')
                        }
                    },
                    {
                        key: 'endTime',
                        renderHeader:() => {
                            return this.$t('结束时间')
                        }
                    },
                    {
                        key: 'userNum',
                        renderHeader:() => {
                            return this.$t('分组人数')
                        }
                    },
                    {
                        key: 'status',
                        renderHeader:() => {
                            return this.$t('分组状态')
                        }
                    },
                    {
                        key: 'action',
                        renderHeader:() => {
                            return this.$t('操作')
                        },
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled: !this.$store.state.user.checkPerm('trade:fee:group:delete')
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modifyId  = params.row.id
                                            this.$Modal.confirm({
                                                title: this.$t('确认'),
                                                content: this.$t('确定删除'),
                                                onOk: this.del
                                            })
                                        }
                                    }
                                }, this.$t('删除')),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: !this.$store.state.user.checkPerm('trade:fee:group:update')
                                    },
                                    on: {
                                        click: () => {
                                            this.modifyId = params.row.id;
                                            this.modalRate = true;
                                            this.formItem.symbolName = params.row.symbolList
                                            this.formItem.groupName = params.row.groupName
                                            this.formItem.markerFee = params.row.makerFee.toString()
                                            this.formItem.takerFee = params.row.takerFee.toString()
                                            this.formItem.memo = params.row.memo
                                            this.formItem.dateValue = [params.row.startTime, params.row.endTime]
                                            this.startDate = params.row.startTime
                                            this.endDate = params.row.endTime
                                        }
                                    }
                                }, this.$t('修改'))
                            ]);
                        }
                    }
                ],
                modalRate: false,
                modalResult: false,
                result: {}
            }
        },
        methods: {
            // 导出数据
            dataExport () {
                let request = operation.groupListExp
                request.params = {
                    status : this.groupingTypeVal,
                    groupName : this.groupingVal
                };
                this.$axios(request).then((res)=>{
                    window.open( res.data );
                })
            },
            initForm () {
                this.formItem = {
                    symbolName: []
                }
            },
            show () {
                this.modalRate = true
                this.modifyId = 0
                this.formItem = {symbolName: []}
            },
            //搜索时间
            dateEvent (date) {
                this.startDate = date[0]
                this.endDate   = date[1]
            },
            //全选
            symbolEvent (array) {
                let index   = array.indexOf(this.$t('全部'));
                let symbols = this.symbolNames.join();
                if( index >= 0 ){
                    this.formItem.symbolName = symbols.split(',');
                }
            },
            //删除特殊费率分组
            del () {
                this.del_loading = true;
                let request = operation.groupDel;
                request.params = {
                    groupId : this.modifyId
                };

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.del_loading = false;
                        this.delSwitch   = false;
                        this.getGroupList ();
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            },
            //添加特殊费率分组-特殊费率分组
            specialRateSave () {
                // groupAdd
                this.$refs['formRateEdit'].validate((valid) => {
                    if (valid) {
                        this.modalRate = false
                        let request = operation.groupAdd;
                        request.params = {
                            symbols: this.formItem.symbolName.join(),
                            groupName: this.formItem.groupName,
                            markerFee: this.formItem.markerFee,
                            takerFee: this.formItem.takerFee,
                            startDateTime: this.startDate,
                            endDateTime: this.endDate,
                            memo: this.memo,
                            uid: this.formItem.uid,
                            key: this.formItem.key
                        }
                        if(this.modifyId){
                            request.params['groupId'] = this.modifyId
                        }
                        this.$axios(request).then((res)=>{
                            if(res.success){
                                this.getGroupList ()
                            }
                        })
                        .catch((error) => {
                            this.$Message.error( this.$t(error) )
                        })
                    }
                })
            },
            //特殊费率分组筛选
            groupingFilter (){
                this.currPage = 1;
                this.getGroupList();
            },
            //特殊费率分组管理
            getGroupList (){
                let request = operation.groupList;
                request.params = {
                    page : this.currPage,
                    pageSize : this.pageSize,
                    status : this.groupingTypeVal,
                    groupName : this.groupingVal
                }
                this.$axios(request).then((res)=>{
                    if(res.success){
                        res.data.list.map((e) => {
                            e[0].makerFee = Math.floor(e[0].makerFee * 10000) / 100
                            e[0].takerFee = Math.floor(e[0].takerFee * 10000) / 100
                            e[0].status   = this.$t(e[0].status)
                        })
                        this.groupListData = res.data.list
                        this.totalCount = res.data.totalCount
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            },
            //获取交易对
            getSymbolName (){
                let request = operation.symbolName;

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.symbolNames = res.data.symbolNames;
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            },
            //特殊费率分组管理分页
            getGroupPage ( num ){
                //审核列表分页
                this.currPage = num;
                this.getGroupList();
            },
            // 上传用户csv文件成功
            uploadSuccess (res) {
                this.formItem.key = res.key
                this.result = {...res}
                this.modalResult = true
            },
            uploadError () {

            },
            // 取消上传
            cancelUpload () {
                let request = {...operation.cancelUpload}
                request.params = {
                    key: this.formItem.key
                }
                this.$axios(request).then((res)=>{
                    this.modalResult = false
                    this.$Message.success( this.$t('操作成功') )
                })
            },
            // 导出失败文件
            excpFailure () {
                let request = {...operation.expFile}
                request.params = {
                    key: this.formItem.key,
                    status: 'failure'
                }
                this.$axios(request).then((res)=>{
                    window.open(res.data)
                })
            },
            // 下载csv
            downCSV () {
                let request = {...operation.downCSV}
                request.params = {
                    groupId: this.modifyId
                }
                this.$axios(request).then((res)=>{
                    window.open(res.data)
                })
            },
            // 导出失败
            exceptF () {

            }
        },
        created (){
            document.getElementsByTagName('body')['0'].className = 'l-del';
            if ( this.$store.state.user.checkPerm('trade:fee:group:list') ) {
                this.getGroupList()
            }
            this.getSymbolName()
        },
        watch: {
            modalRate (val) {
                if ( !val ) {
                    this.initForm()
                    this.$refs['formRateEdit'].resetFields()
                }
            },
            "$store.state.app.lang": {
                handler(val, oldVal) {

                    this.groupListData.map((e) => {
                        e[0].status   = this.$t(e[0].status)
                    })
                },
                deep: true
            }
        }
    }
</script>
<style>
.result-title {
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
}
.none-data{
    text-align: center;
    padding: 20px;
}
    .trade{
    padding-right: 10px;
    }
    .l-content .ivu-tabs .ivu-tabs-bar{
        height:61px;
        padding: 0 20px;
        background: #fff !important;
    }
    .l-content .ivu-tabs-nav .ivu-tabs-tab{
        padding: 20px 16px;
    }
    .l-content .ivu-table-wrapper{
        position: static;
    }

    .l-content .ivu-table:before {
        background-color: #fff;
    }
    .l-content .ivu-table:after {
        background-color: #fff;
    }
    .l-form .m-input .ivu-input{
        outline:none!important;resize:none!important;
    }
    .l-content .l-search .ivu-input-group-prepend{
        background: #fff;
    }
</style>
<style scoped>
    .l-content{
        margin:-10px;
    }
    .l-content .l-main{
        margin:0 20px;
    }
    .l-content .l-search{
        height: 32px;
        margin: 5px 0 20px 0;
    }
    .l-content .l-search .l-select-input{
        width: 100px;
    }
    .l-content .l-grouping-input{
        width: 200px;
        float: left;
        margin-right: 10px;
    }
    .l-content .l-select{
        float: left;
        width: 100px;
        margin-right: 10px;
    }
    .m-search{
        width: 360px;
        height: 32px;
        float: left;
        margin-right: 10px;
    }
    .m-search-btn{
        width: 60px;
    }
    .l-table-body{
        border-radius: 4px;
        border: 1px solid #E6EAEE;
        background: #fff;
    }
    .l-table-body h2{
        height: 50px;
        padding: 0 20px;
        font-size: 16px;
        color: #354052;
        line-height: 50px;
        text-align: left;
        font-weight: normal;
        border-bottom: 1px solid #E6EAEE;
    }
    .l-table-body .ivu-table-wrapper{
        border:0;
    }
    .l-table-body .l-tfoot{
        height: 48px;
        padding: 0 20px;
        text-align: right;
        border-top: 1px solid #E6EAEE;
        position: relative;
        top: -1px;
        z-index: 10;
    }
    .l-table-body .l-tfoot .ivu-page{
        padding: 12px 0;
    }
    .l-form{

    }
    .l-form li{
        // overflow: hidden;
        padding-top: 10px;
        padding-bottom: 10px;

    }
    .l-form li .ivu-select-dropdown-list li{
        line-height: 24px;
    }
    .l-form label{
        float: left;
        width: 100px;
        text-align: right;
        padding: 7px 10px 0 0;
    }
    .l-form .m-input{
        width: 388px;
    }

    .l-content .m-export{
        float: right;
        margin-top: 9px;
    }
    .l-content .l-operation{
        float: right;
        font-size: 12px;
        padding-right: 10px;
    }
    .l-content .l-operation .m-btn{
        margin-left: 10px;
    }
    .l-content .l-trade{
        /*white-space: nowrap;*/
        border-top: 1px solid #E6EAEE;
        border-bottom: 1px solid #E6EAEE;
        padding: 0 18px;
        line-height: 48px;
    }
    .l-content .l-trade span{
        word-wrap:break-word;
    }
    .l-form .l-radio label{
        text-align: left;
        width: auto;
    }
    .mb-20{
        margin-bottom: 20px;
    }
</style>
