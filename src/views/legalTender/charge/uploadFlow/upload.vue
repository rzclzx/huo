<template lang="html">
    <Card>
        <Form :model="formItem" :label-width="140" ref="formUploadFile" :rules="rules">
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="bankCode" :label="$t('收款银行')">
                        <Select v-model="formItem.bankCode" class="hack-select" :placeholder="$t('请选择')" @on-change="bankChange" v-autoLocale>
                            <Option :value="item.bankCode" v-for="item in bankList">{{ item.bankName }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="30">
                <Col span="12">
                    <FormItem prop="receiptBankAccount" :label="$t('收款账号')">
                        <Select v-model="formItem.receiptBankAccount" class="hack-select" :placeholder="$t('请选择')" v-autoLocale>
                            <Option :value="item.accountNumber" v-for="item in accountList">{{ item.accountNumber }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="file" :label="$t('上传银行流水')">
                <FileInput @change="changeFile" ref="fileInput"></FileInput>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="uploadSub()">{{ $t('上传') }}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { legalTender } from '__util/api';
import FileInput from '__components/fileInput.vue'

export default {
    components: {
        FileInput
    },
    data () {
        return {
            formItem: {},
            rules: {},
            bankList: this.$store.state.app.bankList,
            accountList: [],
        }
    },
    mounted () {
    },
    methods: {
        initForm () {
            this.$refs['fileInput'].clear()
        },
        bankChange (bankCode) {
            // 不得不说  这个传惨   真难使，为什么不能直接给我返回object
            for (let item of this.bankList) {
                if ( item.bankCode === bankCode ) {
                    this.accountList = item.accountArr
                }
            }
        },
        // 选择文件
        changeFile (file) {
            this.formItem.file = file
        },
        uploadSub () {
            let option = {...legalTender.uploadFlow.uploadFlow}
            let formData = new FormData()
            formData.append('file', this.formItem.file)
            formData.append('bankCode', this.formItem.bankCode)
            formData.append('receiptBankAccount', this.formItem.receiptBankAccount)
            option.data = formData
            this.$axios(option).then(res => {
                this.$Message.success(this.$t('上传成功'))
            })
        }
    }
}
</script>

<style lang="css">
</style>
