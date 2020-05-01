<template>
    <div class="banner-manager">
        <Form ref="addDownloadFrom" enctype="multipart/form-data" :model="formItem" :rules="formRules" :label-width="120">

            <Form-item prop="title" :label="$t('下载标题')">
                <Input v-model="formItem.title" :placeholder="$t('下载标题')" />
            </Form-item>
            <Form-item prop="intro" :label="$t('下载简介')">
                <Input v-model="formItem.intro" :placeholder="$t('下载简介')" />
            </Form-item>
            <Form-item prop="appStoreUrl" :label="$t('App Store地址')">
                <Input v-model="formItem.appStoreUrl" :placeholder="$t('App Store地址')" />
            </Form-item>
            <Form-item prop="windowUrl" :label="$t('Windows地址')">
                <Input v-model="formItem.windowUrl" :placeholder="$t('Windows地址')" />
            </Form-item>
            <Form-item prop="androidUrl" :label="$t('Android地址')">
                <Input v-model="formItem.androidUrl" :placeholder="$t('Android地址')" />
            </Form-item>
            <Form-item prop="macUrl" :label="$t('Mac地址')">
                <Input v-model="formItem.macUrl" :placeholder="$t('Mac地址')" />
            </Form-item>

            <Form-item>
                <Button type="primary" :disabled="!formItem.title || !formItem.intro" @click="submitForm">
                    {{$t('提交')}}
                </Button>
                <Button type="primary" style="margin-left: 8px" @click="cancel">{{$t('取消')}}</Button>
            </Form-item>
        </Form>
    </div>
</template>

<script>
    import {operation} from '__util/api';

    export default {
        name: "downloadForm",
        props: {
            lang: String,
            formParams: Object
        },
        watch: {
            '$props': {
                handler: function (val, oldVal) {

                    if (this.formParams && parseInt(this.formParams.lang) === parseInt(this.lang)) {
                        this.formItem = {...this.formParams};
                    } else {
                        this.formItem = {
                            lang: this.lang,
                            title: '',
                            intro: '',
                            appStoreUrl: '',
                            windowUrl: '',
                            androidUrl: '',
                            macUrl: ''
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            submitForm() {
                this.$refs['addDownloadFrom'].validate((valid) => {
                    if (valid) {
                        const params = {...this.formItem};
                        params.lang = this.lang;
                        this.$emit('commit', params)
                    } else {
                        this.$Message.error(this.$t('表单验证不通过'));
                    }
                })
            },
            cancel() {
                this.$emit('cancel')
            }
        },
        data() {
            return {
                formRules: {
                    title: [
                        {required: true, message: this.$t('请填写标题'), trigger: 'blur'}
                    ],
                    intro: [
                        {required: true, message: this.$t('请填写描述'), trigger: 'blur'}
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
