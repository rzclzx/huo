<template>
    <div>
        <div class="l-main">
            <div class="l-search" v-if="$store.state.user.checkPerm('trade:fee:list')">
                <Input v-model="value" :placeholder="$t('基础货币')" class="m-search">
                    <Select v-model="valuation" slot="prepend" class="l-select-input" :placeholder="$t('计价货币')" style="width: 100px;" v-autoLocale>
                        <Option value=" ">{{$t('全部')}}</Option>
                        <Option v-for="i in currList" :value="i" :key="i">{{ i }}</Option>
                    </Select>
                </Input>
                <Button type="primary" v-if="$store.state.user.checkPerm('trade:fee:list')" @click="getData">{{$t('查询')}}</Button>
            </div>
            <div class="l-table-body">
                <h2>{{$t('通用交易手续费列表')}}</h2>
                <Table :columns="feesListTable" :data="feesList"></Table>
            </div>
        </div>
        <Modal
            v-model="changeFees"
            :title="$t('交易手续费设置')"
            class-name="modal-clear-line"
            >
            <Form :model="formItem" ref="form" :label-width="100" :rules="formRules">
                <FormItem prop="symbol" :label="$t('交易对')">
                    <Input v-model="formItem.symbol" placeholder="ETC/ETH" disabled class="m-input"></Input>
                </FormItem>
                <FormItem prop="markerFee" :label="$t('Maker（%）')">
                    <Input v-model="formItem.markerFee" :placeholder="$t('单位：百分比。例如：0.2')" class="m-input"></Input>
                </FormItem>
                 <FormItem prop="takerFee" :label="$t('Taker（%）')">
                    <Input v-model="formItem.takerFee" :placeholder="$t('单位：百分比。例如：0.2')" class="m-input"></Input>
                </FormItem>
            </Form>
            <div style="text-align: center;">
                <Button type="primary" @click="changeFeesSave">{{$t('_交易手续费设置保存')}}</Button>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>

<script>
    import { operation, exchange } from '__util/api';
    import handler from '__util/publicMethod';
    export default {
        data () {
            // 正整数验证
            const intCheck = (rule, value, callback) => {
                if ( /^\-?[0-9]{1,10}([.][0-9]{1,8})?$/.test(value)) {
                    callback()
                } else {
                    callback(new Error(this.$t('请输入符合规则的数字')))
                }
            }
            return {
                //通用交易手续费列表
                formItem: {},
                currList: [],
                value: '',
                valuation: '',
                changeFees: false,
                markerFee: '',
                takerFee: '',
                formRules: {
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
                    ]
                },
                feesListTable: [
                    {
                        key: 'symbol',
                        renderHeader:() => {
                            return this.$t('交易对')
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
                                        type: 'primary',
                                        size: 'small',
                                        disabled: !this.$store.state.user.checkPerm('trade:fee:update')
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeFees = true;
                                            this.formItem.symbol = params.row.symbol
                                            this.formItem.markerFee = params.row.makerFee.toString()
                                            this.formItem.takerFee = params.row.takerFee.toString()
                                        }
                                    }
                                }, this.$t('设置'))
                            ]);
                        }
                    }
                ],
                feesList: [],

            }
        },
        methods: {
            //通用交易手续费列表设置
            changeFeesSave () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let request = operation.changeFees
                        request.params = {
                            symbol    : this.formItem.symbol,
                            markerFee : this.formItem.markerFee,
                            takerFee  : this.formItem.takerFee
                        }
                        request.data = {}
                        this.$axios(request).then((res)=>{
                            if(res.success){
                                this.changeFees = false
                                this.getData ()
                            }
                        })
                        .catch((error) => {
                            this.$Message.error( this.$t(error) )
                        })
                    }
                })
            },
            //获取通用交易手续费列表
            getData () {
                let obj = operation.feesList
                obj.params = {}
                if (this.valuation) {
                    obj.params.valuation = this.valuation
                }
                if (handler.removeBlank(this.value)) {
                    obj.params.basic = this.value
                }

                this.$axios(obj).then((res)=>{

                    res.data.map((e) => {
                        e.symbol = e.symbol.toUpperCase()
                        e.makerFee = Math.round(e.makerFee * 10000) / 100
                        e.takerFee = Math.round(e.takerFee * 10000) / 100
                    })
                    if(res.success){
                        this.feesList = res.data
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            }
        },
        created (){
            //获取划拨账户信息列表
            if ( this.$store.state.user.checkPerm('trade:fee:list') ) {
                this.getData();
            }
            this.$axios(exchange.getSymbolName).then((res)=>{
                this.currList = res.data.quotes
            })
        }
    }
</script>
<style>
</style>
<style scoped>
    .l-content{
        margin:-10px;
    }
    .l-main .l-search{
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
</style>
