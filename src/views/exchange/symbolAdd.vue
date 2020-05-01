<template lang="html">
    <Form :model="formItem" :label-width="130" ref="formSymbolEdit" :rules="rules">
        <FormItem prop="symbol" :label="$t('交易对标识(对内)')">
            <Input v-model="formItem.symbol" :placeholder="$t('全小写，不能有特殊字符。正确例子：ethbtc')"></Input>
        </FormItem>
        <FormItem prop="symbolCode" :label="$t('交易对code(对外)')">
            <Input v-model="formItem.symbolCode" :placeholder="$t('全小写，不能有特殊字符。正确例子：ethbtc')"></Input>
        </FormItem>
        <FormItem prop="symbolName" :label="$t('前端显示名称')">
            <Input v-model="formItem.symbolName" @on-blur="splitCurrency" :placeholder="$t('前端显示交易对名称，以英文斜杠区别。正确例子：ETH/BTC')"></Input>
        </FormItem>
        <FormItem prop="baseCurrency" :label="$t('基础货币')">
            <Input v-model="formItem.baseCurrency" :placeholder="$t('基础货币，为交易对前半部分。正确例子：eth')"></Input>
        </FormItem>
        <FormItem prop="quoteCurrency" :label="$t('计价货币')">
            <Input v-model="formItem.quoteCurrency" :placeholder="$t('计价货币，为交易对后半部分。正确例子：btc')"></Input>
        </FormItem>
        <FormItem prop="tradeEnableUids" :label="$t('内测白名单')">
            <Input v-model="formItem.tradeEnableUids" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('用户UID，以英文逗号分隔')"></Input>
        </FormItem>
        <FormItem prop="tradeEnableDateTime" :label="$t('交易开放时间')">
            <DatePicker v-model="formItem.tradeEnableDateTime" transfer type="datetime" :placeholder="$t('Select date')" format="yyyy-MM-ddTHH:mm:ssZZ" style="width: 100%"></DatePicker>
        </FormItem>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="tradeEnableMap" :label="$t('交易开关')" style="textAlign: left">
                    <!-- <RadioGroup v-model="formItem.tradeEnableMap" id="enableRadio" @on-change="checkedRadio">
                        <Radio label="关闭"></Radio>
                        <Radio label="开启"></Radio>
                        <input type="radio" name="tradeEnable" value="0">关闭
                        <input type="radio" name="tradeEnable" value="1">开启
                    </RadioGroup> -->
                    <input type="radio" name="tradeEnable" v-model="formItem.tradeEnableMap" :value="$t('关闭')"><span style="margin-left: 10px">{{ $t('关闭') }}</span>
                    <input type="radio" name="tradeEnable" v-model="formItem.tradeEnableMap" :value="$t('开启')" style="margin-left: 10px"><span style="margin-left: 10px">{{ $t('开启') }}</span>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="weight" :label="$t('排序权重')">
                    <InputNumber v-model="formItem.weight" placeholder="" style="width: 100%"></InputNumber>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="tradePricePrecision" :label="$t('交易价格精度')">
                    <Input v-model="formItem.tradePricePrecision" placeholder="" number></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="tradeAmountPrecision" :label="$t('交易数量精度')">
                    <Input v-model="formItem.tradeAmountPrecision" placeholder="" number></Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="tradeTotalPrecision" :label="$t('交易额精度')">
                    <Input v-model="formItem.tradeTotalPrecision" placeholder="" number></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="feePrecision" :label="$t('交易费精度')">
                    <Input v-model="formItem.feePrecision" placeholder="" number></Input>
                </FormItem>
            </Col>
        </Row>
        <FormItem prop="symbolPartition" :label="$t('交易对分区')" style="textAlign: left">
            <RadioGroup v-model="formItem.symbolPartition">
                <Radio label="main">{{ $t('主区') }}</Radio>
                <!-- <Radio label="innovation">{{ $t('创新区') }}</Radio>
                <Radio label="profession">{{ $t('专业区') }}</Radio>
                <Radio label="bifurcation">{{ $t('分叉区') }}</Radio> -->
            </RadioGroup>
        </FormItem>
        <div class="">
            <Button type="primary" @click="save">{{ $t('保存') }}</Button>
        </div>
    </Form>
</template>

<script>
import { exchange } from '__util/api'
export default {
    data () {
        // 比较时间大小
        const dateCheck = (rule, value, callback) => {
           if (value <= this.formItem.depositEnableDateTime && value <= this.formItem.withdrawEnableDateTime) {
               callback()
           } else {
               callback(new Error(this.$t('币种可见时间必须早于等于冲币提币开放时间')))
           }
        }
        // 小写字母检验
        const lowerCheck = (rule, value, callback) => {
            if ( /^[a-z0-9]+$/.test(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('全小写、不能有特殊字符、正确例子：ethbtc')))
            }
        }
        // 正整数验证
        const intCheck = (rule, value, callback) => {
            if ( value >= 0 ) {
                callback()
            } else {
                callback(new Error(this.$t('不能为空的正整数')))
            }
        }
        // 检验UID格式
        const UIDCheck = (rule, value, callback) => {
            if ( !value || /^[0-9,]+$/.test(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('用户UID，以英文逗号分隔')))
            }
        }
        // 验证计价货币
        const quoteChecked = (rule, value, callback) => {
            if ( this.autoCurrency.base && this.autoCurrency.quote ) {
                if ( rule.field === 'baseCurrency' && value !== this.autoCurrency.base ) {
                    callback(new Error(this.$t('基础货币与填写交易对不匹配，必须全为小写')))
                }
                if ( rule.field === 'baseCurrency' && value === this.autoCurrency.base ) {
                    callback()
                }
                if ( rule.field === 'quoteCurrency' && value !== this.autoCurrency.quote ) {
                    callback(new Error(this.$t('计价货币与填写交易对不匹配，必须全为小写')))
                }
                if ( rule.field === 'quoteCurrency' && value === this.autoCurrency.quote ) {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            formItem: {},
            symbolId: '',
            // 自动拆分基础货币和计价货币
            autoCurrency: {
                base: '',
                quote: ''
            },
            // 用于转换交易开关的状态
            boolean: {
                '开启': 1,
                '关闭': 0
            },
            // 表单验证
            rules: {
                symbol: [
                    { required: true, message: this.$t('交易对标识(对内)') + this.$t('不能为空'), trigger: 'blur' },
                    { validator: lowerCheck, trigger: 'blur' }
                ],
                symbolCode: [
                    { required: true, message: this.$t('交易对code(对外)') + this.$t('不能为空'), trigger: 'blur' },
                    { validator: lowerCheck, trigger: 'blur' }
                ],
                symbolName: [
                    { required: true, message: this.$t('前端显示名称') + this.$t('不能为空'), trigger: 'blur' },
                    { required: true, pattern: /^[A-Z]+\/[A-Z]+$/, message: this.$t('前端显示交易对名称，以英文斜杠区别。正确例子：ETH/BTC'), trigger: 'blur' }
                ],
                baseCurrency: [
                    { required: true, message: this.$t('基础货币') + this.$t('不能为空'), trigger: 'blur' },
                    // { validator: quoteChecked, trigger: 'blur' }
                ],
                quoteCurrency: [
                    { required: true, message: this.$t('计价货币') + this.$t('不能为空'), trigger: 'blur' },
                    // { validator: quoteChecked, trigger: 'blur' }
                ],
                tradeEnableUids: [
                    { validator: UIDCheck, trigger: 'blur' }
                ],
                tradeEnableDateTime: [
                    { required: true, type: 'date', message: this.$t('内测开放时间') + this.$t('不能为空'), trigger: 'change' }
                ],
                weight: [
                    { required: true, type: 'integer', message: this.$t('请输入不能为空的正整数'), trigger: 'blur' }
                ],
                tradePricePrecision: [
                    { required: true, type:'integer', message: this.$t('请输入不能为空的正整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' }
                ],
                tradeAmountPrecision: [
                    { required: true, type: 'integer', message: this.$t('请输入不能为空的正整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' }
                ],
                tradeTotalPrecision: [
                    { required: true, type: 'integer', message: this.$t('请输入不能为空的正整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' }
                ],
                feePrecision: [
                    { required: true, type: 'integer', message: this.$t('请输入不能为空的正整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' }
                ],
                symbolPartition: [
                    { required: true, message: this.$t('请选择交易对分区'), trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        this.initForm()
    },
    methods: {
        initForm () {
            this.symbolId = ''
            this.formItem = {
                baseCurrency: '',
                quoteCurrency: '',
                tradeEnableMap: this.$t('开启'),
                weight: 1,
                tradePricePrecision: 6,
                tradeAmountPrecision: 4,
                tradeTotalPrecision: 8,
                feePrecision: 8,
                tradeEnableDateTime: '2030-01-01T12:00:00+09:00'
            }
            this.autoCurrency = {
                base: '',
                quote: ''
            }
        },
        // 查询交易对信息
        getSymbolInfo (symbolId) {
            this.symbolId = symbolId
            exchange.getSymbolInfo.path = {'id': symbolId}
            this.$axios(exchange.getSymbolInfo).then((res) => {
                this.formItem = res.data.bean
                this.formItem.symbol = res.data.res.value
                this.formItem.tradeEnableMap = res.data.bean.tradeEnable === 1 ? this.$t('开启') : this.$t('关闭')
                this.formItem.tradePricePrecision = parseInt(res.data.bean.tradePricePrecision)
                this.formItem.tradeAmountPrecision = parseInt(res.data.bean.tradeAmountPrecision)
                this.formItem.tradeTotalPrecision = parseInt(res.data.bean.tradeTotalPrecision)
                this.formItem.feePrecision = parseInt(res.data.bean.feePrecision)
            })
        },
        dateFormat (date) {
            return this.$moment(date).format()
        },
        save () {
            this.$refs['formSymbolEdit'].validate((valid) => {
                if (valid) {
                    this.saveSub()
                } else {
                    this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
        },
        // 表单提交
        saveSub () {
            this.formItem.tradeEnable = this.boolean[this.formItem.tradeEnableMap]
            if ( this.symbolId ) this.formItem.id = this.symbolId
            this.formItem.tradeEnableDateTime = this.dateFormat(this.formItem.tradeEnableDateTime)
            this.formItem.value = this.formItem.symbol
            exchange.addSymbol.data = {...this.formItem}
            exchange.addSymbol.data.tradePricePrecision = this.formItem.tradePricePrecision.toString()
            exchange.addSymbol.data.tradeAmountPrecision = this.formItem.tradeAmountPrecision.toString()
            exchange.addSymbol.data.tradeTotalPrecision = this.formItem.tradeTotalPrecision.toString()
            exchange.addSymbol.data.feePrecision = this.formItem.feePrecision.toString()
            // delete exchange.addSymbol.data.tradeEnableMap
            this.$axios(exchange.addSymbol).then((res) => {
                if ( !this.symbolId ) this.$Message.success({content: this.$t('添加成功')})
                else this.$Message.success({content: this.$t('修改成功')})
                this.$emit('on-close', 'success')
            })
        },
        // 关闭modal时清空表单
        closeModal () {
            this.initForm()
            this.$refs.formSymbolEdit.resetFields()
        },
        // 拆分计价货币
        splitCurrency () {
            let reg = /^[A-Z]+\/[A-Z]+$/
            if ( reg.test(this.formItem.symbolName) ) {
                let arr = this.formItem.symbolName.split('/')
                if ( arr.length === 2 ) {
                    this.autoCurrency = {
                        base: arr[0].toLowerCase(),
                        quote: arr[1].toLowerCase()
                    }
                    // this.formItem.baseCurrency = this.autoCurrency.base
                    // this.formItem.quoteCurrency = this.autoCurrency.quote
                }
            }
        },
        // 修复radio无选中效果的bug
        checkedRadio (val) {
            let dom = document.body.querySelector('#enableRadio')
            let radio = dom.querySelectorAll('.ivu-radio')
            if ( val === this.$t('关闭') ) {
                this.formItem.tradeEnableMap = this.$t('关闭')
                radio[0].className = 'ivu-radio ivu-radio-checked'
                radio[1].className = 'ivu-radio'
            } else {
                this.formItem.tradeEnableMap = this.$t('开启')
                radio[1].className = 'ivu-radio ivu-radio-checked'
                radio[0].className = 'ivu-radio'
            }
        }
    },
    watch: {
        '$store.state.app.lang': {
            handler: function (val, oldVal) {
                this.initForm()
            },
            deep: true
        }
    }
}
</script>

<style lang="css">
</style>
