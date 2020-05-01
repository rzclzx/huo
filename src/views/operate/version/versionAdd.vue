<template lang="html">
    <Form :model="formItem" :label-width="100" ref="versionEdit" :rules="rules">
        <FormItem prop="version" :label="$t('版本号')">
            <Input v-model="formItem.version" :placeholder="$t('格式为X.X.X')" :disabled="disableds"></Input>
        </FormItem>
        <FormItem prop="intVersion" :label="$t('整型版本码')">
            <Input v-model="formItem.intVersion" :placeholder="$t('正整数、纯数字')" :disabled="disableds"></Input>
        </FormItem>
        <FormItem prop="minSupportVersion" :label="$t('最低支持整型版本码')">
            <Input v-model="formItem.minSupportVersion" :placeholder="$t('低于此整型版本码的客户端强制升级')" :disabled="disableds"></Input>
        </FormItem>
        <FormItem prop="remindNum" :label="$t('当日提醒次数')">
            <Input v-model="formItem.remindNum" :placeholder="$t('')" :disabled="disableds"></Input>
        </FormItem>
        <FormItem prop="updateType" :label="$t('发版方式')">
          <RadioGroup v-model="formItem.updateType">
              <Radio label="1" :disabled="disableds">{{ $t('强制升级') }}</Radio>
              <Radio label="2" :disabled="disableds">{{ $t('非强制升级') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="system" :label="$t('系统')">
          <RadioGroup v-model="formItem.system">
              <Radio label="2" :disabled="disableds">{{ $t('IOS') }}</Radio>
              <Radio label="1" :disabled="disableds">{{ $t('Android') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="onlineTime" :label="$t('发版时间')">
            <DatePicker v-model="formItem.onlineTime" transfer type="datetime" format="yyyy-MM-ddTHH:mm:ssZZ" :placeholder="$t('')" style="width: 100%" :disabled="disableds"></DatePicker>
        </FormItem>
        <FormItem prop="title" :label="$t('升级提示标题')">
            <Tabs size="small">
                <TabPane :label="$t('本地语言')">
                    <Input v-model="formItem.title['loc-LAN']" placeholder=""  :disabled="disableds"></Input>
                </TabPane>
                <TabPane :label="$t('中文')">
                    <Input v-model="formItem.title['zh-CN']" placeholder=""  :disabled="disableds"></Input>
                </TabPane>
                <TabPane :label="$t('英文')">
                    <Input v-model="formItem.title['en-US']" placeholder=""  :disabled="disableds"></Input>
                </TabPane>
            </Tabs>
        </FormItem>
        <FormItem prop="label" :label="$t('升级提示文案')">
            <Tabs size="small">
                <TabPane :label="$t('本地语言')">
                    <Input v-model="formItem.label['loc-LAN']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="disableds"></Input>
                </TabPane>
                <TabPane :label="$t('中文')">
                    <Input v-model="formItem.label['zh-CN']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="disableds"></Input>
                </TabPane>
                <TabPane :label="$t('英文')">
                    <Input v-model="formItem.label['en-US']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" :disabled="disableds"></Input>
                </TabPane>
            </Tabs>
        </FormItem>
        <FormItem prop="uploadAdress" :label="$t('安装包链接')">
            <Input v-model="formItem.uploadAdress" :placeholder="$t('')" :disabled="disableds"></Input>
        </FormItem>
        <FormItem prop="value" style="textAlign: center">
            <Button type="ghost" @click="cancel" style="margin-right: 40px">{{ $t('取消') }}</Button>
            <Button type="primary" @click="save">{{ $t('确定') }}</Button>
        </FormItem>
    </Form>
</template>

<script>
import { operation } from '__util/api'

export default {
    data () {
        // 版本号
        const versionCheck = (rule, value, callback) => {
            if ( /^[0-9]+.[0-9]+.[0-9]+$/.test(value) && parseInt(value) >= 0 && value.length <= 20) {
                callback()
            } else {
                callback(new Error(this.$t('请输入格式为X.X.X的版本号，并且长度不能超过20')))
            }
        }
        // 正整数
        const intCheck = (rule, value, callback) => {
            if ( /^[0-9]+$/.test(value) && parseInt(value) >= 0 ) {
                callback()
            } else {
                callback(new Error(this.$t('请输入正整数')))
            }
        }
        // 整型版本码长度
        const intVersion = (rule, value, callback) => {
            if ( value.length <= 5 ) {
                callback()
            } else {
                callback(new Error(this.$t('整型版本码长度不能超过5')))
            }
        }
        // 提醒次数长度
        const remindLength = (rule, value, callback) => {
            if ( value.length < 11 ) {
                callback()
            } else {
                callback(new Error(this.$t('提醒次数长度不能超过11')))
            }
        }
        // 标题不为空
        const spaceTitle = (rule, value, callback) => {
            if ( this.formItem.title['loc-LAN'] || this.formItem.title['zh-CN'] || this.formItem.title['en-US'] ) {
                callback()
            } else {
                callback(new Error(this.$t('标题至少有一项不能为空')))
            }
        }
        // 内容不为空
        const spaceContent = (rule, value, callback) => {
            if ( this.formItem.label['loc-LAN'] || this.formItem.label['zh-CN'] || this.formItem.label['en-US'] ) {
                callback()
            } else {
                callback(new Error(this.$t('内容至少有一项不能为空')))
            }
        }
        return {
            formItem: {
              updateType: '1',
              system: '2',
              title: {},
              label: {}
            },
            id: '',
            disableds: false,
            rules: {
                version: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { validator: versionCheck, trigger: 'blur' }
                ],
                intVersion: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' },
                    { validator: intVersion, trigger: 'blur' }
                ],
                minSupportVersion: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' },
                    { validator: intVersion, trigger: 'blur' }
                ],
                remindNum: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { validator: intCheck, trigger: 'blur' },
                    { validator: remindLength, trigger: 'blur' }
                ],
                updateType: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' }
                ],
                system: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' }
                ],
                onlineTime: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' }
                ],
                title: [
                    { validator: spaceTitle, trigger: 'blur' }
                ],
                label: [
                    { validator: spaceContent, trigger: 'blur' }
                ]
            }
        }
    },
    mounted () {
        // if ( this.$store.state.user.checkPerm('pro:settings:currency:statusCount') ) {

        // }
    },
    props: ['dialogtype'],
    methods: {
        initForm () {
            this.formItem = {
              updateType: '1',
              system: '2',
              title: {},
              label: {}
            }
            this.disableds = false
            this.$refs.versionEdit.resetFields()
        },
        cancel () {
            this.$emit('close')
        },
        save () {
            this.formItem.remindNum = this.formItem.remindNum.toString()
            this.formItem.updateType = this.formItem.updateType.toString()
            this.formItem.onlineTime = this.$moment(this.formItem.onlineTime).format('YYYY-MM-DD HH:mm:ss')
            this.$refs['versionEdit'].validate((valid) => {
                if (valid) {
                    if (this.dialogtype === 'add') {
                        this.addVersion()
                    } else if (this.dialogtype === 'updata') {
                        this.updataVersion()
                    } else if (this.dialogtype === 'look') {
                      this.$emit('close', true)
                    }
                } else {
                    this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
        },
        // 查看/修改版本信息
        getVersionMsg (id, status) {
            if ( !id ) return
            if (status == 2) {
              this.disableds = true
            } else {
              this.disableds = false
            }
            this.id = id
            this.$refs.versionEdit.resetFields()
            operation.getVersionMsg.path = {
                id: id
            }
            this.$axios(operation.getVersionMsg).then((res) => {
                this.formItem = res.data
                this.formItem.remindNum = this.formItem.remindNum.toString()
                this.formItem.updateType = this.formItem.updateType.toString()
                this.formItem.onlineTime = this.$moment(this.formItem.onlineTime).format('YYYY-MM-DD HH:mm:ss')
                this.formItem.title = JSON.parse(this.formItem.title)
                this.formItem.label = JSON.parse(this.formItem.label)
                console.log(this.formItem);
            })

        },
        // 修改版本
        updataVersion () {
          operation.updateVersion.data = {...this.formItem}
          operation.updateVersion.data.onlineTime = this.$moment(this.formItem.onlineTime).format('YYYY-MM-DD HH:mm:ss')
          operation.updateVersion.data.title = JSON.stringify(this.formItem.title)
          operation.updateVersion.data.label = JSON.stringify(this.formItem.label)
          this.$axios(operation.updateVersion).then((res) => {
                this.$Message.success({content: this.$t('修改成功')})
                this.$emit('brash', true)
                this.$emit('close', true)
          })
        },
        // 添加版本
        addVersion () {
          operation.addVersion.data = {...this.formItem}
          operation.addVersion.data.onlineTime = this.$moment(this.formItem.onlineTime).format('YYYY-MM-DD HH:mm:ss')
          operation.addVersion.data.title = JSON.stringify(this.formItem.title)
          operation.addVersion.data.label = JSON.stringify(this.formItem.label)
          this.$axios(operation.addVersion).then((res) => {
                this.$Message.success({content: this.$t('添加成功')})
                this.$emit('brash', true)
                this.$emit('close', true)
          })
        }
    },
}
</script>

<style>
</style>
