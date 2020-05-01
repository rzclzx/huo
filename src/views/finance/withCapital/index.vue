<template>
    <div class="l-content">
        <Modal
            @on-cancel="close"
            v-model="popCapital"
            :title="title"
            :loading="loading"
            >
            <p slot="header">
                <span>{{ $t(title) }}</span>
            </p>
            <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="100">
                <div class="l-form">
                    <ul>
                        <li>
                            <FormItem prop="amount" :label="labelType">
                                <Input v-model="formItem.amount" placeholder="0" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('Google双重验证')}}</label>
                            <FormItem prop="captcha">
                                <Input v-model="formItem.captcha" placeholder="" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('备注')}}</label>
                            <FormItem prop="comment">
                                <Input v-model="formItem.comment" placeholder="" type="textarea" class="m-input"></Input>
                            </FormItem>
                        </li>
                    </ul>
                </div>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancel('formItem')">{{ $t('取消') }}</Button>
                <Button type="primary" @click="save('formItem')">{{ $t('确定') }}</Button>
            </div>
        </Modal>
        <Tabs value="account" @on-click="tabs" class="l-tabs">
            <TabPane :label="$t('账户配资')" name="account" v-if="$store.state.user.checkPerm('pro:fince:system:assets')">
                <div class="l-main">
                    <Form ref="formItemCurr" :model="formItemCurr" :rules="ruleItemCurr" v-if="$store.state.user.checkPerm('pro:fince:system:assets:list')">
                        <FormItem prop="curr">
                            <Input v-model="formItemCurr.curr" :placeholder="$t('搜索币种')" class="m-search" @on-keyup="keyup"></Input>
                            <Button type="primary" v-on:click="search( 'formItemCurr' )">{{$t('查询')}}</Button>
                        </FormItem>
                    </Form>
                    <div class="l-table-body">
                        <h2>{{$t('账户明细')}}</h2>
                        <Table :columns="assetsTable" :data="assetsList" :no-data-text="this.$t('暂无数据')"></Table>
                    </div>
                </div>
            </TabPane>
            <TabPane :label="$t('历史记录')" name="history" v-if="$store.state.user.checkPerm('pro:fince:system:assets:history')">
                <div class="l-main">
                    <div class="l-filter fix" v-if="$store.state.user.checkPerm('pro:fince:system:assets:historyList')">
                        <h2>{{$t('筛选条件')}}</h2>
                        <div class="l-search fix">
                            <Select v-model="currencyName" multiple  class="l-screen" :placeholder="$t('请选择币种')"  @on-change="symbolEvent" v-autoLocale>
                                <Option :value="$t('全部')">{{$t('全部')}}</Option>
                                <Option v-for="item in currencyList" :value="item" :key="item">{{ item.toUpperCase() }}</Option>
                            </Select>
                            <Select v-model="historyTransferType" class="l-select" :placeholder="$t('操作类型')" v-autoLocale>
                                <Option value="" key="">{{$t('全部')}}</Option>
                                <Option v-for="item in operationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <DatePicker type="datetimerange" :placeholder="$t('配资时间')" class="l-date-picker" @on-change="dateEvent"></DatePicker>
                            <Button type="primary" v-on:click="getHistoryQuery">{{$t('查询')}}</Button>
                        </div>
                    </div>
                    <div class="l-table-body">
                        <h2>
                            {{$t('总账户配资历史')}}
                            <Button type="primary" class="m-export" v-on:click="exports" v-if="$store.state.user.checkPerm('pro:fince:system:assets:historyListExp')">{{$t('数据导出')}}</Button>
                        </h2>
                        <Table :columns="historyListTable" :data="historyList"></Table>
                        <div class="l-tfoot" v-if="totalCount">
                            <Page show-elevator :total="totalCount" :page-size="pageSize" :current="currPage" @on-change="page" size="small" show-total>
                                <slot>
                                    {{ $t('共') + ' ' + totalCount + ' ' + $t('条') }}
                                </slot>
                            </Page>
                        </div>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import { finance } from '__util/api';
    export default {
        data () {
            const curr = ( rule, value, callback ) => {
                if(value == ""){
                    callback();
                    return;
                }
                if ( !/^[A-Za-z0-9]+$/.test(value)) {
                    callback(new Error(this.$t('只可以输入英文跟数字')));
                }
                else{
                    callback();
                }
            };
            const amount = ( rule, value, callback ) => {
                if (value < 0){
                    callback(new Error(this.$t('数额必须大于0')));
                    return;
                }
                if ( value === '' || value <= 0 ||  !/^\d+(\.\d+)?$/.test(value)) {
                    callback(new Error(this.$t('只可输入数字和小数点')));
                }
                else if( value.length > 30 ){
                    callback(new Error(this.$t('不大于30个字符')));
                }
                else{
                    callback();
                }
            };
            const captcha = ( rule, value, callback ) => {
                if ( value === '' || !/^[0-9]{6}$/.test(value) || value.length != 6 ) {
                    callback(new Error(this.$t('GA验证为6位纯数字')));
                }
                else{
                    callback();
                }
            };
            return {
                title: this.$t("总账户配资"),
                loading  : true,
                /** 历史记录 **/
                //搜索
                historyTransferType : '',
                currencyName        : [],
                transferAccount     : '',
                startDate           : '',
                endDate             : '',
                currencyList        : [],
                operationList : [
                    {
                        value : 1,
                        label : this.$t('配资')
                    },
                    {
                        value : 0,
                        label : this.$t('减资')
                    }
                ],
                //分页
                totalCount       : 0,
                pageSize         : 10,
                currPage         : 1,
                //历史列表
                historyListTable : [
                    {
                        renderHeader: (h) => {
                             return this.$t('拨款ID')
                        },
                        key   : 'id'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('配资时间')
                        },
                        key   : 'createDate'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('配资子账户')
                        },
                        key   : 'currency'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作类型')
                        },
                        key    : 'operationType',
                        render : (h, params) => {
                            let type = params.row.operationType;
                            return type == 1 ? this.$t('配资') : this.$t('减资');
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨数额')
                        },
                        key   : 'amount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作人')
                        },
                        key   : 'operationPerson'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('备注')
                        },
                        key   : 'comment'
                    }
                ],
                historyList  : [],
                /** 账户配资 **/
                //搜索
                formItemCurr:{
                    curr : ''
                },
                ruleItemCurr : {
                    curr   : [
                        { validator: curr }
                    ]
                },
                //弹窗
                currency : '',
                formItem      : {
                    amount   : '',
                    captcha  : '',
                    comment  : '',
                },
                ruleItem : {
                    amount   : [
                        { validator: amount }
                    ],
                    captcha  : [
                        { validator: captcha }
                    ],
                    comment  : [
                        { required: true, message: this.$t('备注不能为空') }
                    ],
                },
                popCapital    : false,
                type          : '',
                accountId     : 0,
                accountUserId : 0,
                operationType : '',
                //账户配资列表
                assetsTable   : [{
                    renderHeader: (h) => {
                         return this.$t('币种名称')
                    },
                    key    : 'currency',
                    render : (h, params) => {
                        return params.row.currency.toUpperCase();
                    }
                },
                {
                    renderHeader: (h) => {
                         return this.$t('可用额度')
                    },
                    key   : 'amount'
                },
                {
                    renderHeader: (h) => {
                         return this.$t('操作')
                    },
                    key    : 'action',
                    width  : 300,
                    align  : 'center',
                    render : (h, params) => {
                        let pSwitch = true;
                        let jSwitch = true;
                        // disabled
                        //配资
                        if(this.$store.state.user.checkPerm('pro:fince:system:assets:increase')){
                            pSwitch = false;
                        }
                        //减资
                        if(this.$store.state.user.checkPerm('pro:fince:system:assets:reduce')){
                            jSwitch = false;
                        }

                        return h('div', [
                            h('Button', {
                                props : {
                                    type : 'primary',
                                    size : 'small',
                                    disabled : pSwitch,
                                },
                                style : {
                                    marginRight : '5px'
                                },
                                on : {
                                    click: () => {
                                        this.$refs['formItem'].resetFields();

                                        this.loading = true;
                                        //初始化数据
                                        this.formItem.amount  = '';
                                        this.formItem.captcha = '';
                                        this.formItem.comment = '';

                                        //设置提交数据
                                        this.operationType = '1';
                                        this.currency      = params.row.currency;
                                        this.popCapital    = true;
                                        this.type          = this.$t('配资');
                                        this.title         = this.$t('总账户配资');

                                    }
                                }
                            }, this.$t('配资')),
                            h('Button', {
                                props : {
                                    type : 'primary',
                                    size : 'small',
                                    disabled : jSwitch,
                                },
                                on : {
                                    click: () => {
                                        this.$refs['formItem'].resetFields();

                                        this.loading = true;
                                        //初始化数据
                                        this.formItem.amount  = '';
                                        this.formItem.captcha = '';
                                        this.formItem.comment = '';

                                        //设置提交数据
                                        this.operationType = '0';
                                        this.currency      = params.row.currency;
                                        this.popCapital    = true;
                                        this.type          = this.$t('减资');
                                        this.title         = this.$t('总账户减资');
                                    }
                                }
                            }, this.$t('减资'))
                        ]);
                    }
                }],
                assetsList: [],
            }
        },
        computed : {
            labelType () {
                return this.type + this.$t('数额');
            }
        },
        methods: {
            //全选
            symbolEvent (array) {
                let index    = array.indexOf(this.$t('全部'));
                let currency = this.currencyList.join();
                if( index >= 0 ){
                    this.currencyName = currency.split(',');
                }
            },
            save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //资产配减资
                        this.setAssetsData();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            //分页
            page (num){
                //历史配资列表分页
                this.currPage = num;
                this.getHistoryData();
            },
            //选项卡
            tabs (name){
                if(name == 'history' && this.$store.state.user.checkPerm('pro:fince:system:assets:historyList')){
                    this.getHistoryData();
                    this.getCurrency();
                }
            },
            keyup (e){
                if(e.keyCode == 13){
                    this.search('formItemCurr');
                }
            },
            search (name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //搜索
                        this.getData();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            //系统配资账户明细
            getData (){
                let request = finance.withCapital.assetsList;
                //币种搜索
                request.params = { 'currency' : this.formItemCurr.curr };
                //获取默认账户数据列表
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.assetsList    = res.data.data;
                        this.accountId     = res.data.accountId;
                        this.accountUserId = res.data.accountUserId;
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //历史记录数据
            getHistoryData (){
                let request = finance.withCapital.historyList;

                //设置POST请求数据
                request.data = {
                    "transferType"  : "1",
                    "page"          : this.currPage,
                    "limit"         : this.pageSize,
                    "startDate"     : this.startDate,
                    "endDate"       : this.endDate,
                    "currency"      : this.currencyName.join(),
                    "operationType" : this.historyTransferType
                };
                //获取历史记录列表
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.historyList = res.data.list;
                        this.totalCount  = res.data.totalCount;
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //资产配减资
            setAssetsData (){
                let request;
                if (this.operationType === '0') {
                    request = finance.withCapital.assetsReduce
                } else {
                    request = finance.withCapital.assetsIncrease
                }

                //设置get请求参数
                request.params   = { 'captcha' : this.formItem.captcha };

                //设置POST请求参数
                request.data     = {
                    "accountId"         : this.accountId,
                    "accountUserId"     : this.accountUserId,
                    "amount"            : this.formItem.amount,
                    "comment"           : this.formItem.comment,
                    "currency"          : this.currency,
                    "operationType"     : this.operationType
                }

                //设置配减资请求
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.popCapital = false;
                        this.$Message.success(this.$t(res.message));
                        this.getData();
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                    this.popCapital = false;
                })
            },
            //获取币种
            getCurrency () {
                //获取币种
                let currencyList = finance.operationOperation.currencyList;

                //获取历史记录列表
                this.$axios(currencyList).then((res)=>{
                    if(res.success){
                        let data = res.data;
                        this.currencyList = data;

                    }
                    else{
                        // this.$Message.error(res.message);
                    }
                })
            },
            //搜索时间
            dateEvent (date) {
                this.startDate = date[0];
                this.endDate   = date[1];
            },
            //历史查询
            getHistoryQuery () {
                this.getHistoryData();
                this.currPage = 1;
            },
            //历史导出
            exports () {
                let request = finance.withCapital.historyListExp

                request.params = {
                    "transferType"  : "1",
                    "startDate"     : this.startDate || '',
                    "endDate"       : this.endDate || '',
                    "currency"      : this.currencyName.join(),
                    "operationType" : this.historyTransferType
                };

                this.$axios(request).then((res)=>{
                    window.open( res.data );
                })
            },
            cancel(name){
                this.popCapital = false;
                this.$refs[name].resetFields();
            },
            close(){
                this.$refs['formItem'].resetFields();
            }
        },
        created (){
            if ( this.$store.state.user.checkPerm('pro:fince:system:assets:list') ) {
                this.getData();
            }
        }
    }
</script>
<style>
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
    .m-search{
        width: 260px;
        height: 32px;
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
        overflow: hidden;
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
    .l-content .l-filter{
        border-radius: 4px;
        border: 1px solid #E6EAEE;
        background: #fff;
        margin-bottom: 20px;
        padding: 0 0 30px 30px;
        /* overflow: hidden; */
    }
    .l-content .l-filter .l-search{
        height: auto;
        /* overflow: hidden; */
        margin-bottom: 0;
    }
    .l-content .l-filter h2{
        font-size: 16px;
        font-weight: normal;
        color: #354052;
        line-height: 50px;
        margin-top: 5px;
    }
    .l-content .l-filter .l-select{
        width: 100px;
        float: left;
        margin-right: 10px;
    }
    .l-content .l-filter .l-screen{
        width: 200px;
        float: left;
        margin-right: 10px;
    }
    .l-content .l-filter .l-date-picker{
        width: 300px;
        float: left;
        margin-right: 10px;
    }
    .fix:after{
        content:'';
        display:block;
        height:0;
        clear:both;
        visibility:hidden;
        overflow:hidden;
    }
    .fix{display:block;}
</style>
