<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <Row>
        <Col>
            <Card>
                <p slot="title">
                    {{ title }}
                </p>
                <Form ref="rule" :model="obj" :rules="ruleItem" class="modal-form" :label-width="100" style="width: 600px">
                    <FormItem :label="$t('用户名')" prop="username">
                        <Input v-model="obj.username" type="text" :placeholder="$t('用户名')" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem v-if="!id" :label="$t('密码')" prop="password">
                        <Input v-model="obj.password" type="password" :placeholder="$t('密码')" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem v-if="!id" :label="$t('确认密码')" prop="confirmPassword">
                        <Input v-model="obj.confirmPassword" type="password" :placeholder="$t('确认密码')" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem :label="$t('所属部门')" prop="deptName">
                        <Input @on-focus="choiceModal" v-model="obj.deptName" type="text" :placeholder="$t('所属部门')"></Input>
                    </FormItem>
                    <FormItem :label="$t('邮箱')" prop="email">
                        <Input v-model="obj.email" type="text" :placeholder="$t('邮箱')"></Input>
                    </FormItem>
                    <FormItem :label="$t('手机号')" prop="mobile">
                        <Input v-model="obj.mobile" type="text" :placeholder="$t('手机号')"></Input>
                    </FormItem>
                    <FormItem :label="$t('角色')">
                        <CheckboxGroup v-model="obj.roleIdList">
                            <Checkbox v-for="i in roleList" :label="i.roleId" :key="i.roleId">{{ i.roleName }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem :label="$t('状态')">
                        <RadioGroup v-model="obj.status">
                            <Radio :label="0">
                                <span>{{$t('禁用')}}</span>
                            </Radio>
                            <Radio :label="1">
                                <span>{{$t('正常')}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <div class="flex-end-center">
                        <Button type="primary" style="margin-right: 10px" @click="submit">{{$t('确定')}}</Button>
                        <Button @click="cancel">{{$t('返回')}}</Button>
                    </div>
                </Form>
            </Card>
        </Col>
        <myTree  :show="show"
                 :list="modalList"
                 :id="'deptId'"
                 :title="$t('选择部门')"
                 @message="onMessage"
        ></myTree>
    </Row>
</template>
<script>
import util from '__util/util';
import { sys } from '__util/api';
import handler from '__util/publicMethod';
import myTree from '__components/my-tree';
export default {
    data () {
        // 用户名校验
        const userCheck = (rule, value, callback) => {
            if ( ( /^[a-zA-Z0-9]{1,20}$/.test(value) ) ) {
                callback()
            } else {
                callback(new Error(this.$t('请输入英文、数字，且不超过20个字符')))
            }
        }
        // 手机号校验
        const mobileCheck = (rule, value, callback) => {
            if ( ( /^[0-9]{1,11}$/.test(value) ) ) {
                callback()
            } else {
                callback(new Error(this.$t('请输入正确的手机号')))
            }
        }
        return {
            title: this.$t('新增'),
            id: undefined,
            obj: {
                status: 0
            },
            roleList: [],
            show: false,
            modalList: [],
            ruleItem: {
                username: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    },
                    {
                        validator: userCheck,
                        trigger: 'blur'
                    }
                ],
                deptName: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: this.$t('邮箱格式错误'),
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    },
                    {
                        validator: mobileCheck,
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    }
                ],
                confirmPassword: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    components: {
        myTree
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.id = this.$route.params.id
            this.$axios(sys.user.roleSelect).then(res => {
                this.roleList = res.data
            })
            this.$axios(sys.user.deptList).then(res => {
                this.modalList = res.data
            })
            if (this.id === undefined) {
                this.create()
            } else {
                this.update()
            }
        },
        create () {
            this.title = this.$t('新增')
        },
        update () {
            this.title = this.$t('编辑')
            let obj = handler.clone(sys.user.userInfo)
            obj.url = obj.url + '/' + this.id
            this.$axios(obj).then(res => {
                this.obj = res.data || {}
                this.obj.mobile = this.obj.mobile + ''
            })
        },
        submit () {
            this.$refs['rule'].validate((valid) => {
                if (valid) {
                    let obj
                    if (this.id === undefined) {
                        if (this.obj.password !== this.obj.confirmPassword) {
                            this.$Message.error(this.$t('密码不一致，请重新输入'))
                            return
                        }
                        obj = handler.clone(sys.user.userSave)
                        obj.data = handler.clone(this.obj)
                        obj.data.password = util.md5(obj.data.password)
                        obj.data.confirmPassword = util.md5(obj.data.confirmPassword)
                    } else {
                        obj = handler.clone(sys.user.userUpdate)
                        obj.data = handler.clone(this.obj)
                        obj.data.userId = this.id
                    }
                    this.$axios(obj).then(res => {
                        this.$router.push('/sysUser')
                    })
                }
            });
        },
        cancel () {
            this.$router.push('/sysUser')
        },
        choiceModal () {
            this.show = true
        },
        onMessage (obj) {
            this.show = obj.isShow
            if (obj.data) {
                this.obj.deptId = obj.data.deptId
                this.obj.deptName = obj.data.title
            }
        }
    }
}

</script>
