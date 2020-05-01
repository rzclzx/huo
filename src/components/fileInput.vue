<template>
    <div>
        <Button class="btn-upload" type="ghost" @click="btnClick">
            <Icon type="ios-cloud-upload-outline"></Icon>
            <input type="file" ref="file" @change="changeFile"/>
            <span>{{ $t('上传文件') }}</span>
        </Button>
        <span class="file-name" ref="file-name">{{ fileName }}</span>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: "file-input",
        props:{
            disabled: Boolean
        },
        watch: {
        },
        methods:{
            // 改变文件
            changeFile () {
                let file = this.$refs['file'].files[0]
                this.fileName = file.name
                this.file = file
                this.$emit('change', file)
                this.loading = false
            },
            // 兼容问题（辣鸡某狐）
            btnClick () {
                if ( navigator.userAgent.indexOf("Firefox") > -1 ) {
                    this.$refs['file'].click()
                }
            },
            // 清除文件
            clear () {
                this.$refs['file'].value = ''
                this.fileName = ''
            }
        },
        data() {
            return {
                fileName: '',
                file: null,
                loading: false
            }
        }
    }
</script>

<style lang="less" scoped>
.btn-upload {
    position: relative;
    input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
    span {
        margin-left: 4px;
    }
}
.file-name {
    margin-left: 10px;
}
</style>
