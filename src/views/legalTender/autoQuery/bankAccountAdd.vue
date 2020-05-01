<template lang="html">
    <Form :model="form" :label-width="100" ref="bankForm" :rules="ruleItem">
        <!-- <Row :gutter="30">
            <Col span="12">
                <FormItem prop="value" :label="$t('UID')">
                    <Input v-model="form.uid" :placeholder="$t('UID')"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="currencyCode" :label="$t('姓名')">
                    <Input v-model="form.currencyCode"></Input>
                </FormItem>
            </Col>
        </Row> -->
        <!-- <pre>
            {{form}}
            {{bankinfo}}
        </pre> -->
        <FormItem prop="bankCode" :label="$t('开户行')" >
            <Select @on-change="selectBank" v-model="bankName" clearable :placeholder="$t('开户行')" v-autoLocale>
                <Option v-for="item in bankNames" :value="item" :key="item">{{ item }}</Option>
            </Select>
        </FormItem>
        <FormItem prop="accountName" :label="$t('开户名')">
            <Input v-model="form.accountName" :placeholder="$t('')"></Input>
        </FormItem>
        <FormItem prop="bankNumber" :label="$t('银行帐号')">
            <Input v-model="form.bankNumber" :placeholder="$t('')"></Input>
        </FormItem>
        <FormItem prop="remark" :label="$t('提示信息')">
            <Input v-model="form.remark" :placeholder="$t('')"></Input>
        </FormItem>


        <FormItem prop="customType" :label="$t('类型')">
            <RadioGroup v-model="form.customType">
                    <Radio label="0">{{$t("普通银行")}}</Radio>
                    <Radio label="1"> {{$t("大客户银行")}}</Radio>
                </RadioGroup>
        </FormItem>

        <FormItem prop="useStatus" :label="$t('使用状态')">
            <RadioGroup v-model="form.useStatus">
                    <Radio label="0">{{$t("正在使用")}}</Radio>
                    <Radio label="1">{{$t("暂停")}}</Radio>
                </RadioGroup>
        </FormItem>
        <FormItem prop="bankUrl" :label="$t('银行链接')">
            <Input v-model="form.bankUrl" :placeholder="$t('')"></Input>
        </FormItem>

        <FormItem prop="value" style="textAlign: center;">
            <!-- <Button type="ghost" @click="cancel" style="margin-right: 40px">{{ $t('取消') }}</Button> -->
            <Button type="primary" @click="save">{{ $t('确定') }}</Button>
        </FormItem>
    </Form>

</template>

<script>

    // bankDelete: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/delete'},
    // bankInfo: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/info'},
    // accountName: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/accountName'},
    // bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'},
    // bankSave: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/save'},
    // bankUpdate: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/update'},
import { legalTender } from '__util/api'
export default {
    props:['bankNames',"bankinfo"],
    data () {
        return {
            bankName:'',
            // bankurl:'',
            form: {
                bankCode:'',
                isDel:0,
                accountStatus:0,
                customType:'0',
                useStatus:'1',
                bankUrl:''
            },
            rules: {},
            ruleItem: {
                accountName: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                bankCode: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                bankNumber: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                remark: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],

                // customType: [
                //     {
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],

                // useStatus: [
                //     {
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],

            },


        }
    },
    mounted(){
        // console.log
        if(this.bankinfo.id){
            this.bankName = this.bankinfo.bankName
            this.selectBank(this.bankName)

            this.form.accountName = this.bankinfo.accountName
            this.form.bankNumber = this.bankinfo.bankNumber
            this.form.remark = this.bankinfo.remark
            this.form.customType = this.bankinfo.customType
            this.form.useStatus = this.bankinfo.useStatus
        }
    },
    watch:{
        bankinfo:function(val){
                this.$refs['bankForm'].resetFields()

            if(val.id){
                this.bankName = val.bankName
                this.selectBank(this.bankName)
                this.form.id = val.id
                this.form.accountName = val.accountName
                this.form.bankNumber = val.bankNumber
                this.form.remark = val.remark
                this.form.customType = val.customType
                this.form.useStatus = val.useStatus

            }else{
                this.form = {
                    bankCode:'',
                    isDel:0,
                    accountStatus:0,
                    customType:'0',
                    useStatus:'1',
                    bankUrl:''

                }


                this.bankName = ''
                // this.form.bankUrl = ''
            }

            console.log(val)
        }
    },
    methods: {
        async selectBank(val){
            if(!val){
                this.forn.bankUrl = ''
                this.form.bankCode = ''
                return false
            }
            // console.log(this.form)
            const obj = {...legalTender.bankUrl,data:{bankName:val}}
            const res = await this.$axios(obj)
            if(res.success){
                // this.bankurl = res.data
                // console.log()
                this.form.bankUrl = res.data.url
                this.form.bankCode = res.data.bankCode

            }
        },
        cancel () {
            this.$emit('cancel')
        },
        async save () {
            const self = this
            this.$refs['bankForm'].validate(async function(valid){

                if(valid){
                    let obj, title
                    if(self.form.id){
                        obj = {...legalTender.bankUpdate,data:{...self.form,useStatus:Number(self.form.useStatus),customType:Number(self.form.customType)}}
                        title=self.$t('修改成功')


                    }else{
                        obj = {...legalTender.bankSave,data:{...self.form,useStatus:Number(self.form.useStatus),customType:Number(self.form.customType)}}
                        title=self.$t('新建成功')
                    }
                    const res = await self.$axios(obj)
                    if(res.success){
                        self.$emit('success')
                        self.$Message.success(title)
                    }

                }
            })




        }
    }
}
</script>

<style lang="css">
</style>
