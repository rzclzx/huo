<template>
    <div class="banner-manager">
        <Form ref="addBannerFrom" enctype="multipart/form-data" :model="formItem" :rules="formRules" :label-width="100">
            <Form-item prop="adName" :label="$t('名称')">
                <Input v-model="formItem.adName" :placeholder="$t('名称')" />
            </Form-item>
            <Form-item prop="img" style="display: none;">
                <Input v-model="formItem.img" :placeholder="$t('文件地址')" />
            </Form-item>
            <Form-item required :label="$t('上传图片')">
                <FileUpload :file="formItem.img" v-on:error="uploadError" v-on:success="uploadSuccess"></FileUpload>
            </Form-item>

            <Form-item prop="url" :label="$t('链接')">
                <Input v-model="formItem.url" :placeholder="$t('链接')" />
            </Form-item>
            <Form-item prop="order" :label="$t('排序')">
                <Input-number :max="999" :min="0" v-model="formItem.order" :placeholder="$t('数值越大越靠前且不大于三位数')"></Input-number>
            </Form-item>
            <Form-item prop="status" :label="$t('状态')">
                <Select v-model="formItem.status" :placeholder="$t('请选择')" v-autoLocale>
                    <Option value="1">{{$t('正常')}}</Option>
                    <Option value="0">{{$t('禁用')}}</Option>
                </Select>
            </Form-item>
            <Form-item prop="isShow" :label="$t('是否显示')">
                <Select v-model="formItem.isShow" :placeholder="$t('请选择')" v-autoLocale>
                    <Option value="1">{{$t('显示')}}</Option>
                    <Option value="0">{{$t('不显示')}}</Option>
                </Select>
            </Form-item>
            <Form-item prop="isClosable" :label="$t('是否可关闭')">
                <Select v-model="formItem.isClosable" :placeholder="$t('请选择')" v-autoLocale>
                    <Option value="1">{{$t('关闭')}}</Option>
                    <Option value="0">{{$t('不关闭')}}</Option>
                </Select>
            </Form-item>
            <Form-item prop="isNeedLogin" :label="$t('是否需要登录')">
                <Select v-model="formItem.isNeedLogin" :placeholder="$t('请选择')" v-autoLocale>
                    <Option value="1">{{$t('是')}}</Option>
                    <Option value="0">{{$t('否')}}</Option>
                </Select>
            </Form-item>
            <Form-item prop="s_beginTime" :label="$t('开始时间')">
                <Date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placement="right" @on-change="changeBeginDate" :placeholder="$t('开始时间')" v-model="s_beginTime"></Date-picker>
            </Form-item>
            <Form-item prop="s_endTime" :label="$t('结束时间')">
                <Date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placement="right" @on-change="changeEndDate" :placeholder="$t('结束时间')" v-model="s_endTime"></Date-picker>
            </Form-item>
            <Form-item prop="title" :label="$t('标题')">
                <Input v-model="formItem.title" :placeholder="$t('标题')" />
            </Form-item>
            <Form-item prop="describe" :label="$t('描述')">
                <Input v-model="formItem.describe" :placeholder="$t('描述')" />
            </Form-item>
            <Form-item>
                <Button type="primary" :disabled="!formItem.title ||!this.s_beginTime || !this.s_endTime || this.s_beginTime > this.s_endTime" @click="submitForm">
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
                        this.formItem.status = this.formItem.status ? this.formItem.status.toString() : null;
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
            },
            uploadError(error){
                // this.formItem.file = null;
            },
            changeBeginDate(e) {
                this.formItem.s_beginTime = e;
            },
            changeEndDate(e) {
                this.formItem.s_endTime = e;
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
                formItem: {}
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
</style>
