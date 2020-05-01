<template>
    <div class="l-content">
        <div class="l-main">
            <div class="l-search" v-if="$store.state.user.checkPerm('withdraw:fees:list')">
                <Input v-model="currency" :placeholder="$t('查询币种')" class="l-grouping-input"></Input>
                <Button type="primary" v-if="$store.state.user.checkPerm('withdraw:fees:list')" v-on:click="getFeeList">{{$t('查询')}}</Button>
            </div>
            <div class="l-table-body">
                <h2>
                    {{$t('提币手续费设置')}}
                </h2>
                <Table :columns="feeListTable" :data="feeList"></Table>
            </div>
        </div>
        <Modal
            v-model="currencySwitch"
            :title="$t('提币手续费设置')"
            class-name="modal-clear-line"
            >
            <Form :model="formItem" ref="formFeeSet" :label-width="110" :rules="formRules">
                <FormItem prop="currencys" :label="$t('币种名称')">
                    <Input v-model="formItem.currencys" placeholder="" disabled class="m-input"></Input>
                </FormItem>
                <FormItem prop="currencys" :label="$t('手续费单位')">
                    <Input v-model="formItem.currencys" placeholder="" disabled class="m-input"></Input>
                </FormItem>
                <FormItem prop="feesType" :label="$t('手续费类型')">
                    <Input v-model="formItem.feesType" placeholder="" disabled class="m-input"></Input>
                </FormItem>
                <FormItem prop="oneAmount" :label="$t('手续费默认值')">
                    <Input v-model="formItem.oneAmount" placeholder="" class="m-input"></Input>
                </FormItem>
                <FormItem prop="minAmount" :label="$t('手续费最小值')">
                    <!-- <InputNumber v-model="formItem.minAmount" :disabled="formItem.feesType === $t('固定手续费')" :placeholder="$t('单位：百分比。例如：0.2')" style="width: 100%"></InputNumber> -->
                    <Input v-model="formItem.minAmount" :disabled="formItem.feesType === $t('固定手续费')" :placeholder="$t('单位：百分比。例如：0.2')" class="m-input"></Input>
                </FormItem>
                <FormItem prop="maxAmount" :label="$t('手续费最大值')">
                    <!-- <InputNumber v-model="formItem.maxAmount" :disabled="formItem.feesType === $t('固定手续费')" :placeholder="$t('单位：百分比。例如：0.2')" style="width: 100%"></InputNumber> -->
                    <Input v-model="formItem.maxAmount" :disabled="formItem.feesType === $t('固定手续费')" :placeholder="$t('单位：百分比。例如：0.2')" class="m-input"></Input>
                </FormItem>
            </Form>
            <div style="text-align: center;">
                <Button type="primary" @click="feesSetting">{{$t('保存')}}</Button>
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
                if ( ( /^[0-9]{1,10}([.][0-9]{1,8})?$/.test(value) && parseFloat(value) > 0 ) || this.formItem.feesType === this.$t('固定手续费') ) {
                    callback()
                } else {
                    callback(new Error(this.$t('请输入大于0，且符合规则的数字')))
                }
            }
            // 最大最小值之前验证
            const checkMid = (rule, value, callback) => {
                if ( (parseFloat(value) >= parseFloat(this.formItem.minAmount) && parseFloat(value) <= parseFloat(this.formItem.maxAmount)) || this.formItem.feesType === this.$t('固定手续费') ) {
                    callback()
                } else {
                    callback(new Error(this.$t('请输入的数字需在最大值和最小值之间')))
                }
            }
            // 最大值验证
            const checkMax = (rule, value, callback) => {
                if ( parseFloat(value) > parseFloat(this.formItem.minAmount) || this.formItem.feesType === this.$t('固定手续费') ) {
                    callback()
                } else {
                    callback(new Error(this.$t('输入的最大值应大于最小值')))
                }
            }
            // 最小值验证
            const checkMin = (rule, value, callback) => {
                if ( parseFloat(value) < parseFloat(this.formItem.maxAmount) || this.formItem.feesType === this.$t('固定手续费') ) {
                    callback()
                } else {
                    callback(new Error(this.$t('输入的最小值应小于最大值')))
                }
            }
            return {
                //提币手续费设置
                formItem: {
                    feesType  : 0,
                    oneAmount : 0,
                    minAmount : 0,
                    maxAmount : 0,
                },
                formRules: {
                    oneAmount: [
                        {
                            required: true,
                            message: this.$t('请输入不能为空的数字'),
                            trigger: 'blur'
                        },
                        {
                            validator: intCheck,
                            trigger: 'blur'
                        },
                        {
                            validator: checkMid,
                            trigger: 'blur'
                        }
                    ],
                    minAmount: [
                        {
                            required: true,
                            message: this.$t('请输入不能为空的数字'),
                            trigger: 'blur'
                        },
                        {
                            validator: intCheck,
                            trigger: 'blur'
                        },
                        {
                            validator: checkMin,
                            trigger: 'blur'
                        }
                    ],
                    maxAmount: [
                        {
                            required: true,
                            message: this.$t('请输入不能为空的数字'),
                            trigger: 'blur'
                        },
                        {
                            validator: intCheck,
                            trigger: 'blur'
                        },
                        {
                            validator: checkMax,
                            trigger: 'blur'
                        }
                    ]
                },
                currency  : '',
                feeListTable: [
                    {
                        key: 'currency',
                        renderHeader:() => {
                            return this.$t('币种')
                        },
                        render: (h, params) => {
                            return params.row.currency.toUpperCase();
                        }
                    },
                    {
                        key: 'adminId',
                        renderHeader:() => {
                            return this.$t('类型')
                        },
                        render: (h, params) => {
                            return params.row.feesType == '0' ? this.$t('区间手续费') : this.$t('固定手续费');
                        }
                    },
                    {
                        key: 'oneAmount',
                        renderHeader:() => {
                            return this.$t('默认值')
                        }
                    },
                    {
                        key: 'minAmount',
                        renderHeader:() => {
                            return this.$t('最小值')
                        }
                    },
                    {
                        key: 'maxAmount',
                        renderHeader:() => {
                            return this.$t('最大值')
                        }
                    },
                    {
                        key: 'updateDatetime',
                        renderHeader:() => {
                            return this.$t('修改时间')
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
                                        disabled: !this.$store.state.user.checkPerm('withdraw:fees:update')
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.currencySwitch = true;

                                            this.formItem.currencys = params.row.currency.toUpperCase();
                                            this.formItem.feesType  = params.row.feesType == '0' ? this.$t('区间手续费') : this.$t('固定手续费')
                                            this.formItem.oneAmount = params.row.oneAmount.toString()
                                            this.formItem.minAmount = params.row.minAmount.toString()
                                            this.formItem.maxAmount = params.row.maxAmount.toString()
                                        }
                                    }
                                }, this.$t('设置'))
                            ]);
                        }
                    }
                ],
                feeList: [],
                currencySwitch: false

            }
        },
        methods: {
            //手续费设置
            feesSetting (){
                this.$refs['formFeeSet'].validate((valid) => {
                    if (valid) {
                       let request = operation.changeFee;
                        //币种搜索
                        request.data = {
                            currency  : this.formItem.currencys,
                            feesType  : this.formItem.feesType == this.$t('区间手续费') ? 0 : 1,
                            oneAmount : this.formItem.oneAmount,
                            minAmount : this.formItem.minAmount,
                            maxAmount : this.formItem.maxAmount
                        }

                        this.$axios(request).then((res)=>{
                            if(res.success){
                                this.currencySwitch = false
                                this.getFeeList()
                            }
                        })
                        .catch((error) => {
                            this.$Message.error( this.$t(error) );
                        })
                    }
                })
            },
            //获取-查询分页列表-提现手续费设置
            getFeeList (){
                let request = operation.feeList;

                // //币种搜索
                request.params = {
                    currency : this.currency
                }

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.feeList = res.data;
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            },
            //提币手续费设置
            getFeeSetting (){
                let obj = operation.feesList
                if (this.valuation) {
                    obj.params.valuation = this.valuation
                }
                if (handler.removeBlank(this.value)) {
                    obj.params.value = this.value
                }

                this.$axios(obj).then((res)=>{
                    if(res.success){
                        let data = res.data;
                        this.feesList = data;
                    }
                })
                .catch((error) => {
                    this.$Message.error( this.$t(error) );
                })
            }
        },
        created (){
            if ( this.$store.state.user.checkPerm('withdraw:fees:list') ) {
                this.getFeeList()
            }
        },
        watch: {
            currencySwitch (val) {
                if ( !val ) {
                    this.$refs['formFeeSet'].resetFields()
                }
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
