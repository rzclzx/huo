<template lang="html">
    <div class="">
        <Row type="flex" justify="start" class="symbolSelect-row" v-if="$store.state.user.checkPerm('pro:settings:symbols:symbolName')">
            <Button type="primary" v-for="item in quotes" :key="item" @click="viewSymbol(item)">{{ item }}{{ $t('交易对选择') }}</Button>
        </Row>
        <Card class="rule-pane">
            <h4 class="rule-title">{{ baseCurrency }}<span v-show="baseCurrency">/</span>{{ quoteCurrency }}{{ $t('交易规则设置') }}</h4>
            <p class="rule-desc">{{ $t('请与后端沟通后进行设置，并提前确认后端是否会按照此规则进行生效') }}</p>
            <Form :model="formItem" :label-width="200" style="margin-top: 50px" ref="formRuleEdit" :rules="rules">
                <Row style="width: 600px;margin: 0 auto">
                    <FormItem prop="buyLimitMustLessThan" :label="$t('限价单买入价格不能高于现价的')">
                        <!-- <InputNumber v-model="formItem.weight" placeholder="" style="width: 100%">

                        </InputNumber> -->
                        <Input v-model="formItem.buyLimitMustLessThan" :disabled="!baseCurrency">
                            <span slot="append">{{ $t('倍') }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="sellLimitMustGreaterThan" :label="$t('限价单卖出价格不能低于现价的')">
                        <Input v-model="formItem.sellLimitMustGreaterThan" :disabled="!baseCurrency">
                            <span slot="append">{{ $t('倍') }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="limitOrderMustGreaterThan" :label="$t('限价单交易数量最小值')">
                        <Input v-model="formItem.limitOrderMustGreaterThan" :disabled="!baseCurrency">
                            <span slot="append">{{ baseCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="limitOrderMustLessThan" :label="$t('限价单交易数量最大值')">
                        <Input v-model="formItem.limitOrderMustLessThan" :disabled="!baseCurrency">
                            <span slot="append">{{ baseCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="marketBuyOrderMustGreaterThan" :label="$t('市价单买入数量最小值')">
                        <Input v-model="formItem.marketBuyOrderMustGreaterThan" :disabled="!baseCurrency">
                            <span slot="append">{{ quoteCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="marketBuyOrderMustLessThan" :label="$t('市价单买入数量最大值')">
                        <Input v-model="formItem.marketBuyOrderMustLessThan" :disabled="!baseCurrency">
                            <span slot="append">{{ quoteCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="marketSellOrderMustGreaterThan" :label="$t('市价单卖出币数量最小值')">
                        <Input v-model="formItem.marketSellOrderMustGreaterThan" :disabled="!baseCurrency">
                            <span slot="append">{{ baseCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="marketSellOrderMustLessThan" :label="$t('市价单卖出币数量最大值')">
                        <Input v-model="formItem.marketSellOrderMustLessThan" :disabled="!baseCurrency">
                            <span slot="append">{{ baseCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="circuitBreakWhenGreaterThan" :label="$t('当价格高于【?】开启熔断')">
                        <Input v-model="formItem.circuitBreakWhenGreaterThan" :disabled="!baseCurrency">
                            <span slot="append">{{ quoteCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem prop="circuitBreakWhenLessThan" :label="$t('当价格低于【?】开启熔断')">
                        <Input v-model="formItem.circuitBreakWhenLessThan" :disabled="!baseCurrency">
                            <span slot="append">{{ quoteCurrency }}</span>
                        </Input>
                    </FormItem>
                    <FormItem style="textAlign: center" v-show="baseCurrency">
                        <Button type="ghost" @click="reset">{{ $t('重置') }}</Button>
                        <Button type="primary" style="margin-left: 20px" @click="save" v-if="$store.state.user.checkPerm('pro:operate:tradeRule:update')">{{ $t('提交') }}</Button>
                    </FormItem>
                </Row>
            </Form>
        </Card>
        <Modal v-model="modal" width="800" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ modalTitle }}{{ $t('交易对') }}</span>
            </p>
            <div style="text-align:center">
                <div class="symbol-item-group" style="text-align:left;width: 694px;margin: 0 auto;">
                    <div class="symbol-item" :class="{'active': item === symbolActive}" v-for="item in symbolList" @click="symbolSelected(item)">{{ item }}</div>
                </div>
                <div style="textAlig: center; margin-top: 30px">
                    <Button type="primary" @click="modal = false">{{ $t('确定') }}</Button>
                </div>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>

<script>
import { exchange } from '__util/api'
import util from '__util/util'

export default {
    data () {
        // 浮点检验
        const lowerCheck = (rule, value, callback) => {
            if ( /^[a-z]+$/.test(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('全小写、不能有特殊字符、正确例子：ethbtc')))
            }
        }
        // 验证精度
        const precisionCheck = (rule, value, callback) => {
            if ( !value || !/^([0-9]+)(\.[0-9]+)?$/.test(value) ) {
                callback(new Error(this.$t('请输入浮点数')))
                return
            }
            if ( rule.field === 'buyLimitMustLessThan' || rule.field === 'sellLimitMustGreaterThan' ) {
                if ( util.floatCount(value, 4) ) callback()
                else callback(new Error(this.$t('精度必须是4')))
            }
            if ( rule.field === 'limitOrderMustGreaterThan' || rule.field === 'limitOrderMustLessThan' ||
                rule.field === 'marketSellOrderMustGreaterThan' || rule.field === 'marketSellOrderMustLessThan' ) {
                if ( util.floatCount(value, this.tradeAmountPrecision) ) callback()
                else callback(new Error(this.$t('精度必须是') + this.tradeAmountPrecision))
            }
            if ( rule.field === 'marketBuyOrderMustGreaterThan' || rule.field === 'marketBuyOrderMustLessThan' ) {
                if ( util.floatCount(value, this.tradeTotalPrecision) ) callback()
                else callback(new Error(this.$t('精度必须是') + this.tradeTotalPrecision))
            }
            if ( rule.field === 'circuitBreakWhenGreaterThan' || rule.field === 'circuitBreakWhenLessThan' ) {
                if ( util.floatCount(value, this.tradePricePrecision) ) callback()
                else callback(new Error(this.$t('精度必须是') + this.tradePricePrecision))
            }
            let str = value.toString().split('.')[1]
            if ( str ) {
                str = parseInt(str) === 0 ? '' : '.' + str
                this.formItem[rule.field] = value.toString().split('.')[0] + str
            }
        }
        return {
            // 基础计价货币
            quotes: [],
            formItem: {},
            // 重置用
            resetData: {},
            modal: false,
            modalTitle: '',
            // 存放不同计价货币的交易对
            symbolData: {},
            // 交易对列表
            symbolList: [],
            // 正在选择未确定的交易对
            symbolActive: null,
            // 选中的交易对
            symbolChecked: null,
            // 当前设置的交易对
            curSymbol: {},
            // 基础货币
            baseCurrency: '',
            // 计价货币
            quoteCurrency: '',
            // 交易数量精度
            tradeAmountPrecision: '',
            // 交易额精度
            tradeTotalPrecision: '',
            // 交易价格精度
            tradePricePrecision: '',
            rules: {
                buyLimitMustLessThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                sellLimitMustGreaterThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                limitOrderMustGreaterThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                limitOrderMustLessThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                marketBuyOrderMustGreaterThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                marketBuyOrderMustLessThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                marketSellOrderMustGreaterThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                marketSellOrderMustLessThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                circuitBreakWhenGreaterThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                circuitBreakWhenLessThan: [
                    { validator: precisionCheck, trigger: 'blur'}
                ]
            }
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('pro:settings:symbols:symbolName') ) {
            this.getSymbol()
        }
    },
    methods: {
        initForm () {
            this.baseCurrency = ''
            this.quoteCurrency = ''
            this.formItem = {}
            this.$refs.formRuleEdit.resetFields()
        },
        // 获取交易对
        getSymbol () {
            this.$axios(exchange.getSymbolName).then((res) => {
                this.quotes = res.data.quotes
                for (let item of this.quotes) {
                    this.symbolData[item] = res.data.symbolNames.filter(symbol => {
                        return symbol.indexOf('/') > -1 && symbol.split('/')[1] === item
                    })
                }
            })
        },
        // 选择交易对
        symbolSelected (item) {
            this.symbolActive = item
            this.symbolChecked = this.symbolActive
            // 处理完当前选中值再执行关闭
            this.modal = false
            // if ( this.$store.state.user.checkPerm('pro:operate:tradeRule:list') ) {
                this.getRule(this.symbolChecked)
            // }
        },
        viewSymbol (type) {
            this.modal = true
            this.modalTitle = type
            this.symbolList = this.symbolData[type]
            this.symbolActive = this.symbolChecked
        },
        // 查询交易规则
        getRule (symbol) {
            symbol = symbol.replace('/', '').toLowerCase()
            exchange.getRule.path = {symbol: symbol}
            this.$axios(exchange.getRule).then((res) => {
                this.formItem = {...res.data.map}
                this.resetData = {...res.data.map}
                this.tradeAmountPrecision = res.data.tradeAmountPrecision
                this.tradePricePrecision = res.data.tradePricePrecision
                this.tradeTotalPrecision = res.data.tradeTotalPrecision
            })
        },
        save () {
            this.$refs['formRuleEdit'].validate((valid) => {
                if (valid) {
                    this.saveSub()
                } else {
                    this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
        },
        saveSub () {
            if ( !this.symbolChecked ) {
                this.$Message.error({content: this.$t('请选择交易对')})
                return
            }
            this.formItem.symbol = this.symbolChecked.replace('/', '').toLowerCase()
            exchange.addRule.data = this.formItem
            this.$axios(exchange.addRule).then((res) => {
                this.$Message.success({content: this.$t('设置成功')})
            })
        },
        reset () {
            this.formItem = {...this.resetData}
            this.$refs.formRuleEdit.resetFields()
        }
    },
    watch: {
        symbolChecked (val) {
            if ( val.indexOf('/') === -1 ) {
                this.$Message.error({content: this.$t('交易对格式错误')})
                return
            }
            // if ( this.$store.state.user.checkPerm('pro:operate:tradeRule:list') ) {
                this.baseCurrency = val.split('/')[0]
                this.quoteCurrency = val.split('/')[1]
            // } else {
            //     this.$Message.error({content: this.$t('没有权限')})
            // }
        }
    }
}
</script>

<style lang="less">
.symbolSelect-row {
    margin-bottom: 10px;
    & > button {
        margin-right: 30px;
        margin-bottom: 10px;
        &:last-child {
            margin-right: 0;
        }
    }
    .symbolSelect {
        position: relative;
        box-sizing: content-box;
        width: 198px;
        height: 32px;
        margin-right: 30px;
        border-radius: 4px;
        line-height: 32px;
        border: 1px solid #CED5E0;
        background: #fff;
        &:last-child {
            margin-right: 0
        }
        & > span {
            display: inline-block;
            padding: 0 15px;
        }
        button {
            position: absolute;
            right: -1px;
        }
    }
}
.rule-pane {
    text-align: center;
}
.rule-desc {
    font-size: 14px;
    color: #7F8FA4;
}
.rule-title {
    margin-top: 34px;
    font-size: 20px;
    font-weight: normal;
    color: #354052;
}
.symbol-item-group {
    .symbol-item {
        display: inline-block;
        width: 120px;
        height: 40px;
        margin-right: 20px;
        margin-bottom: 10px;
        line-height: 40px;
        border: 1px solid #CED5E0;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        &:nth-child(5n) {
            margin-right: 0
        }
        &.active {
            background: #CED5E0;
        }
    }
}
</style>
