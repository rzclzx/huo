<template>
    <Upload ref="uploadFile"
            :action="action"
            with-credentials
            :accept="accept"
            :headers="header"
            :format="format"
            :max-size="5*1024"
            :before-upload = "beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :data="params"
            :default-file-list="fileList"
            :on-format-error="formatError"
            :name="name">
        <Button type="ghost" :loading="loading" :disabled="loading || disabled" icon="ios-cloud-upload-outline">{{ $t('上传文件') }}</Button>
    </Upload>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: "file-upload",
        props:{
            file:String,
            disabled: Boolean,
            format: {
                type: Array,
                default: function () {
                    return ['gif', 'jpg', 'png', 'bmp', 'jpeg']
                }
            },
            accept: {
                type: String,
                default: ''// 'image/*'
            },
            action: {
                type: String,
                default: '/v1/sys/oss/upload'
            },
            // 服务端接收文件 参数名
            name: {
                type: String,
                default: 'file'
            },
            // 其他上传参数
            params: Object
        },
        watch: {
            '$props.file': {
                handler: function (val, oldVal) {
                    const img = this.file;
                    if (img) {
                        this.fileList = [
                            {
                                name: img,
                                url: img
                            }
                        ];
                    } else {
                        if ( !val &&  oldVal) {
                            this.$refs['uploadFile'].clearFiles();
                        }
                    }
                    this.loading = false;
                },
                deep: true
            }
        },
        methods:{
            // 清楚上传文件
            clearFiles () {
                this.$refs['uploadFile'].clearFiles();
                this.loading = false;
            },
            beforeUpload(file){
                if(this.loading) {
                    return false;
                }
                this.$refs['uploadFile'].clearFiles();
                this.loading = true;
            },
            uploadSuccess(res, file){
                this.fileName = file.name;
                if(res.code === 'MGT00000'){
                    this.$emit('success', res.data)
                }else{
                    this.$Message.error(this.$t('文件上传失败'));
                }
                this.loading = false;
            },
            uploadError(error){
                this.$emit('error', error);
                this.loading = false;
            },
            // 格式验证错误
            formatError () {
                this.loading = false;
                this.$Modal.error({content: this.$t('请上传以下格式的文件：') + this.format});
            }
        },
        data() {
            return {
                header:{token:Cookies.get('token')},
                fileName:null,
                fileList:[],
                loading:false
            }
        }
    }
</script>

<style scoped>

</style>
