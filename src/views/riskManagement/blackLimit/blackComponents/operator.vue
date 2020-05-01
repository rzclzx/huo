<template>
    <div>
        <!-- <pre>{{obj}}
            {{strict}}
        </pre> -->
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
            <Form :model="obj" :rules="ruleItem" class="modal-form" ref="rule" :label-width="100">
                <FormItem :label="$t('用户状态')">
                    <RadioGroup v-model="obj.userState"  @on-change='changeState'>
                        <Radio :label="0">
                            <span>{{$t('正常')}}</span>
                        </Radio>
                        <Radio :label="1">
                            <span>{{$t('限制')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="$t('限制项')">
                    <CheckboxGroup v-model="strict">
                        <Checkbox :disabled="disableStrict" :label="$t('提币')"></Checkbox>
                        <Checkbox :disabled="disableStrict" :label="$t('提现')"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem :label="$t('批量上传UID')">
                    <Upload
                        action='xx'
                        :before-upload="handleUpload"
                        ref='uploadfile'
                        >
                        <Button type="ghost" icon="ios-cloud-upload-outline">{{$t('上传文件')}}</Button>
                    </Upload>
            <!-- <FileUpload ref="uploadfile" v-on:success="uploadSuccess" action="/v1/manuallegal/hbvipcustomer/addCsv" name='uploadfile' :format="format">
            </FileUpload> -->
              <p>{{$t('请将用户UID在CSV表格中按列输入并上传')}}</p>
                <p>{{this.file.name}}</p>
                </FormItem>
                <FormItem :label="$t('黑名单备注')" prop="reason">
                    <Input :rows='10' type="textarea" v-model="obj.reason"></Input>
                </FormItem>
                <FormItem :label="$t('')" prop="reason">
                    <Button type="primary" @click="submit">{{$t('保存')}}</Button>
                </FormItem>
            </Form>
                </Card>
            </Col>
        </Row>
        <UploadResult :show.sync='resultModal' @output="outputFail" :result="uploadRes" @cancel="cancelUpload" @confirm='confirmUpload' ></UploadResult>
    </div>
</template>
<script>
import { limit } from '__util/api';
import util from '__util/util.js'

import handler from '__util/publicMethod';
import UploadResult from '__components/uploadResult.vue'
import { legalTender } from '__util/api'
const black = {
    excel:{method:'post',url:'v1/black/management/execl'}
}
export default {
    components:{
        UploadResult
    },
    data () {
        const remarkCheck = (rule, value, callback) => {
            if ( maxL(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('最多40个字符')))
            }
        }
        const maxL = (str) => {
            if (!str) return true
            str = handler.removeBlank(str)
            let num = 0
            let arr = str.split('')
            for (let i of arr) {
                if (/[^\u0000-\u00FF]/.test(i)) {
                    num += 2
                } else {
                    num += 1
                }
            }
            if (num > 40) {
                return false
            } else {
                return true
            }
        }
        return {
        format:['csv','xls','xlsx'],

            obj: {
            },
            ruleItem: {
                uids: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { pattern: /^[0-9,]+$/, message: this.$t('只能输入数字和逗号'), trigger: 'blur' }
                ],
                reason: [
                    { validator: remarkCheck, trigger: 'blur' }
                ]
            },
            message: {
                successUids: '',
                notExistUids: '',
                failUids: '',
                successL: 0,
                notL: 0,
                failL: 0
            },
            showLog: false,
            uploadRes:{},
            resultModal:false,
            strict:[this.$t('提币'), this.$t('提现')],
            disableStrict:true,
            file:{}
        }
    },
    created () {
        this.init()
    },
    methods: {
        changeState(v){
            if(v===1){
                this.disableStrict=false
                // 限制
            }else{
                this.disableStrict=true
                this.strict = [this.$t('提币'), this.$t('提现')]

            }
        },

        handleUpload(file){
            this.file = file;
            return false;
        },
        async outputFail(){
            const res = await this.$axios({...black.excel,data:{key:this.uploadRes.key}})
            if(res.success){
                util.download(res.data)
            }
        },
        cancelUpload(){
            this.resultModal = false
        },
        reset(){

        },
        confirmUpload(){
            this.resultModal = false
            this.$Message.success("上传成功")
            // this.uploadRes = {}
            this.obj = {
                userState:'0'
            }
            this.changeState('0')
            this.$refs.uploadfile.clearFiles()

            limit.black.batchComfirm.data = {
                key: this.uploadRes.key
            }
            this.$axios(limit.black.batchComfirm).then((res) => {

            })

            // this.obj.key = this.uploadRes.key
            // this.obj.uids = ''
            // bigComfirmAdd
        },
        uploadSuccess(res){
            this.uploadRes.key = res.key
            this.resultModal = true
            this.uploadRes.successCount = res.normalTotal
            this.uploadRes.failureCount = res.notChanegTotal+res.notExistTotal

            this.uploadRes.totalCount =this.uploadRes.successCount+this.uploadRes.failureCount
            this.uploadRes.failureResults = [
                ...Object.entries(res.notChaneg).map(v=>{
                    return {uid:v[0],reason:'状态无更改'}
                }),
                ...Object.entries(res.notExist).map(v=>{
                    return {uid:v[0],reason:'uid不存在'}
                })

            ]
        //   totalCount successCount  failureCount failureResults
                        // {uid: 2723, reason: "uid不存在"}

                    // {uid: 2724, reason: "uid不存在"}
            // @output="outputFail" :result="uploadRes" @cancel="cancelUpload" @confirm='confirmUpload'
        },
        init () {


        },
        async upload(url,param){
                const res = await this.$axios({
                    url,
                    data:param,
                    method:'post',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                })
                if(res.success){
                    this.uploadSuccess(res.data)
                }

        },
        async submit () {
            this.$refs['rule'].validate((valid) => {
                if (valid) {
                    if (this.obj.userState == 1) {
                        if(this.strict.indexOf(this.$t('提币'))>-1){
                            this.obj.coinStatus = 1
                        }else{
                            this.obj.coinStatus = 0
                        }
                        if(this.strict.indexOf(this.$t('提现'))>-1){
                            this.obj.cashStatus = 1
                        }else{
                            this.obj.cashStatus = 0
                        }
                    } else {
                        this.obj.coinStatus = 0
                        this.obj.cashStatus = 0
                    }
                    let reason = this.obj.reason ? '?reason=' + this.obj.reason : ''
                    let coinStatus = '&coinStatus=' + this.obj.coinStatus
                    let cashStatus = '&cashStatus=' + this.obj.cashStatus
                    const url = `v1/black/management/update/batch?${reason}${coinStatus}${cashStatus}`

                    let param = new window.FormData();
                    param.append('uploadfile', this.file)

                    this.upload(url,param)

                }
            });
        },
        arrToStr (arr) {
            if (arr.length === 0) return this.$t('无')
            let str = arr.join(',')
            return str
        },
        confirm () {
            this.showLog = false
        }
    }
}

</script>
<style lang="less" scope>
</style>
