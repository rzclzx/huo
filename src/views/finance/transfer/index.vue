<template>
    <div class="l-content">
        <Modal
            @on-cancel="close"
            v-model="modal"
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
                            <label>{{type}}{{$t('币种')}}</label>
                            <FormItem prop="currencys">
                                <Input v-model="currencys" disabled class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{type}}{{$t('账户')}}</label>
                            <FormItem prop="dataRadio">
                                <RadioGroup v-model="dataRadio" class="l-radio" @on-change="radio">
                                    <Radio label="operationsAccount">
                                        <span>{{$t('运营账户')}}</span>
                                    </Radio>
                                    <Radio label="assetManagementAccount">
                                        <span>{{$t('资管账户')}}</span>
                                    </Radio>
                                    <Radio label="forkAccount">
                                        <span>{{$t('分叉账户')}}</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{type}}{{$t('数额')}}</label>
                            <FormItem prop="amount">
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
                            <label>{{type}}{{$t('备注')}}</label>
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
            <TabPane :label="$t('账户划拨')" name="account" v-if="$store.state.user.checkPerm('pro:fince:system:operation')">
                <div class="l-main">
                    <div class="l-search" v-if="$store.state.user.checkPerm('pro:fince:system:operation:list')">
                        <Form ref="formItemCurr" :model="formItemCurr" :rules="ruleItemCurr">
                            <FormItem prop="currency">
                                <Input v-model="formItemCurr.currency" :placeholder="$t('搜索币种')" class="m-search" @on-keyup="keyup"></Input>
                                <Button type="primary" v-on:click="search( 'formItemCurr' )">{{$t('查询')}}</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <div class="l-table-body">
                        <h2>{{$t('划拨列表')}}</h2>
                        <Table :columns="transferTable" :data="transfer" :no-data-text="this.$t('暂无数据')"></Table>
                    </div>
                </div>
            </TabPane>
            <TabPane v-if="$store.state.user.checkPerm('pro:fince:system:operation:history')" :label="$t('历史记录')" name="history">
                <div class="l-main">
                    <div class="l-filter fix" v-if="$store.state.user.checkPerm('pro:fince:system:operation:historyList')">
                        <h2>{{$t('筛选条件')}}</h2>
                        <div class="l-search fix">
                            <Select v-model="currencyName" multiple  class="l-screen" :placeholder="$t('请选择币种')"  @on-change="symbolEvent" v-autoLocale>
                                <Option value="全部">{{$t('全部')}}</Option>
                                <Option v-for="item in currencyList" :value="item" :key="item">{{ item.toUpperCase() }}</Option>
                            </Select>
                            <Select v-model="historyTransferType" class="l-select" :placeholder="$t('划拨类型')" v-autoLocale>
                                <Option value="">{{$t('全部')}}</Option>
                                <Option value="0" key="0">{{$t('拨款')}}</Option>
                                <Option value="1" key="1">{{$t('收款')}}</Option>
                            </Select>
                            <Select v-model="transferAccount" class="l-select" :placeholder="$t('划拨账户')" style="width: 210px;" v-autoLocale>
                                <Option value="" key="">{{$t('全部')}}</Option>
                                <Option v-for="item in accountListArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <DatePicker type="datetimerange" :placeholder="$t('划拨时间')" class="l-date-picker" @on-change="dateEvent"></DatePicker>
                            <Button type="primary" v-on:click="getHistoryQuery">{{$t('查询')}}</Button>
                        </div>
                    </div>

                    <div class="l-table-body">
                        <h2>
                            {{$t('总账户划拨历史')}}
                            <Button type="primary" class="m-export" v-on:click="exports" v-if="$store.state.user.checkPerm('pro:fince:system:operation:historyListExp')">{{$t('数据导出')}}</Button>
                        </h2>
                        <Table :columns="historyListTable" :data="historyList" :no-data-text="this.$t('暂无数据')"></Table>
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
            const currency = ( rule, value, callback ) => {
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
                if ( value === '' || value <= 0 || !/^\d+(\.\d+)?$/.test(value)) {
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
                loading   : true,
                /** 账户划拨 **/
                //弹窗
                type          : this.$t('拨款'),
                title         : this.$t('总账户拨款'),
                modal         : false,
                dataRadio     : 'operationsAccount',
                currencys     : '',
                operationType : 0,
                accountId     : {
                    operationsAccount      : 0,
                    forkAccount            : 0,
                    assetManagementAccount : 0
                },
                accountUserId : {
                    operationsAccount      : 0,
                    forkAccount            : 0,
                    assetManagementAccount : 0
                },
                datas         : {},
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
                //搜索
                formItemCurr:{
                    currency : ''
                },
                ruleItemCurr : {
                    currency   : [
                        { validator: currency }
                    ]
                },
                //列表
                transferTable : [
                    {
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
                             return this.$t('运营账户')
                        },
                        key   : 'operationsAccount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('资管账户')
                        },
                        key   : 'assetManagementAccount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('分叉账户')
                        },
                        key   : 'forkAccount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key    : 'action',
                        width  : 150,
                        align  : 'center',
                        render : (h, params) => {
                            let bSwitch = true;
                            let sSwitch = true;
                            // disabled
                            // 拨款
                            if(this.$store.state.user.checkPerm('pro:fince:system:operation:reduceAccounts')){
                                bSwitch = false;
                            }
                            // 收款
                            if(this.$store.state.user.checkPerm('pro:fince:system:operation:increaseAccounts')){
                                sSwitch = false;
                            }
                            return h('div', [
                                h('Button', {
                                    props : {
                                        type : 'primary',
                                        size : 'small',
                                        disabled : bSwitch,
                                    },
                                    style : {
                                        marginRight : '5px'
                                    },
                                    on : {
                                        click : () => {
                                            //初始化数据
                                            this.formItem.amount  = '';
                                            this.formItem.captcha = '';
                                            this.formItem.comment = '';

                                            this.modal         = true;
                                            this.currencys     = params.row.currency.toUpperCase();
                                            this.type          = this.$t('拨款');
                                            this.title         = this.$t('总账户拨款');
                                            this.operationType = 0;
                                        }
                                    }
                                }, this.$t('拨款')),
                                h('Button', {
                                    props : {
                                        type : 'primary',
                                        size : 'small',
                                        disabled : sSwitch,
                                    },
                                    on: {
                                        click: () => {
                                            //初始化数据
                                            this.formItem.amount  = '';
                                            this.formItem.captcha = '';
                                            this.formItem.comment = '';

                                            this.modal         = true;
                                            this.currencys     = params.row.currency.toUpperCase();
                                            this.type          = this.$t('收款');
                                            this.title         = this.$t('总账户收款');
                                            this.operationType = 1;
                                        }
                                    }
                                }, this.$t('收款'))
                            ]);
                        }
                    }
                ],
                transfer      : [],

                /** 历史记录 **/
                //搜索
                historyTransferType : '',
                currencyName        : [],
                transferAccount     : '',
                startDate           : '',
                endDate             : '',
                currencyList        : [],
                //分页
                pageSize            : 10,
                currPage            : 1,
                totalCount          : 0,

                //列表
                accountMap          : {},
                accountType         : {
                    // systemAccount           : '总账户',
                    operationsAccount       : this.$t('运营账户'),
                    assetManagementAccount  : this.$t('资管账户'),
                    activitiesAccount       : this.$t('活动账户'),
                    redPackageAccount       : this.$t('红包账户'),
                    returnCommissionAccount : this.$t('返佣账户'),
                    forkAccount             : this.$t('分叉账户'),
                    loanAssetAccount        : this.$t('借贷本金账户'),
                    loanedAccount           : this.$t('借贷已借账户'),
                    incentive               : this.$t('激励账户')
                },
                accountListArr      : [
                    // {   value : "systemAccount",
                    //     label : "总账户"
                    // },
                    {   value : "operationsAccount",
                        label : this.$t("运营账户")
                    },
                    {   value : "assetManagementAccount",
                        label : this.$t("资管账户")
                    },
                    {   value : "activitiesAccount",
                        label : this.$t("活动账户")
                    },
                    {   value : "redPackageAccount",
                        label : this.$t("红包账户")
                    },
                    {   value : "returnCommissionAccount",
                        label : this.$t("返佣账户")
                    },
                    {   value : "forkAccount",
                        label : this.$t("分叉账户")
                    },
                    {   value : "loanAssetAccount",
                        label : this.$t("借贷本金账户")
                    },
                    {   value : "loanedAccount",
                        label : this.$t("借贷已借账户")
                    },
                    {   value : "incentive",
                        label : this.$t("激励账户")
                    }
                ],
                historyListTable    : [
                    {
                        renderHeader: (h) => {
                             return this.$t('拨款ID')
                        },
                        key   : 'id'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨时间')
                        },
                        key   : 'createDate'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨账户')
                        },
                        key    : 'targetAccount',
                        render : (h, params) => {
                            let data        = this.accountMap;
                            let accountType = this.accountType;
                            let row         = params.row.targetAccount;
                            for(let key in data){
                                if( key == row ){
                                    for(let keys in accountType){
                                        if( keys == data[key] ){
                                            return accountType[keys];
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨类型')
                        },
                        key    : 'operationType',
                        render : (h, params) => {
                            let type = params.row.operationType;
                            return type == 1 ? this.$t('收款') : this.$t('拨款');
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨币种')
                        },
                        key   : 'currency'
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
                historyList         : []
            }
        },
        methods : {
            //全选
            symbolEvent (array) {
                let index    = array.indexOf(this.$t('全部'));
                let currency = this.currencyList.join();
                if( index >= 0 ){
                    this.currencyName = currency.split(',');
                }
            },
            save (name) {
                //划拨账户收付款
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //资产配减资
                        this.setAccount();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            time (date) {
                // alert(111)
                console.log(date, 444)
            },
            //设置账户切换
            radio (name) {
                this.datas['accountId']     = this.accountId[name];
                this.datas['accountUserId'] = this.accountUserId[name];
            },
            tabs (name) {
                if(name == 'history' && this.$store.state.user.checkPerm('pro:fince:system:operation:historyList')){
                    //获取历史配资列表
                    this.getHistoryData();
                    this.getCurrency();
                }
            },
            //数据MAP
            dataMap ( data ) {
                let newData = [];
                for(var i=0;i<data.length;i++){
                    newData.push({
                        'currency'               : data[i].currency,
                        'assetManagementAccount' : data[i].accounts.trade.assetManagementAccount,
                        'forkAccount'            : data[i].accounts.trade.forkAccount,
                        'operationsAccount'      : data[i].accounts.trade.operationsAccount,
                    })
                }
                return newData;
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
            //获取账户划拨列表
            getData (){
                let request = finance.transfer.operationList;

                //币种搜索
                request.params = { 'currency' : this.formItemCurr.currency };
                this.$axios(request).then((res)=>{
                    if(res.success){
                        let data           = this.dataMap(res.data.list);
                        let accountIds     = res.data.accountIds;
                        let accountUserIds = res.data.accountUserIds;

                        this.transfer = data;

                        //设置账户状态
                        this.accountId     = accountIds;
                        this.accountUserId = accountUserIds;

                        //设置默认账户ID
                        this.datas['accountId']     = this.accountId.operationsAccount;
                        this.datas['accountUserId'] = this.accountUserId.operationsAccount;
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //历史记录数据
            getHistoryData (){
                let request = finance.transfer.historyList;

                //设置POST请求参数
                request.data = {
                    "transferType"  : "2",
                    "page"          : this.currPage,
                    "limit"         : this.pageSize,
                    "startDate"     : this.startDate,
                    "endDate"       : this.endDate,
                    "currency"      : this.currencyName.join(),
                    "accountType"   : this.transferAccount,
                    "operationType" : this.historyTransferType
                };

                //获取历史数据列表
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.historyList = res.data.res.list;
                        this.accountMap  = res.data.accountMap;
                        this.totalCount  = res.data.res.totalCount;
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //分页
            page (num){
                this.currPage = num;
                this.getHistoryData();
            },
            //设置用户收付款
            setAccount (){
                let request;
                if (this.operationType === 0) {
                    request = finance.transfer.reduceAccounts
                } else {
                    request = finance.transfer.increaseAccounts
                }
                //设置GET请求数据
                request.params = { 'captcha' : this.formItem.captcha };

                //设置POST请求数据
                this.datas['amount']        = this.formItem.amount;
                this.datas['comment']       = this.formItem.comment;
                this.datas['currency']      = this.currencys.toLowerCase();
                this.datas['operationType'] = this.operationType;
                request.data                = this.datas;

                //设置收付款
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.modal = false;
                        this.$Message.success(res.message);
                        this.getData();
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                    this.modal = false;
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
            //历史导出
            exports () {
                let request = finance.transfer.historyListExp

                request.params = {
                    "transferType"  : "2",
                    "startDate"     : this.startDate,
                    "endDate"       : this.endDate,
                    "currency"      : this.currencyName.join(),
                    "accountType"   : this.transferAccount,
                    "operationType" : this.historyTransferType
                };

                this.$axios(request).then((res)=>{
                    window.open( res.data );
                })
            },
            cancel(name){
                this.modal = false;
                this.$refs[name].resetFields();
            },
            close(name){
                this.$refs['formItem'].resetFields();
            }
        },
        created (){
            if ( this.$store.state.user.checkPerm('pro:fince:system:operation:list') ) {
                //获取划拨账户信息列表
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
    .l-form .ivu-form-item-content label{
        padding-top: 0;
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
        /* padding: 10px 0; */
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
    }
    .l-content .l-filter .l-search{
        height: auto;
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
    .l-form .l-radio label{
        text-align: left;
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
