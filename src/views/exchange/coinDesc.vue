<template lang="html">
    <Modal v-model="modal" width="800" class-name="modal-clear-line">
        <p slot="header" style="text-align:center">
            <span>{{ $t('币种介绍') }}</span>
        </p>
        <div style="text-align:center">
            <Form :model="formItem" :label-width="100">
                <FormItem label="">
                    <Radio-btn :text="langText" :value="langValue" :checked="radioChecked" @change="changeLang"></Radio-btn>
                </FormItem>
                <FormItem :label="$t('全称')">
                    <Input v-model="formItem.fullName" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('简称')">
                    <Input v-model="formItem.shortName" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')" :disabled="!isEdit"></Input>
                </FormItem>
                <Form-item :label="$t('Logo')" style="text-align: left">
                    <Col span="6">
                        <FileUpload :file="formItem.logo" ref="fileUpload" v-on:error="uploadError" v-on:success="uploadSuccess" :disabled="!isEdit"/>
                    </Col>
                    <Col span="6">
                        <img class="logo" :src="formItem.logoAddress" v-if="formItem.logoAddress"/>
                    </Col>
                </Form-item>
                <FormItem :label="$t('简介')">
                    <Input v-model="formItem.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('发行时间')">
                    <DatePicker v-model="formItem.publishTime" transfer type="date" :placeholder="$t('Select date')" style="width: 100%" :disabled="!isEdit"></DatePicker>
                </FormItem>
                <FormItem :label="$t('发行总量')">
                    <Input v-model="formItem.publishVolume" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('流通总量')">
                    <Input v-model="formItem.circulateVolume" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('众筹价格')">
                    <Input v-model="formItem.crowdfundingPrice" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('项目进展')">
                    <Input v-model="formItem.projectProgress" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('技术特点')">
                    <Input v-model="formItem.technicalCharacteristics" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('项目团队')">
                    <Input v-model="formItem.projectTeam" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('ICO进度')">
                    <Input v-model="formItem.ICOProgress" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('项目估值')">
                    <Input v-model="formItem.projectValuation" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('融资历史')">
                    <Input v-model="formItem.financingHistory" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('白皮书')">
                    <Input v-model="formItem.whitePaper" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('官网')">
                    <Input v-model="formItem.officialWebsite" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('区块查询')">
                    <Input v-model="formItem.blockQuery" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('共识机制')">
                    <Input v-model="formItem.consensusMechanism" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('项目类型')">
                    <Input v-model="formItem.projectType" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('应用')">
                    <Input v-model="formItem.application" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="!isEdit"></Input>
                </FormItem>
                <FormItem :label="$t('币种介绍')">
                    <vue-editor :id="coin.value" v-model="formItem.content" />
                </FormItem>
                <div class="" v-if="isEdit">
                    <Button type="primary" @click="submit" v-if="$store.state.user.checkPerm('pro:currency:introduction:select:update')">{{ $t('保存') }}</Button>
                </div>
            </Form>
        </div>
        <div slot="footer" style="border-top: 0">
        </div>
    </Modal>
</template>

<script>
import RadioBtn from '__components/radioBtn'
import FileUpload from '__components/fileUpload'
import { exchange } from '__util/api'
import { VueEditor } from 'vue2-editor'
export default {
    components: {
        RadioBtn,
        FileUpload,
        VueEditor
    },
    data () {
        return {
            modal: false,
            // radiobtn 数据
            // langText: [this.$t('本地语言'), this.$t('英文'), this.$t('中文')],
            langValue: [1, 3, 2],
            formItem: {},
            // 存放不同语言的form数据
            formData: {},
            // 语言类型
            langType: 1,
            // 新增/修改标识
            subFlag: '',
            radioChecked: '',
            // 是否有权限提交
            // isPerm: false
        }
    },
    props: {
        show: Boolean,
        coin: Object,
        isEdit: Boolean
    },
    mounted () {
        this.radioChecked = this.langText[0]
    },
    computed: {
        langText () {
            return [this.$t('本地语言'), this.$t('英文'), this.$t('中文')]
        }
    },
    methods: {
        // 初始化表单
        initForm () {
            this.formItem = {}
            this.subFlag = ''
            this.formData = {}
            this.radioChecked = this.langText[0]
            this.langType = this.langValue[0]
            this.$refs['fileUpload'].clearFiles()
            this.isPerm = false
        },
        // 获取币种信息
        getCurrencyDesc (langType) {
            langType = langType || this.langType
            exchange.getCurrencyDesc.path = {'currency': this.coin.value, 'langType': langType}
            this.$axios(exchange.getCurrencyDesc).then((res) => {
                this.formItem = res.data
                this.subFlag = res.data.existFlag
                // 判断添加接口
                // if ( !this.subFlag ) {
                //     if ( this.$store.state.user.checkPerm('pro:currency:introduction:select:save') ) {
                //         this.isPerm = true
                //     }
                // } else {
                //     if ( this.$store.state.user.checkPerm('pro:currency:introduction:select:update') ) {
                //         this.isPerm = true
                //     }
                // }
            })
        },
        changeLang (item) {
            this.radioChecked = item.text
            let oldVal = this.langType,
                val = item.value
            this.formData[oldVal] = Object.assign({}, this.formItem)
            if (!this.formData[val]) {
                this.getCurrencyDesc(val)
            } else {
                this.formItem = this.formData[val]
                this.subFlag = this.formItem.existFlag
            }
            this.langType = item.value
        },
        // 上传logo成功
        uploadSuccess(res){
            this.formItem.logoAddress = res
        },
        // 上传失败
        uploadError () {

        },
        submit () {
            let option = !this.subFlag ? exchange.addCurrencyDesc : exchange.updateCurrencyDesc
            option.data = this.formItem
            option.data.symbol = option.data.currency
            this.$axios(option).then((res) => {
                this.$Message.success({content: this.$t('编辑成功')})
                this.getCurrencyDesc()
            })
        }
    },
    watch: {
        show (val) {
            this.modal = val
        },
        modal (val) {
            if ( !val ) {
                this.initForm()
                this.$emit('on-close')
            } else {
                this.getCurrencyDesc()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.logo {
    width: 60px;
    height: 60px;
    border-radius: 3px;
    background-color: #fafafa;
}
</style>
