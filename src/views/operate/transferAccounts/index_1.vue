<template>
    <div class="">


        <Modal
            v-model="toExaminePop"
            title="批量转账审核"
            @on-ok="approveSave"
            >
            <div class="l-form">
                <ul>
                    <li>
                        <label>审核通过</label>
                        <RadioGroup v-model="status" class="l-radio">
                            <Radio label="reject">
                                <span>拒绝</span>
                            </Radio>
                            <Radio label="audit_ok">
                                <span>通过</span>
                            </Radio>
                        </RadioGroup>
                    </li>
                    <li>
                        <label>管理员GA验证码</label>
                        <Input v-model="captcha" placeholder="管理员GA验证码" class="m-input"></Input>
                    </li>
                </ul>
            </div>
        </Modal>
        <Tabs value="transferAccounts" @on-click="tabs">
            <TabPane label="运营活动批量转账" name="transferAccounts" v-if="$store.state.user.checkPerm('dawn:operate:activity')">
                <transfer></transfer>
            </TabPane>
            <TabPane label="待审核" name="toExamine" v-if="$store.state.user.checkPerm('dawn:operate:activity:check')">
                <to-examine></to-examine>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import { operation } from '__util/api'
    import Cookies from 'js-cookie'
    import toExamine from './toExamine'
    import transfer from './transfer'

    export default {
        components: {
            toExamine,
            transfer
        },
        data () {
            return {
                value: '',

                modal2: false,
                modal3: false,
                phone: 'apple',
                select1: '计价货币',

                columns3: [
                    {
                        title: '申请时间',
                        key: 'a'
                    },
                    {
                        title: '活动名称',
                        key: 'b'
                    },
                    {
                        title: '转出账户',
                        key: 'c'
                    },
                    {
                        title: '转出币种',
                        key: 'd'
                    },
                    {
                        title: '转出总额',
                        key: 'e'
                    },
                    {
                        title: '转出用户',
                        key: 'f'
                    },
                    {
                        title: '状态',
                        key: 'g'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal3 = true
                                            //this.show(params.index)
                                        }
                                    }
                                }, '查看明细')
                            ]);
                        }
                    }
                ],

                columns5: [
                    {
                        title: '划拨ID',
                        key: 'a'
                    },
                    {
                        title: '账户类型',
                        key: 'b'
                    },
                    {
                        title: '划拨方向',
                        key: 'c'
                    },
                    {
                        title: '划拨类型',
                        key: 'd'
                    },
                    {
                        title: '拨款币种',
                        key: 'e'
                    },
                    {
                        title: '划拨金额',
                        key: 'f'
                    },
                    {
                        title: '备注',
                        key: 'g'
                    },
                    {
                        title: '操作日志',
                        key: 'h'
                    },
                    {
                        title: '审核日志',
                        key: 'i'
                    },
                    {
                        title: '操作',
                        key: 'j'
                    }
                ],
                data5: [
                    {
                        a: '1234',
                        b: '用户账户（12345678）',
                        c: '拨款',
                        d: '运营账户支出',
                        e: 'BTC',
                        f: '100200.3004',
                        g: '充值归还',
                        h: 'admin/2017-12-27 20:53:24',
                        i: 'admin/2017-12-27 20:53:24',
                        j: '已完成'
                    }
                ],

                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                model10: [],
                model9: '',

                //运营批量转账列表
                activityName: '',
                stateType: '',
                state: [
                    {value:'init',label:'待审核'},
                    {value:'pass',label: '已审核'},
                    {value:'ok',label:'已转账'},
                    {value:'fail',label:'失败'},
                    {value:'transfer',label:'转账中'},
                    {value:'reject',label:'已拒绝'},
                    {value:'waiting',label:'待校验'},
                    {value:'check_fail',label:'UID校验失败'}
                ],
                toExamineTable: [
                    {
                        title: '申请时间',
                        key: 'applyDatetime'
                    },
                    {
                        title: '活动名称',
                        key: 'activityName'
                    },
                    {
                        title: '转出账户',
                        key: 'transferOutUserId',
                        render: (h, params) => {
                            let account;
                            switch (params.row.transferOutUserId) {
                                case 4:
                                    account = '活动账户';
                                    break;
                                case 6:
                                    account = '返佣账户';
                                    break;
                                default:

                            }
                            return account;
                        }
                    },
                    {
                        title: '转出币种',
                        key: 'transferOutCurrency',
                        render: (h, params) => {
                            return params.row.transferOutCurrency.toUpperCase();
                        }
                    },
                    {
                        title: '转出总额',
                        key: 'transferCurrencyCount'
                    },
                    {
                        title: '转出用户数',
                        key: 'transferUserCount'
                    },
                    {
                        title: '状态',
                        key: 'transferStatusDesc',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.toExaminePop = true;

                                            this.auditID      = params.row.id;
                                            this.auditAdminId = params.row.auditAdminId;
                                            this.captcha      = '';
                                        }
                                    }
                                }, '审核')
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.detailed = true;
                                            this.id = params.row.id;
                                            this.activityDetail();
                                        }
                                    }
                                }, '查看明细')
                            ]);
                        }
                    }
                ],
                batchListTable: [
                    {
                        title: '申请时间',
                        key: 'applyDatetime'
                    },
                    {
                        title: '活动名称',
                        key: 'activityName'
                    },
                    {
                        title: '转出账户',
                        key: 'transferOutUserId',
                        render: (h, params) => {
                            let account;
                            switch (params.row.transferOutUserId) {
                                case 4:
                                    account = '活动账户';
                                    break;
                                case 6:
                                    account = '返佣账户';
                                    break;
                                default:

                            }
                            return account;
                        }
                    },
                    {
                        title: '转出币种',
                        key: 'transferOutCurrency',
                        render: (h, params) => {
                            return params.row.transferOutCurrency.toUpperCase();
                        }
                    },
                    {
                        title: '转出总额',
                        key: 'transferCurrencyCount'
                    },
                    {
                        title: '转出用户数',
                        key: 'transferUserCount'
                    },
                    {
                        title: '状态',
                        key: 'transferStatusDesc'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.detailed = true;
                                            this.id = params.row.id;
                                            this.activityDetail();
                                        }
                                    }
                                }, '查看明细')
                            ]);
                        }
                    }
                ],
                batchList: [],




                activityName: '',
                activityDetails: '',
                transferOutUserId: '',
                transferOutCurrency: '',
                transferUserCount: '',
                transferCurrencyCount: '',
                noticeType: '',
                notificationTemplate: '',


                //分页
                totalCount   : 0,
                pageSize     : 5,
                currPage     : 1,

                //查看明细
                detailed: false,

                //待审核
                transferStatus : '',
                toExaminePop : false,
                status : 'reject',
                captcha : '',
                auditID : '',
                auditAdminId : ''
            }
        },
        methods: {
            ok () {
                const data = new FormData();
                data.append('file', this.$refs.file.files[0]);
                let obj = operation.activityAdd;
                obj.params = {
                    activityName: this.activityName,
                    activityDetail: this.activityDetails,
                    transferOutUserId: this.transferOutUserId,
                    transferOutCurrency: this.transferOutCurrency,
                    transferUserCount: this.transferUserCount,
                    transferCurrencyCount: this.transferCurrencyCount,
                    notificationTemplate: this.notificationTemplate,
                    noticeType: this.noticeType,
                }
                obj.data = data
                obj.headers.token = Cookies.get('token')
                this.$axios(obj).then((res)=>{
                    console.log(res)
                })
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            },
            show () {
                this.modal1 = true;
            },
            //选项卡切换
            tabs (name) {
                this.currPage = 1;
                this.activityName = '';
                this.stateType = '';
                if( name == 'toExamine' ){
                    this.stateType = 'init';
                }
                else{
                    this.stateType = '';
                }
                this.getData();
            },
            //运营批量转账列表
            getData () {
                let request   = operation.activityList;

                request.params = {
                    page : this.currPage,
                    pageSize : this.pageSize,
                    activityName : this.activityName,
                    transferStatus : this.stateType
                };

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.batchList  = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            },
            page (num){
                this.currPage = num;
                this.getData();
            },

            //审核
            approveSave (){
                let request   = operation.approve;

                request.data = {
                    id : this.auditID,
                    status : this.status,
                    // auditAdminId : this.auditAdminId,
                    googleCode : this.captcha
                };

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.getData();
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            },
            batchFilter (){
                this.currPage = 1;
                this.getData();
            },
            filter (){
                this.stateType = '';
                this.currPage = 1;
                this.getData();
            }
        },
        created (){
            //运营批量转账列表
            this.getData();
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
        overflow: hidden;
        padding: 10px 0;
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
    }
    .l-content .l-operation .m-btn{
        margin-left: 10px;
    }
    .l-content .l-trade{
        height: 48px;
        border-top: 1px solid #E6EAEE;
        border-bottom: 1px solid #E6EAEE;
        padding: 0 18px;
        line-height: 48px;
    }
    .l-content .l-trade span{

    }
    .l-form .l-radio label{
        text-align: left;
        width: auto;
    }
    .mb-20{
        margin-bottom: 20px;
    }
    .l-pop-table{}
    .l-pop-table h2{
        font-weight: normal;
        font-size: 14px;
        color: #354052;
        padding-bottom: 20px;
    }
    .l-pop-table h2.pt20{
        padding-top: 20px;
    }
</style>
