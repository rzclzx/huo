<template>
    <div class="notice-manager">
        <Form ref="addBannerFrom" enctype="multipart/form-data" :model="formItem" :rules="formRules" :label-width="100">
            <Form-item prop="title" :label="$t('标题')">
                <Input v-model="formItem.title" :placeholder="$t('标题')" />
            </Form-item>
            <Form-item prop="isShow" :label="$t('是否显示')">
                <Select v-model="formItem.isShow" :placeholder="$t('请选择')" v-autoLocale>
                    <Option :value="1">{{$t('显示')}}</Option>
                    <Option :value="0">{{$t('不显示')}}</Option>
                </Select>
            </Form-item>
            <Form-item prop="thumb" style="display: none;">
                <Input v-model="formItem.thumb" :placeholder="$t('文件地址')" />
            </Form-item>
            <Form-item :label="$t('缩略图')">
                <FileUpload :file="formItem.thumb" v-on:error="uploadError" v-on:success="uploadSuccess"/>
            </Form-item>

            <Form-item prop="source" :label="$t('来源')">
                <Input v-model="formItem.source" :placeholder="$t('来源')" />
            </Form-item>

            <Form-item prop="sourceHref" :label="$t('来源链接')">
                <Input v-model="formItem.sourceHref" :placeholder="$t('来源链接')" />
            </Form-item>
            <Form-item prop="content" :label="$t('描述')">
                <!--<textarea class='tinymce-textarea' :id="`editor${this.lang}`"></textarea>-->
                <vue-editor :id="`editor${this.lang}`" v-model="formItem.content" useCustomImageHandler @imageAdded="handleImageAdded"/>
                <!--<tinymce :id="`editor${this.lang}`" v-model="formItem.content" :other_options="tinyOptions"></tinymce>-->
            </Form-item>
            <Form-item style="text-align: center;">
                <Button type="primary" :loading="loading" :disabled="!formItem.title" @click="submitForm">
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
    import tinymce from 'tinymce';
    import { VueEditor } from 'vue2-editor'
    import { sys } from '__util/api'
    export default {
        name: "noticeForm",
        props: {
            lang: String,
            formParams: Object,
            show: Boolean
        },
        components:{
            FileUpload,
            VueEditor
        },
        watch: {
            '$props': {
                handler: function (val, oldVal) {
                    // this.init();
                    // const tinymceDom = tinymce.get(`editor${this.lang}`);
                    if (this.formParams && parseInt(this.formParams.lang) === parseInt(this.lang)) {
                        this.formItem = {...this.formParams};
                        this.formItem = {
                            lang: this.lang,
                            title: this.formParams.title,
                            thumb: this.formParams.thumb,
                            isShow: this.formParams.isShow,
                            source: this.formParams.source,
                            sourceHref: this.formParams.sourceHref,
                            content: this.formParams.content || '',
                            catId: this.formParams.catId,
                            pv: this.formParams.pv,
                        }
                    } else {
                        this.formItem = {
                            lang: this.lang,
                            title: '',
                            thumb: null,
                            isShow: 1,
                            source: null,
                            sourceHref: null,
                            describe: '',
                            content: '',
                            catId: null,
                            pv: null,
                        }
                    }
                    // if(tinymceDom){
                    //     tinymceDom.setContent(this.formItem.content)
                    // }
                },
                deep: true
            }
        },
        methods: {
            // init () {
            //     this.$nextTick(() => {
            //         let vm = this;
            //         tinymce.init({
            //             selector: `#editor${vm.lang}`,
            //             branding: false,
            //             elementpath: false,
            //             language: 'zh_CN.GB2312',
            //             menubar: 'edit insert view format table tools',
            //             language_url:'/static/tinymce/langs/zh_CN.GB2312.js',
            //             skin_url: '/static/tinymce/skins/lightgray',
            //             theme_url: '/static/tinymce/themes/modern/theme.js',
            //             resize: false,
            //             toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            //             autosave_interval: '20s',
            //             image_advtab: true,
            //             table_default_styles: {
            //                 width: '100%',
            //                 borderCollapse: 'collapse'
            //             },
            //             setup: function (editor) {
            //                 editor.on('init', function (e) {
            //                     if (vm.formItem.content) {
            //                         tinymce.get(`editor${vm.lang}`).setContent(vm.formItem.content);
            //                     }
            //                 });
            //                 editor.on('keydown', function (e) {
            //                     setTimeout(function () {
            //                         vm.formItem.content = e.target.innerHTML;
            //                     },1)
            //                 });
            //             }
            //         });
            //     });
            // },

            uploadSuccess(res){
                this.formItem.thumb = res;
                this.loading = false;
            },
            uploadError(error){
                // this.formItem.file = null;
            },
            submitForm() {
                this.$refs['addBannerFrom'].validate((valid) => {
                    if (valid) {
                        const params = {...this.formItem};
                        params.lang = this.lang;
                        this.$emit('commit', params)
                    }
                })
            },
            cancel() {
                this.$emit('cancel')
            },
            handleImageAdded (file, Editor, cursorLocation) {
                let formData = new FormData();
                formData.append('file', file)
                sys.file.upload.data = formData
                this.$axios(sys.file.upload).then((res) => {
                    let url = res.data
                    Editor.insertEmbed(cursorLocation, 'image', url);
                })

            }
        },
        data() {
            return {
                loading:false,
                tinyOptions:{
                    language: 'zh_CN.GB2312',
                    language_url:'static/tinymce/langs/zh_CN.GB2312.js',
                    skin_url: 'static/tinymce/skins/lightgray',
                    theme_url: 'static/tinymce/themes/modern/theme.js',
                    resize: false,
                    // plugins: "preview",
                },
                formRules: {
                    title: [
                        {required: true, message: this.$t('请填写标题'), trigger: 'blur'}
                    ]
                },
                formItem: {}
            }
        }
    }
</script>

<style lang="less">
    .notice-manager {
        background-color: #ffffff;
        padding: 0 20px;
        form {
        }
    }
    .mce-notification-warning{
        display: none;
    }
    .select-style{
        display: block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 8px;
        padding-right: 24px;
    }
</style>
