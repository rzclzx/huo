<template lang="html">
    <Form :model="formItem" :label-width="100" ref="applyListEdit" :rules="rules">
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="uid" :label="$t('UID')">
                    <Input v-model="formItem.uid" :placeholder="$t('UID')">
                        <Button slot="append" @click="searchUid">{{ $t('查询') }}</Button>
                    </Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="name" :label="$t('姓名')">
                    <Input v-model="formItem.name" disabled></Input>
                </FormItem>
            </Col>
        </Row>
        <FormItem prop="payBank" :label="$t('付款银行')">
            <Input v-model="formItem.payBankName" :placeholder="$t('')" disabled></Input>
        </FormItem>
        <FormItem prop="payBankAccount" :label="$t('付款银行账号')">
            <Input v-model="formItem.payBankAccount" :placeholder="$t('')" disabled></Input>
        </FormItem>
        <FormItem prop="depositAmount" :label="$t('付款金额')">
            <Input v-model="formItem.depositAmount" :placeholder="$t('')"></Input>
        </FormItem>
        <FormItem prop="bankName" :label="$t('收款银行')">
            <Select v-model="formItem.bankName" :placeholder="$t('请选择')" @on-change="bankChange" v-autoLocale>
                <Option :value="item.bankName" v-for="item in bankList">{{ item.bankName }}</Option>
            </Select>
        </FormItem>
        <FormItem prop="receiptAccountId" :label="$t('收款银行账号')">
            <Select v-model="formItem.receiptAccountId" :placeholder="$t('请选择')" v-autoLocale>
                <Option :value="item.id" v-for="item in accountList">{{ item.accountNumber }}</Option>
            </Select>
        </FormItem>
        <FormItem prop="receiptAccountId" :label="$t('开户名')">
            <Select v-model="formItem.receiptAccountId" :placeholder="$t('请选择')" v-autoLocale>
                <Option :value="item.id" v-for="item in accountList">{{ item.accountName }}</Option>
            </Select>
        </FormItem>
        <FormItem prop="remark" :label="$t('备注')">
            <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
        </FormItem>
        <FormItem prop="value" style="textAlign: center">
            <Button type="ghost" @click="cancel" style="margin-right: 40px">{{ $t('取消') }}</Button>
            <Button type="primary" @click="save">{{ $t('确定') }}</Button>
        </FormItem>
    </Form>
</template>

<script>
import { legalTender } from '__util/api'

export default {
    data () {
        const uidCheck = (rule, value, callback) => {
            if ( /^\d+$/.test(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('UID格式不正确')))
            }
        }
        const amountCheck = (rule, value, callback) => {
            if ( /^([0-9]+)(\.[0-9]+)?$/.test(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('请输入正确的数字')))
            }
        }
        const minVal = (rule, value, callback) => {
            if ( parseFloat(value) < 10000 ) {
                callback(new Error(this.$t('最小额度限制为10000')))
            } else {
                callback()
            }
        }
        return {
            formItem: {},
            rules: {
                uid: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { validator: uidCheck, trigger: 'blur' }
                ],
                payBank: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                ],
                payBankAccount: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                ],
                depositAmount: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { validator: amountCheck, trigger: 'blur' },
                    { validator: minVal,trigger: 'blur' }
                ]
                // currencyName: [
                //     { required: true, message: this.$t('币种名称不能为空'), trigger: 'blur' },
                //     { validator: nameCheck, trigger: 'blur' }
                // ],
                // currencyType: [
                //     { required: true, message: this.$t('手续费类型不能为空'), trigger: 'change' }
                // ],
                // visibleAssetsUids: [
                //     { validator: UIDCheck, trigger: 'blur' }
                // ],
            },
            bankList: this.$store.state.app.bankList,
            // 账户列表
            accountList: [],
        }
    },
    mounted () {
        // if ( this.$store.state.user.checkPerm('pro:settings:currency:statusCount') ) {

        // }
        this.initForm()
    },
    methods: {
        initForm () {
            this.formItem = {
                payBankName: '',
                payBankAccount: '',
                payBank: ''
            }
            this.$refs.applyListEdit.resetFields()
        },
        cancel () {
            this.$emit('close')
        },
        // 查询uid 信息
        searchUid () {
            if ( !this.formItem.uid ) {
                return
            }
            let option = {...legalTender.chargeManage.getUidInfo}
            option.path = {
                uid: this.formItem.uid
            }
            this.$axios(option).then(res => {
                this.formItem.payBankName = res.data.bankName
                this.formItem.payBankAccount = res.data.accountNumber
                this.formItem.payBank = res.data.bankCode
                this.formItem.name = res.data.accountName
            })
        },
        save () {
            this.$refs['applyListEdit'].validate((valid) => {
                if (valid) {
                    let option = {...legalTender.chargeManage.addApply}
                    option.data = {...this.formItem}
                    this.$axios(option).then(res => {
                        this.$Message.success({content: this.$t('保存成功')})
                        this.$emit('close', true)
                    })
                } else {
                    this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
        },
        bankChange (bankName) {
            // 不得不说  这个传惨   真难使，为什么不能直接给我返回object
            for (let item of this.bankList) {
                if ( item.bankName === bankName ) {
                    this.accountList = item.accountArr
                }
            }
        }
    }
}
</script>

<style lang="css">
</style>
