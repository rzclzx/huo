<template lang="html">
    <div>
        <Form :model="formItem" :label-width="140" ref="formCoinEdit" :rules="rules">
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="value" :label="$t('币种标识(对内)')">
                        <Input v-model="formItem.value" :placeholder="$t('与bitex交互使用')"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem prop="currencyCode" :label="$t('币种code(对外)')">
                        <Input v-model="formItem.currencyCode" :placeholder="$t('与用户交互使用')"></Input>
                    </FormItem>
                </Col>
            </Row>
            <!-- <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="transferType" :label="$t('是否自动划转')" style="textAlign: left">
                        <Tooltip transfer placement="top" slot="label">
                            <p slot="content" style="white-space: pre-wrap;">{{ $t('设置为是，则在充币时自动划转至币币交易账户') }}</p>
                            {{ $t('是否自动划转') }}
                        </Tooltip>
                        <RadioGroup v-model="formItem.transferType">
                            <Radio label="Y">{{ $t('是') }}</Radio>
                            <Radio label="N">{{ $t('否') }}</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row> -->
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="currencyName" :label="$t('币种名称')">
                        <Input v-model="formItem.currencyName" :placeholder="$t('前端显示名称')"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem prop="currencyType" :label="$t('手续费类型')">
                        <Select v-model="formItem.currencyType" :placeholder="$t('请选择')" v-autoLocale>
                            <Option value="eth">{{ $t('固定手续费') }}</Option>
                            <!-- <Option value="btc" v-if="isShowFee">{{ $t('区间手续费') }}</Option> -->
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="visibleAssetsUids" :label="$t('币种可见白名单')">
                <Input v-model="formItem.visibleAssetsUids" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('用户UID，以英文逗号分隔')"></Input>
            </FormItem>
            <FormItem prop="visibleAssetsDateTime" :label="$t('币种可见时间')">
                <DatePicker v-model="formItem.visibleAssetsDateTime" transfer type="datetime" format="yyyy-MM-ddTHH:mm:ssZZ" :placeholder="$t('Select date')" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem prop="depositEnableUids" :label="$t('充币开放白名单')">
                <Input v-model="formItem.depositEnableUids" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('用户UID，以英文逗号分隔')"></Input>
            </FormItem>
            <FormItem prop="depositEnableDateTime" :label="$t('充币开放时间')">
                <DatePicker v-model="formItem.depositEnableDateTime" transfer type="datetime" format="yyyy-MM-ddTHH:mm:ssZZ" :placeholder="$t('Select date')" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem prop="withdrawEnableUids" :label="$t('提币开放白名单')">
                <Input v-model="formItem.withdrawEnableUids" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('用户UID，以英文逗号分隔')"></Input>
            </FormItem>
            <FormItem prop="withdrawEnableDateTime" :label="$t('提币开放时间')">
                <DatePicker v-model="formItem.withdrawEnableDateTime" transfer type="datetime" format="yyyy-MM-ddTHH:mm:ssZZ" :placeholder="$t('Select date')" style="width: 100%"></DatePicker>
            </FormItem>
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="depositMinAmount" :label="$t('最小充币金额')">
                        <!-- <InputNumber v-model="formItem.depositMinAmount"  :precision="8" placeholder="" style="width: 100%"></InputNumber> -->
                        <Input v-model="formItem.depositMinAmount" :placeholder="$t('')"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem prop="withdrawMinAmount" :label="$t('最小提币金额')">
                        <!-- <InputNumber v-model="formItem.withdrawMinAmount" :precision="8" placeholder="" style="width: 100%"></InputNumber> -->
                        <Input v-model="formItem.withdrawMinAmount" :placeholder="$t('')"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="showPrecision" :label="$t('客户端展示精度')">
                        <Input v-model="formItem.showPrecision" :placeholder="$t('')"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem prop="withdrawPrecision" :label="$t('提币数量精度')">
                        <Input v-model="formItem.withdrawPrecision" :placeholder="$t('')"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="weight" :label="$t('排序权重')">
                        <Input v-model="formItem.weight" :placeholder="$t('')" Number></Input>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="currencyAddrType" :label="$t('币种地址类型')">
                <Input v-model="formItem.currencyAddrType" :placeholder="$t('某些币种会公用其他币种的地址，比如etc使用的eth的地址，需产品给出')"></Input>
            </FormItem>
            <FormItem prop="withdrawDescMap" :label="$t('提币文案')">
                <Tabs size="small" v-model="wtab">
                    <TabPane :label="$t('本地')" name="name1">
                        <Input v-model="formItem.withdrawDescMap['loc-LAN']" @on-keydown="tabBug" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                    </TabPane>
                    <TabPane :label="$t('英文')" name="name2">
                        <Input v-model="formItem.withdrawDescMap['en-US']" @on-keydown="tabBug" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                    </TabPane>
                    <TabPane :label="$t('中文')" name="name3">
                        <Input v-model="formItem.withdrawDescMap['zh-CN']" @on-keydown="tabBug" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                    </TabPane>
                </Tabs>
            </FormItem>
            <FormItem prop="depositDescMap" :label="$t('充币文案')">
                <Tabs size="small" v-model="ptab">
                    <TabPane :label="$t('本地')" name="name1">
                        <Input v-model="formItem.depositDescMap['loc-LAN']" @on-keydown="tabBug" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                    </TabPane>
                    <TabPane :label="$t('英文')" name="name2">
                        <Input v-model="formItem.depositDescMap['en-US']" @on-keydown="tabBug" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                    </TabPane>
                    <TabPane :label="$t('中文')" name="name3">
                        <Input v-model="formItem.depositDescMap['zh-CN']" @on-keydown="tabBug" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                    </TabPane>
                </Tabs>
            </FormItem>
            <!-- <FormItem label="禁止的国家列表">
                <Transfer
                    :data="countryList"
                    :target-keys="targetCountry"
                    :list-style="{width: '250px', textAlign: 'left'}"
                    :titles="['所有国家列表', '已禁止列表']"
                    filterable
                    @on-change="countryChange">
                </Transfer>
            </FormItem> -->
            <div class="">
                <Button type="primary" @click="save">{{ $t('保存') }}</Button>
            </div>
        </Form>
    </div>
</template>

<script>
import { exchange } from '__util/api'
import util from '__util/util'

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
        // 不允许中文和特殊字符
        const nameCheck = (rule, value, callback) => {
            if ( /^[a-zA-Z0-9]+$/.test(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('只允许英文和数字')))
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
        // 不能小于0的整数验证
        const intCheck = (rule, value, callback) => {
            if ( /^[0-9]+$/.test(value) && parseInt(value) >= 0 ) {
                callback()
            } else {
                callback(new Error(this.$t('请输入不能为小于0的整数')))
            }
        }
        // 正数
        const fCheck = (rule, value, callback) => {
            if ( value > 0 ) {
                callback()
            } else {
                callback(new Error(this.$t('不能为负数')))
            }
        }
        const precisionCheck = (rule, value, callback) => {
            if ( util.floatCount(value, 8) && value > 0 ) callback()
            else callback(new Error(this.$t('请输入精度不能超过8位的正数')))
        }
        return {
            formItem: {
                currencyName: '',
                depositMinAmount: '1',
                withdrawMinAmount: '1',
                showPrecision: '4',
                transferType: 'N'
            },
            // 国家列表
            countryList: [{key: '1', label: '安哥拉/Angola'}, {key: '2', label: '中国/China'}],
            // 已禁止国家
            targetCountry: ['1'],
            // 修改的币种ID
            coinId: '',
            wtab: 'name1',
            ptab: 'name1',
            // 表单验证
            rules: {
                value: [
                    { required: true, message: this.$t('币种标识(对内)不能为空'), trigger: 'blur' },
                    { validator: nameCheck, trigger: 'blur' }
                ],
                currencyCode: [
                    { required: true, message: this.$t('币种code(对外)不能为空'), trigger: 'blur' },
                    { validator: nameCheck, trigger: 'blur' }
                ],
                currencyName: [
                    { required: true, message: this.$t('币种名称不能为空'), trigger: 'blur' },
                    { validator: nameCheck, trigger: 'blur' }
                ],
                currencyType: [
                    { required: true, message: this.$t('手续费类型不能为空'), trigger: 'change' }
                ],
                visibleAssetsUids: [
                    { validator: UIDCheck, trigger: 'blur' }
                ],
                depositEnableUids: [
                    { validator: UIDCheck, trigger: 'blur' }
                ],
                withdrawEnableUids: [
                    { validator: UIDCheck, trigger: 'blur' }
                ],
                visibleAssetsDateTime: [
                    { required: true, type: 'date', message: this.$t('币种可见时间不能为空'), trigger: 'change' },
                    { validator: dateCheck, trigger: 'blur'}
                ],
                depositEnableDateTime: [
                    { required: true, type: 'date', message: this.$t('充币开放时间不能为空'), trigger: 'change' }
                ],
                withdrawEnableDateTime: [
                    { required: true, type: 'date', message: this.$t('提币开放时间不能为空'), trigger: 'change' }
                ],
                currencyAddrType: [
                    { required: true, message: this.$t('币种地址类型不能为空'), trigger: 'blur' }
                ],
                weight: [
                    { required: true, message: this.$t('请输入不能为小于0的整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur'}
                ],
                transferType: [
                    { required: true, message: this.$t('请选择是否自动划转'), trigger: 'change' },
                ],
                showPrecision: [
                    { required: true, message: this.$t('请输入不能为小于0的整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur'}
                ],
                withdrawPrecision: [
                    { required: true, message: this.$t('请输入不能为小于0的整数'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur'}
                ],
                withdrawMinAmount: [
                    // { required: true, type: 'number', message: '请输入精度为8的正数', trigger: 'blur' },
                    // { validator: fCheck, trigger: 'blur'}
                    { required: true, message: this.$t('请输入精度不能超过8位的正数'), trigger: 'blur' },
                    { validator: precisionCheck, trigger: 'blur'}
                ],
                depositMinAmount: [
                    { required: true, message: this.$t('请输入精度不能超过8位的正数'), trigger: 'blur' },
                    { validator: precisionCheck, trigger: 'blur'}
                ]
            },
            // 是否显示区间手续费
            isShowFee: false
        }
    },
    created () {
        this.initForm()
        if ( process.env.TYPE === 'kr' ) this.isShowFee = true
    },
    methods: {
        initForm () {
            this.formItem = {
                withdrawDescMap: {},
                depositDescMap: {},
                currencyName: '',
                depositMinAmount: '1',
                withdrawMinAmount: '1',
                showPrecision: '4',
                transferType: 'N',
                visibleAssetsDateTime: '2030-01-01T12:00:00+09:00',
                depositEnableDateTime: '2030-01-01T12:00:00+09:00',
                withdrawEnableDateTime: '2030-01-01T12:00:00+09:00'
            }
            this.coinId = ''
            this.wtab = 'name1'
            this.ptab = 'name1'
        },
        countryChange (newTargetKeys, direction, moveKeys) {
            // 控制target-keys即可
            this.targetCountry = newTargetKeys
        },
        dateFormat (date) {
            return this.$moment(date).format()
        },
        // 查询币种信息
        getCurrencyInfo (coinId) {
            this.coinId = coinId
            exchange.getCurrencyInfo.path = {'id': coinId}
            this.$axios(exchange.getCurrencyInfo).then((res) => {
                this.formItem = res.data.bean
                this.formItem.weight = res.data.bean.weight.toString()
                this.formItem.value = res.data.res.value
                this.formItem.depositDescMap = JSON.parse(res.data.bean.depositDesc)
                this.formItem.withdrawDescMap = JSON.parse(res.data.bean.withdrawDesc)
                // this.formItem.depositMinAmount = res.data.bean.depositMinAmount*100/100
                // this.formItem.withdrawMinAmount = res.data.bean.withdrawMinAmount*100/100
            })
        },
        save () {
            this.$refs['formCoinEdit'].validate((valid) => {
                if (valid) {
                    this.saveSub()
                } else {
                    this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
        },
        // 提交表达
        saveSub () {
            if ( this.coinId ) this.formItem.id = this.coinId
            this.formItem.withdrawDesc = JSON.stringify(this.formItem.withdrawDescMap)
            this.formItem.depositDesc = JSON.stringify(this.formItem.depositDescMap)
            this.formItem.visibleAssetsDateTime = this.dateFormat(this.formItem.visibleAssetsDateTime)
            this.formItem.depositEnableDateTime = this.dateFormat(this.formItem.depositEnableDateTime)
            this.formItem.withdrawEnableDateTime = this.dateFormat(this.formItem.withdrawEnableDateTime)
            exchange.addCurrency.data = {...this.formItem}
            exchange.addCurrency.data.settingsType = 'currency'
            exchange.addCurrency.data.withdrawMinAmount = this.formItem.withdrawMinAmount.toString()
            exchange.addCurrency.data.depositMinAmount = this.formItem.depositMinAmount.toString()
            this.$axios(exchange.addCurrency).then((res) => {
                if (res.success) {
                    if ( !this.coinId ) this.$Message.success({content: this.$t('添加成功')})
                    else this.$Message.success({content: this.$t('修改成功')})
                    this.$emit('on-close', 'success')
                }
            })
        },
        // 关闭modal时清空表单
        closeModal () {
            this.initForm()
            this.$refs.formCoinEdit.resetFields()
        },
        // 解决tab bug
        tabBug (e) {
            if ( e.keyCode === 9 ) {
                e.preventDefault()
                e.stopPropagation()
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

<style lang="less">
    .hack-select{
        .ivu-select-dropdown{
            position: absolute!important;
            top: 30px !important;
        }
    }
</style>
