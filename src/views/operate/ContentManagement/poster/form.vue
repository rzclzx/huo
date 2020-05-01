<template>
    <div class="banner-manager">
        <Form ref="addBannerFrom" enctype="multipart/form-data" :model="formItem" :rules="formRules" :label-width="100">
            <Form-item prop="adName" :label="$t('海报名称')">
                <Input v-model="formItem.adName" :placeholder="$t('名称')" />
            </Form-item>
            <Form-item required :label="$t('上传图片')">
                <FileUpload action="/v1/content/poster/upload" ref="fileUpload" :params="{type: 7}" :file="formItem.img" v-on:error="uploadError" v-on:success="uploadSuccess"></FileUpload>
                <div class="desc">
                    {{ $t('上传尺寸470*840，支持PNG、JPG、JEPG、GIF格式，大小限制在2M内') }}
                </div>
            </Form-item>
            <Form-item prop="status" :label="$t('状态')">
                <Select v-model="formItem.status" :placeholder="$t('请选择')" v-autoLocale>
                    <Option :value="1">{{$t('上线')}}</Option>
                    <Option :value="0">{{$t('poster["下线"]')}}</Option>
                </Select>
            </Form-item>
            <Form-item prop="order" :label="$t('排序')">
                <Input-number :max="999" :min="0" v-model="formItem.order" :placeholder="$t('数值越大越靠前且不大于三位数')"></Input-number>
            </Form-item>
            <Form-item>
                <Button type="primary" :disabled="!formItem.adName || !formItem.img" @click="submitForm">
                    {{$t('提交')}}
                </Button>
                <Button type="primary" style="margin-left: 8px" @click="cancel">{{$t('取消')}}</Button>
            </Form-item>
        </Form>
    </div>
</template>

<script>
    import {operation} from '__util/api';
    import FileUpload from '@/components/fileUpload'

    export default {
        name: "bannerForm",
        props: {
            lang: String,
            formParams: Object,
            show: Boolean
        },
        components:{
            FileUpload
        },
        watch: {
            '$props': {
                handler: function (val, oldVal) {
                    if (this.formParams && parseInt(this.formParams.lang) === parseInt(this.lang)) {
                        this.formItem = {...this.formParams};
                        this.formItem.status = this.formItem.status
                        this.formItem.isShow = this.formItem.isShow ? this.formItem.isShow.toString() : null;
                        this.formItem.isClosable = this.formItem.isClosable ? this.formItem.isClosable.toString() : null;
                        this.formItem.isNeedLogin = this.formItem.isNeedLogin ? this.formItem.isNeedLogin.toString(): null;
                        this.formItem.img = this.formParams.img;
                        this.s_beginTime = new Date(this.formItem.beginTime);
                        this.s_endTime = new Date(this.formItem.endTime);
                        this.formItem.s_beginTime = this.formItem.beginTime;
                        this.formItem.s_endTime = this.formItem.endTime;
                    } else {
                        this.s_beginTime = null;
                        this.s_endTime = null;
                        this.formItem = {
                            lang: this.lang,
                            adName: '',
                            title: '',
                            url: '',
                            img: '',
                            status: null,
                            describe: '',
                            isShow: null,
                            isClosable: null,
                            isNeedLogin: null,
                            s_beginTime: null,
                            s_endTime: null,
                            order: 0
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            uploadSuccess(res){
                this.formItem.img = res;
                this.loading = false;
                this.disabledBt = false
            },
            uploadError(error){
                // this.formItem.file = null;
            },
            // 清楚已上传文件
            clearFiles () {
                this.$refs['fileUpload'].clearFiles()
            },
            submitForm() {
                this.$refs['addBannerFrom'].validate((valid) => {
                    if (valid && this.formItem.img) {
                        const params = {...this.formItem};
                        params.lang = this.lang;
                        this.$emit('commit', params);
                    } else {
                        const errText = this.$t('请选择上传的图片');
                        this.$Message.error(errText);
                    }
                })
            },
            cancel() {
                this.$emit('cancel')
            }
        },
        data() {
            return {
                s_beginTime: null,
                s_endTime: null,
                formRules: {
                    adName: [
                        {required: true, message: this.$t('请填写名称'), trigger: 'blur'}
                    ],
                    s_beginTime: [
                        {required: true, message: this.$t('请填写开始时间'), trigger: 'blur'}
                    ],
                    s_endTime: [
                        {required: true, message: this.$t('请填写结束时间'), trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: this.$t('请填写标题'), trigger: 'blur'}
                    ],
                },
                formItem: {img: ''},
                disabledBt: false
            }
        }
    }
</script>

<style lang="less">
    .banner-manager {
        background-color: #ffffff;
        padding: 0 20px;
        form {
            width: 400px;
        }
    }
    .desc {
        color: #7F8FA4;
    }
</style>
