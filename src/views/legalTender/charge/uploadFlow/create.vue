<template lang="html">
    <Form :model="formItem" :label-width="140" ref="formCoinEdit" :rules="rules">
        <!-- <Row :gutter="30">
            <Col span="12">
                <FormItem prop="value" :label="$t('流水号')">
                    <Input v-model="formItem.depositBankId" :placeholder="$t('')"></Input>
                </FormItem>
            </Col>
        </Row> -->
        <Row :gutter="30">
            <Col span="6">
                <FormItem prop="value" :label="$t('姓名')">
                    <Input v-model="formItem.name" :placeholder="$t('')"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem prop="currencyCode" :label="$t('打款银行')">
                    <Select v-model="formItem.payBankCode" class="hack-select" :placeholder="$t('请选择')" v-autoLocale>
                        <Option :value="item.bankCode" v-for="item in payBankList">{{ item.bankName }}</Option>
                    </Select>
                    <!-- <Input v-model="formItem.payBankCode" :placeholder="$t('')"></Input> -->
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="value" :label="$t('打款银行账号')">
                    <Input v-model="formItem.payBankAccount" :placeholder="$t('')"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem prop="value" :label="$t('打款备注')">
                    <Input v-model="formItem.payRemark" :placeholder="$t('')"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="6">
                <FormItem prop="value" :label="$t('收款银行')">
                    <Select v-model="formItem.bankCode" class="hack-select" :placeholder="$t('请选择')" @on-change="bankChange" v-autoLocale>
                        <Option :value="item.bankCode" v-for="item in bankList">{{ item.bankName }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem prop="currencyCode" :label="$t('收款开户名')">
                    <Select v-model="formItem.receiptAccountId" class="hack-select" :placeholder="$t('请选择')" v-autoLocale>
                        <Option :value="item.id" v-for="item in accountList">{{ item.accountName }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem prop="add_amount" :label="$t('到款金额')">
                    <Input v-model="formItem.payAmount" :placeholder="$t('')"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="value" :label="$t('收款银行账号')">
                    <Select v-model="formItem.receiptAccountId" class="hack-select" :placeholder="$t('请选择')" v-autoLocale>
                        <Option :value="item.id" v-for="item in accountList">{{ item.accountNumber }}</Option>
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="value" :label="$t('备注')">
                    <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 10}" :placeholder="$t('')"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="value" :label="$t('上传附件')">
                    <FileUpload
                        :file="formItem.file"
                        action="/v1/manuallegal/hbuploadbankflow/uploadImage"
                        v-on:error="uploadError"
                        v-on:success="uploadSuccess"
                        name="file"
                        :disabled="!$store.state.user.checkPerm('manuallegal:hbuploadbankflow:uploadImage')"></FileUpload>
                </FormItem>
                <FormItem>
                    {{ $t('请上传用户打款流水单等证明资料，格式为JPG，PNG，PDF，GIF，大小不超过10M') }}
                </FormItem>
            </Col>
        </Row>
        <Row style="textAlign: center">
            <Button type="ghost" @click="initForm()" style="marginRight: 50px">{{ $t('取消') }}</Button>
            <Button type="primary" @click="sub()">{{ $t('确定') }}</Button>
        </Row>
    </Form>
</template>

<script>
import FileUpload from '@/components/fileUpload'
import { legalTender } from '__util/api';

export default {
    components: {
        FileUpload
    },
    data () {
        return {
            formItem: {},
            bankList: [],
            payBankList: [],
            accountList: [],
            rules: {}
        }
    },
    methods: {
        initForm () {
            this.formItem = {}
        },
        uploadSuccess (res) {
            if ( !this.formItem.imgs || this.formItem.imgs.length === 0 ) {
                this.formItem.imgs = []
            }
            this.formItem.imgs.push(res)
        },
        uploadError () {

        },
        sub () {
            let option = {...legalTender.uploadFlow.save}
            option.data = {...this.formItem}
            option.data.imgs = this.formItem.imgs.toString()
            this.$axios(option).then(res => {
                this.$Message.success({content: this.$t('操作成功')})
                this.initForm()
            })
        },
        bankChange (bankCode) {
            // 不得不说  这个传惨   真难使，为什么不能直接给我返回object
            for (let item of this.bankList) {
                if ( item.bankCode === bankCode ) {
                    this.accountList = item.accountArr
                }
            }
        },
    },
    watch: {
        '$store.state.app.payBankList': {
            handler (val) {
                this.payBankList = val
            },
            deep: true
        },
        '$store.state.app.bankList': {
            handler (val) {
                this.bankList = val
            },
            deep: true
        }
    }
}
</script>

<style lang="css">
</style>
