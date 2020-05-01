<template lang="html">
    <Row>
        <Row class="btn-group-row">
            <Button type="info" icon="gear-a" @click="remote" v-if="$store.state.user.checkPerm('sys:oss:saveConfig')">{{ $t('云存储配置') }}</Button>
            <Upload action="" :show-upload-list="false" :before-upload="fileUpload" v-if="$store.state.user.checkPerm('sys:oss:upload')">
                <Button type="primary" icon="plus">{{ $t('上传文件') }}</Button>
            </Upload>
            <Button type="primary" icon="trash-a" @click="del" v-if="$store.state.user.checkPerm('sys:oss:delete')">{{ $t('删除') }}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <Table :columns="columns" :data="dataList" @on-selection-change="selectChange" style="width: 100%;"></Table>
            <div class="page-pane">
                <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="getList" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.total + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Modal v-model="modal" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ $t('云存储配置') }}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="120">
                    <FormItem :label="$t('存储类型')" style="textAlign: left">
                        <RadioGroup v-model="formItem.type">
                            <Radio :label="1">{{ $t('七牛') }}</Radio>
                            <Radio :label="2">{{ $t('阿里云') }}</Radio>
                            <Radio :label="3">{{ $t('腾讯云') }}</Radio>
                            <Radio :label="4">{{ $t('亚马逊云') }}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <div v-show="formItem.type === 1">
                        <FormItem :label="$t('域名')">
                            <Input v-model="formItem.qiniuDomain" :placeholder="$t('七牛绑定的域名')"></Input>
                        </FormItem>
                        <FormItem :label="$t('路径前缀')">
                            <Input v-model="formItem.qiniuPrefix" :placeholder="$t('不设置默认为空')"></Input>
                        </FormItem>
                        <FormItem label="AccessKey">
                            <Input v-model="formItem.qiniuAccessKey" :placeholder="$t('七牛AccessKey')"></Input>
                        </FormItem>
                        <FormItem label="SecretKey">
                            <Input v-model="formItem.qiniuSecretKey" :placeholder="$t('七牛SecretKey')"></Input>
                        </FormItem>
                        <FormItem :label="$t('空间名')">
                            <Input v-model="formItem.qiniuBucketName" :placeholder="$t('七牛存储空间名')"></Input>
                        </FormItem>
                    </div>
                    <div v-show="formItem.type === 2">
                        <FormItem :label="$t('域名')">
                            <Input v-model="formItem.aliyunDomain" :placeholder="$t('阿里云绑定的域名')"></Input>
                        </FormItem>
                        <FormItem :label="$t('路径前缀')">
                            <Input v-model="formItem.aliyunPrefix" :placeholder="$t('不设置默认为空')"></Input>
                        </FormItem>
                        <FormItem label="EndPoint">
                            <Input v-model="formItem.aliyunEndPoint" :placeHolder="$t('阿里云EndPoint')"></Input>
                        </FormItem>
                        <FormItem label="AccessKeyId">
                            <Input v-model="formItem.aliyunAccessKeyId" :placeHolder="$t('阿里云AccessKeyId')"></Input>
                        </FormItem>
                        <FormItem label="AccessKeySecret">
                            <Input v-model="formItem.aliyunAccessKeySecret" :placeholder="$t('阿里云AccessKeySecret')"></Input>
                        </FormItem>
                        <FormItem label="BucketName">
                            <Input v-model="formItem.aliyunBucketName" :placeholder="$t('阿里云BucketName')"></Input>
                        </FormItem>
                    </div>
                    <div v-show="formItem.type === 3">
                        <FormItem :label="$t('域名')">
                            <Input v-model="formItem.qcloudDomain" :placeholder="$t('腾讯云绑定的域名')"></Input>
                        </FormItem>
                        <FormItem :label="$t('路径前缀')">
                            <Input v-model="formItem.qcloudPrefix" :placeholder="$t('不设置默认为空')"></Input>
                        </FormItem>
                        <FormItem label="AppId">
                            <Input v-model="formItem.qcloudAppId" :placeholder="$t('腾讯云AppId')"></Input>
                        </FormItem>
                        <FormItem label="SecretId">
                            <Input v-model="formItem.qcloudSecretId" :placeholder="$t('腾讯云SecretId')"></Input>
                        </FormItem>
                        <FormItem label="SecretKey">
                            <Input v-model="formItem.qcloudSecretKey" :placeholder="$t('腾讯云SecretKey')"></Input>
                        </FormItem>
                        <FormItem label="BucketName">
                            <Input v-model="formItem.qcloudBucketName" :placeholder="$t('腾讯云BucketName')"></Input>
                        </FormItem>
                        <FormItem :label="$t('Bucket所属地区')">
                            <Input v-model="formItem.qcloudRegion" :placeholder="$t('如：sh（可选值 ，华南：gz 华北：tj 华东：sh')"></Input>
                        </FormItem>
                    </div>
                    <div v-show="formItem.type === 4">
                        <FormItem :label="$t('域名')">
                            <Input v-model="formItem.awsDomain" :placeholder="$t('亚马逊云绑定的域名')"></Input>
                        </FormItem>
                        <FormItem :label="$t('路径前缀')">
                            <Input v-model="formItem.awsPrefix" :placeholder="$t('不设置默认为空')"></Input>
                        </FormItem>
                        <FormItem label="AccessKeyId">
                            <Input v-model="formItem.awsAccessKeyId" :placeholder="$t('亚马逊云AccessKeyId')"></Input>
                        </FormItem>
                        <FormItem label="SecretAccessKey">
                            <Input v-model="formItem.awsAccessKeyId" :placeHolder="$t('亚马逊云SecretAccessKey')"></Input>
                        </FormItem>
                        <FormItem label="BucketName">
                            <Input v-model="formItem.awsBucketName" :placeHolder="$t('亚马逊云BucketName')"></Input>
                        </FormItem>
                        <FormItem :label="$t('Bucket所属地区')">
                            <Input v-model="formItem.awsBucketName" :placeHolder="$t('如:cn-north-1（可选值,中国北部：cn-north-1 美国西部：us-west-1 美国东部：us-east-1）')"></Input>
                        </FormItem>
                    </div>

                </Form>
            </div>
            <div slot="footer" style="border-top: 0">
                <Button type="primary" @click="saveConfig">{{ $t('确定') }}</Button>
                <Button type="ghost" @click="modal = false">{{ $t('返回') }}</Button>
            </div>
        </Modal>
    </Row>
</template>

<script>
import { sys } from '__util/api'
export default {
    data () {
        return {
            formItem: {type: 1},
            modal: false,
            page: {
                currPage: 1,
                pageSize: 10,
                total: 1
            },
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'

                },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'

                },
                {
                    title: 'id',
                    width: 60,
                    key: 'id'
                },
                {
                    title: this.$t('URL地址'),
                    key: 'url'
                },
                {
                    title: this.$t('创建时间'),
                    width: 200,
                    key: 'createDate'
                }
            ],
            dataList: [{id: 'a', address: 'aaa', time: '时间'}],
            // 选中的文件
            checkedArr: []
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('sys:oss:list') ) {
            this.getList()
        }
    },
    created() {
        document.getElementsByTagName('body')['0'].className = 'l-del';
    },
    methods: {
        // 获取配置文件信息
        getConfig () {
            this.$axios(sys.file.getConfig).then((res) => {
                this.formItem = res.data
            })
        },
        // 获取文件列表
        getList (page) {
            this.checkedArr = []
            sys.file.getList.data = {
                page: page ? page : this.page.currPage,
                limit: this.page.pageSize
            }
            this.$axios(sys.file.getList).then((res) => {
                this.dataList = res.data.list
                this.page.currPage = res.data.currPage
                this.page.pageSize = res.data.pageSize
                this.page.total = res.data.totalCount
            })
        },
        // 删除文件
        delSub () {
            sys.file.delete.data = this.checkedArr.map((item) => {
                return item.id
            })

            this.$axios(sys.file.delete).then((res) => {
                this.$Message.success({content: this.$t('删除成功')})
                this.getList()
            })
        },
        // 保存配置文件文件
        saveConfig () {
            sys.file.saveConfig.data = this.formItem
            this.$axios(sys.file.saveConfig).then((res) => {
                this.modal = false
                this.$Message.success({content: this.$t('配置成功')})
            })
        },
        // 选择文件列表
        selectChange (checkedArr) {
            this.checkedArr = checkedArr
        },
        // 云存储配置
        remote () {
            this.modal = true
            this.getConfig()
        },
        // 上传文件
        fileUpload (file) {
            const form = new FormData()
            form.append('file', file)
            sys.file.upload.data = form
            this.$axios(sys.file.upload).then((res) => {
                this.$Message.success({content: this.$t('上传成功')})
                this.getList(1)
            })
            return false
        },
        // 删除
        del () {
            if ( this.checkedArr.length === 0 ) {
                this.$Message.error({content: this.$t('请选择文件')})
                return
            } else {
                this.$Modal.confirm({
                    title: this.$t('确认'),
                    content: this.$t('确定删除'),
                    onOk: this.delSub
                })
            }
        }
    }
}
</script>

<style lang="css">
</style>
