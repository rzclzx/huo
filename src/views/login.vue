<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="logo"></div>
        <div class="login-con">
            <div class="login-pane">
                <div class="form-con">
                    <Form ref="loginForm" :model="form" label-position="top" :rules="rules">
                        <FormItem prop="username" :label="$t('用户名')">
                            <Input v-model="form.username" class="login-input" :placeholder="$t('请输入用户名')">
                            </Input>
                        </FormItem>
                        <FormItem prop="password" :label="$t('密码')">
                            <Input type="password" v-model="form.password" class="login-input" :placeholder="$t('请输入密码')">
                            </Input>
                        </FormItem>
                        <FormItem prop="captcha" :label="$t('谷歌验证码')">
                            <Input type="text" v-model="form.captcha" class="login-input" :placeholder="$t('谷歌验证码，首次登录可不填')">
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" class="login-btn" :class="{'disabled': !form.username && !form.password && !form.captcha}" type="primary" long>{{$t('登录')}}</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
        <Modal v-model="show" width="600" @on-ok="submit" @on-cancel="cancel" :loading="loading">
            <h3 class="modal-title">{{$t('修改密码')}}</h3>
            <Form :model="obj" :rules="ruleItem" class="modal-form" ref="rule" :label-width="100">
                <FormItem :label="$t('旧密码')" prop="password">
                    <Input type="password" v-model="obj.password"></Input>
                </FormItem>
                <FormItem :label="$t('新密码')" prop="newPassword">
                    <Input type="password" v-model="obj.newPassword" :placeholder="$t('密码不能为空，且包括大小写，8-15位')"></Input>
                </FormItem>
                <FormItem :label="$t('新密码确认')" prop="reNewPassword">
                    <Input type="password" v-model="obj.reNewPassword"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="showG" width="600" @on-ok="gaCheck" @on-cancel="gaCancel" :ok-text="$t('绑定谷歌验证码')" :mask-closable="false" :loading="bLoading">
            <h3 class="modal-title" style="margin-bottom: 30px">{{$t('绑定谷歌验证码')}}</h3>
            <div style="text-align: center;margin-top: 30px">{{$t('扫描下方二维码')}}</div>
            <div style="text-align: center">
                <img :src="gaUrl" />
            </div>
            <div style="text-align: center">{{$t('手动绑定地址')}}：{{ secret }}</div>
            <Form :model="bind" :rules="bindRule" class="modal-form" ref="bindRule" :label-width="100">
                <FormItem :label="$t('谷歌验证码')" prop="code">
                    <Input type="text" v-model="bind.code"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import crypto from 'crypto';
import { login, sys } from '__util/api';
import handler from '__util/publicMethod';
import Cookies from 'js-cookie';
import { refresh } from '__util/axios';
import util from '../assets/util/util';
export default {
    name: 'login',
    data () {
        return {
            form: {
                // username:'admin',
                // password:'Huobi123',
                // captcha:'123456'
            },
            password:'',
            rules: {
                username: [
                    { required: true, message: this.$t('账号不能为空'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('密码不能为空'), trigger: 'blur' }
                ]
            },
            show: false,
            obj: {},
            loading: true,
            ruleItem: {
                password: [
                    { required: true, message: this.$t('密码不能为空'), trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, pattern:/^(?![^a-z]+$)(?![^A-Z]+$)(?!\\D+$).{8,15}$/, message: this.$t('密码不能为空，且包括大小写，8-15位'), trigger: 'blur' }
                ],
                reNewPassword: [
                    { required: true,pattern:/^(?![^a-z]+$)(?![^A-Z]+$)(?!\\D+$).{8,15}$/, message: this.$t('密码不能为空，且包括大小写，8-15位'), trigger: 'blur' }
                ]
            },
            bindRule: {
                code: [
                    { pattern: /^\d{6}$/, message: this.$t('谷歌验证必须位6位数字'), trigger: 'blur' }
                ]
            },
            showG: false,
            gaUrl: '',
            secret: '',
            bind: {
                code: '',
                secret: ''
            },
            bLoading: true
        };
    },
    methods: {

        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                // Cookies.set('user', this.form.username);
                // this.$router.push('/userSearch')
                // 登陆
                if (valid) {
                    let obj = handler.clone(login.login)
                    obj.data = {...this.form}
                    obj.data.password = util.md5(this.form.password);
                    this.$axios(obj).then(res => {
                        if (res.code === 'MGT00136') {
                            let token = res.data && res.data.token
                            Cookies.set('token', token);
                            refresh(Cookies.get('token'))
                            this.show = true
                        } else if (res.code === 'MGT00135') {
                            let token = res.data && res.data.token
                            Cookies.set('token', token);
                            refresh(Cookies.get('token'))
                            this.bindG()
                        } else {
                            let token = res.data && res.data.token
                            Cookies.set('token', token);
                            refresh(Cookies.get('token'))
                            this.getMenu()
                        }
                    })
                }
            });
        },
        // 获取权限
        getMenu () {
            let obj = handler.clone(sys.menu.menuUser)
            this.$axios(obj).then(res => {
                Cookies.set('user', this.form.username);
                localStorage.userData = JSON.stringify(res.data)
                this.$router.push('/home')
            })
        },
        submit () {
            this.$refs.rule.validate((valid) => {
                if (valid) {
                    // 首次登陆弹出框修改密码确定
                    let obj = handler.clone(login.loginInit)
                    obj.data = {...this.obj}
                    obj.data.username = this.form.username;
                    obj.data.password = util.md5(obj.data.password);
                    obj.data.newPassword = util.md5(obj.data.newPassword);
                    obj.data.reNewPassword = util.md5(obj.data.reNewPassword);

                    this.$axios(obj).then(res => {
                        this.show = false
                        this.$Modal.success({
                            content: this.$t('修改成功')
                        })
                    }).catch(() => {
                        this.loading = false
                        setTimeout(() => {
                            this.loading = true
                        }, 0)
                    })
                } else {
                    this.loading = false
                    setTimeout(() => {
                        this.loading = true
                    }, 0)
                }
            });

        },
        cancel () {
            this.$refs.rule.resetFields()
        },
        bindG () {
            let obj = login.bindGa
            this.$axios(obj).then(res => {
                this.gaUrl = res.data.url
                this.secret = res.data.secret
                this.bind.secret = this.secret
                this.showG = true
            })
        },
        gaCheck () {
            this.$refs.bindRule.validate((valid) => {
                if (valid) {
                    let obj = handler.clone(login.checkGa)
                    obj.data = this.bind
                    this.$axios(obj).then(res => {
                        this.showG = false
                        this.$Modal.success({
                            content: this.$t('绑定成功')
                        })
                    }).catch(() => {
                        this.bLoading = false
                        setTimeout(() => {
                            this.bLoading = true
                        }, 0)
                    })
                } else {
                    this.bLoading = false
                    setTimeout(() => {
                        this.bLoading = true
                    }, 0)
                }
            });
        },
        gaCancel () {
            this.$refs.bindRule.resetFields()
        }
    }
};
</script>

<style>

</style>
