<style lang="less" scope>
@import '../../../../assets/style/layout.less';
@import '../../../../assets/style/public.less';
</style>
<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <Form :model="obj" :rules="ruleItem" class="modal-form" ref="rule">
                        <FormItem :label="$t('用户黑名单')" prop="uids">
                            <Input v-model="obj.uids" type="textarea" :rows="5" :placeholder="$t('输入多个uid，中间用逗号隔开')"></Input>
                        </FormItem>
                        <FormItem :label="$t('备注文案')" prop="reason">
                            <Input v-model="obj.reason" type="textarea" :rows="3" :placeholder="$t('备注')"></Input>
                        </FormItem>
                        <Button type="primary" @click="submit">{{$t('保存')}}</Button>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Modal ref="modal" v-model="showLog" width="600">
            <h3 class="modal-title">{{$t('批量冻结')}}</h3>
            <div style="margin-top: 30px" class="flex-start-center">
                <div>{{$t('总条数')}}：</div>
                <div style="margin-right: 30px">{{ message.failL }}</div>
                <div>{{$t('成功条数')}}：</div>
                <div style="margin-right: 30px">{{ message.successL }}</div>
                <div>{{$t('失败条数')}}：</div>
                <div>{{ message.notL }}</div>
            </div>
            <div class="flex-start-center" style="margin-top: 30px">
                <div style="margin-right: 20px">{{$t('冻结成功')}}:</div>
                <div>{{ message.successUids }}</div>
            </div>
            <div class="flex-start-center" style="margin-top: 20px">
                <div style="margin-right: 20px">{{$t('用户不存在')}}:</div>
                <div>{{ message.notExistUids }}</div>
            </div>
            <div class="flex-start-center" style="margin-top: 20px">
                <div style="margin-right: 20px">{{$t('已在列表中')}}:</div>
                <div>{{ message.failUids }}</div>
            </div>
            <div slot="footer" style="border-top: 0">
                <Button @click="confirm" type="primary">{{$t('确定')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { limit } from '__util/api';
import handler from '__util/publicMethod';
export default {
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
            obj: {
                state: 1
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
            showLog: false
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {

        },
        submit () {
            this.$refs['rule'].validate((valid) => {
                if (valid) {
                    let obj = handler.clone(limit.black.freezeBlack)
                    obj.data = this.obj
                    this.$axios(obj).then(res => {
                        let obj = res.data || { successUids: [], notExistUids: [], failUids: [] }
                        this.message.successUids = this.arrToStr(obj.successUids)
                        this.message.notExistUids = this.arrToStr(obj.notExistUids)
                        this.message.failUids = this.arrToStr(obj.failUids)
                        this.message.failL = obj.failUids.length
                        this.message.notL = obj.notExistUids.length
                        this.message.successL = obj.successUids.length
                        this.showLog = true
                    })
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
