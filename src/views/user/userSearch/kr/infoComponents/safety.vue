<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('认证信息')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('安全认证')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table1Date"
                            :columns="table1Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px">
            <Card class="dis-select">
                <p slot="title">
                    {{$t('账户所属站点')}}
                </p>
                <Table  refs="table0"
                        :no-data-text="$t('暂无数据')"
                        :data="tableDatePro"
                        :columns="colsPro"
                ></Table>
            </Card>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <Tabs :value="id">
                        <TabPane v-if="$store.state.user.checkPerm('user:mgt:query:security:history:operat')" :label="$t('操作历史')" name="0">
                            <Table  :data="table2Date"
                                    :no-data-text="$t('暂无数据')"
                                    :columns="table2Column"
                            ></Table>
                            <Row style="margin-top: 10px">
                                <Col span="24">
                                    <div class="flex-end-center">
                                        <Button @click="pre1" :disabled="prevOffset1 === -1" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                                        <Button @click="next1" :disabled="nextOffset1 === -1" type="primary">{{$t('下一页')}}</Button>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane v-if="$store.state.user.checkPerm('user:mgt:query:security:history:login')" :label="$t('登陆历史')" name="1">
                            <Table  :data="table3Date"
                                    :no-data-text="$t('暂无数据')"
                                    :columns="table3Column"
                            ></Table>
                            <Row style="margin-top: 10px">
                                <Col span="24">
                                    <div class="flex-end-center">
                                        <Button @click="pre2" :disabled="prevOffset2 === -1" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                                        <Button @click="next2" :disabled="nextOffset2 === -1" type="primary">{{$t('下一页')}}</Button>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>
            </Col>
        </Row>
        <Modal v-model="showGa" :mask-closable="false" width="600" class-name="modal-clear-line">
            <h3 class="modal-title" v-if="nextSuccess">{{ rebindType === 'phone' ? $t('换绑用户手机') : $t('换绑用户GA') }}</h3>
            <h3 class="modal-title" v-else>{{$t('请输入谷歌验证码')}}</h3>
            <div style="margin-top: 20px;font-size: 16px;" v-if="nextSuccess">
                <p>{{ $t('请将以下换绑链接发给用户') }}</p>
                <p style="margin-top: 20px">
                    <div class="">{{ $t('换绑链接') }}：</div>
                    <Input v-model="bindLink" style="margin-top: 10px" id="copyLink" readonly>
                        <span slot="append" style="cursor: pointer" @click="copyLink">{{ $t('复制') }}</span>
                    </Input>
                </p>
            </div>
            <p style="margin-top: 20px">{{ $t('userInfo.safety["请输入"]') }}<span>{{ userName }}</span>{{ $t('userInfo.safety["的谷歌验证码"]') }}</p>
            <Form class="modal-form" ref="modal" style="margin-top: 20px" v-if="!nextSuccess">
                <FormItem>
                    <Input v-model="gaCode" type="text" :placeholder="$t('')"></Input>
                </FormItem>
            </Form>
            <div class="text-center" style="text-align:center" v-if="!nextSuccess">
                <Button type="primary" @click="gaNext">{{ $t('下一步') }}</Button>
            </div>
            <div slot="footer" style="border-top: 0"></div>
        </Modal>
        <Modal v-model="showUnbund" :mask-closable="false" width="600" class-name="modal-clear-line">
            <div class="" v-if="!nextSuccess">
                <h3 class="modal-title">{{$t('请输入谷歌验证码')}}</h3>
                <p style="margin-top: 20px">{{ $t('userInfo.safety["请输入"]') }}<span>{{ userName }}</span>{{ $t('userInfo.safety["的谷歌验证码"]') }}</p>
                <Form class="modal-form" ref="modal" style="margin-top: 20px">
                    <FormItem>
                        <Input v-model="gaCode" type="text" :placeholder="$t('')"></Input>
                    </FormItem>
                </Form>
                <div class="text-center" style="text-align:center">
                    <Button type="primary" @click="gaNext('email')">{{ $t('下一步') }}</Button>
                </div>
            </div>
            <div class="" v-else>
                <h3 class="modal-title">{{$t('注销用户账户')}}</h3>
                <h3 style="text-align: center; margin-top: 20px;">{{$t('确定要注销用户账户')}}?</h3>
                <h3 style="text-align: center;">{{$t('注销后不可撤回')}}</h3>
                <div class="text-center" style="text-align:center; margin-top: 20px">
                    <Button type="primary" style="margin-right: 20px;" @click="showUnbund = false">{{ $t('取消') }}</Button>
                    <Button type="primary" @click="subUnbind">{{ $t('确定') }}</Button>
                </div>
            </div>
            <div slot="footer" style="border-top: 0"></div>
        </Modal>
        <!--<Modal v-model="showLog" width="800" @on-ok="submit">
            <h3 class="modal-title">{{ logTitle }}</h3>
            <Table style="margin-top: 30px" refs="table0"
                    :no-data-text="$t('暂无数据')"
                    :data="table4Date"
                    :columns="table4Column"
            ></Table>
        </Modal>!-->
        <!--<Modal v-model="showSet" width="800" @on-ok="submit">
            <h3 class="modal-title">{{$t('最大额度设置')}}</h3>
            <Form :model="obj" class="modal-form" ref="rule">
                <FormItem :label="$t('最大提现BTC')">
                    <Input v-model="obj.uids" :placeholder="$t('0则不生效')"></Input>
                </FormItem>
                <!--<FormItem :label="$t('最大借贷BTC')">
                    <Input v-model="obj.reason" :placeholder="$t('0则不生效')"></Input>
                </FormItem>
                <FormItem :label="$t('操作说明')">
                    <Input v-model="obj.eee" type="textarea" :row="5" :placeholder="$t('操作说明')"></Input>
                </FormItem>
            </Form>
        </Modal>!-->
    </div>
</template>
<script>
import { user } from '__util/api';
import handler from '__util/publicMethod';
import Cookies from 'js-cookie';

export default {
    name: 'safety',
    data () {
        return {
            table0Date: [],
            table1Date: [],
            table2Date: [],
            table0Column: [],
            table1Column: [],
            table2Column: [],
            table3Date: [],
            table3Column: [],
            table4Date: [],
            table4Column: [],
            tableDatePro: [],
            colsPro: [
                {
                    renderHeader: (h) => {
                        return this.$t('所属站点')
                    },
                    align: 'left',
                    render: (h, params) => {
                        let site = {
                            'PRO': 'Pro站',
                            'KR': '韩国站'
                        }
                        return this.$t(site[params.row.website])
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    align: 'left',
                    render: (h, params) => {
                        let row = params.row
                        return h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                disabled: !(row.checkAgreement && row.website === 'KR')
                            },
                            on: {
                                click: () => {
                                    this.$Modal.confirm({
                                        title: this.$t('更改账户所属站点'),
                                        // content: this.$t('是否确定将该账户的所属站点更改为PRO站') + '?',
                                        render: (h) => {
                                            return h('div',
                                                {
                                                    style: {
                                                        paddingTop: '30px'
                                                    }
                                                },
                                                [
                                                    h('span',{}, this.$t('site["是否确定将该账户的所属站点更改为"]')),
                                                    h('span',{
                                                        style: {
                                                            color: '#57a3f3'
                                                        }
                                                    }, this.$t('site["PRO站"]')),
                                                    h('span',{}, this.$t('site["尾巴"]') + '?'),
                                                ]
                                            )
                                        },
                                        okText: this.$t('userInfo.safety["确定更改"]'),
                                        onOk: () => {
                                            let request = user.resetUserSite
                                            request.path = {
                                                uid: this.uid
                                            }
                                            this.$axios(request).then(res => {
                                                this.getUserSite()
                                                this.$Message.success(this.$t('userInfo.safety["更改成功"]'))
                                            })
                                        }
                                    })
                                }
                            }
                        }, this.$t('更改'))
                    }
                },
            ],
            showGa: false,
            gaCode: null,
            showLog: false,
            logTitle: '',
            focus: '',
            showSet: false,
            obj: {},
            id: '0',
            currentOffset1: 0,
            prevOffset1: -1,
            nextOffset1: -1,
            currentOffset2: 0,
            prevOffset2: -1,
            nextOffset2: -1,
            showUnbund: false,
            nextSuccess: false,
            bindLink: '',
            oper: [
              {
                key: 1,
                name: '绑定邮箱'
              },
              {
                key: 2,
                name: '绑定手机'
              },
              {
                key: 3,
                name: '绑定谷歌验证器'
              },
              {
                key: 4,
                name: '更换绑定手机'
              },
              {
                key: 5,
                name: '更换绑定谷歌验证器'
              },
              {
                key: 6,
                name: '关闭邮箱验证'
              },
              {
                key: 7,
                name: '关闭手机验证'
              },
              {
                key: 8,
                name: '关闭谷歌验证器验证'
              },
              {
                key: 9,
                name: '开启邮箱验证'
              },
              {
                key: 10,
                name: '开启手机验证'
              },
              {
                key: 11,
                name: '开启谷歌验证器验证'
              },
              {
                key: 12,
                name: '重置登录密码'
              },
              {
                key: 13,
                name: '修改登录密码'
              },
            ],
            // 是否在白名单里
            inWhiteList: false,
            // 证件类型
            authType: [
                {num: '2', label: '手机号'},
                {num: '3', label: '银行账号'},
                {num: '4', label: '居住证'},
                {num: '5', label: '护照号'}
            ],
            // 换绑类型
            rebindType: '',
            userName: Cookies.get('user')
        }
    },
    created () {
        this.init()
    },
    props: {
        uid: Number
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.table1Column = column1(this)
            this.table2Column = column2(this)
            this.table3Column = column3(this)
            this.refresh1()
            this.refresh3()
            this.refresh4()
            this.getUserSite()
        },
        refresh1 () {
            let obj = handler.clone(user.safetyAuth)
            obj.url += '/' + this.uid
            this.$axios(obj).then(res => {
                this.table0Date = []
                if (res.data) {
                    this.inWhiteList = res.data.inWhiteList
                    this.table0Date = res.data.userSafetyAuthLevelList

                    let obj = res.data.userSafetyRes || {}
                    let status = {
                        "unbound": '未绑定',  //未绑定
                        "disable": '已绑定',  //绑定未启用
                        "enable": '已绑定',   //绑定并启用
                    }
                    let openStatus = {
                        "unbound": '未开启',  //未绑定
                        "disable": '未开启',  //绑定未启用
                        "enable": '已开启',
                    }
                    this.table1Date = [
                        {
                            type: "phone",
                            phone: obj.phone,
                            items: this.$t('手机号码'),
                            open:  this.$t(openStatus[obj.phone]),
                            state: this.$t(status[obj.phone])
                        },
                        {
                            type: "ga",
                            ga: obj.ga,
                            items: this.$t('谷歌验证'),
                            open:  this.$t(openStatus[obj.ga]),
                            state: this.$t(status[obj.ga])
                        },
                        {
                            type: "email",
                            email: obj.email,
                            items: this.$t('邮箱'),
                            open:  this.$t(openStatus[obj.email]),
                            state: this.$t(status[obj.email])
                        },
                    ]
                }
            })
        },
        refresh3 () {
            let obj = handler.clone(user.safetyOperation)
            obj.params = {
                uid: this.uid,
                page: this.currentOffset1
            }
            this.$axios(obj).then(res => {
                this.table2Date = res.data.data || []
                this.prevOffset1 = res.data.prevOffset
                this.currentOffset1 = res.data.currentOffset
                this.nextOffset1 = res.data.nextOffset
            })
        },
        refresh4 () {
            let obj = handler.clone(user.safetyLogin)
            obj.params = {
                uid: this.uid,
                page: this.currentOffset2
            }
            this.$axios(obj).then(res => {
                this.table3Date = res.data.data || []
                this.prevOffset2 = res.data.prevOffset
                this.currentOffset2 = res.data.currentOffset
                this.nextOffset2 = res.data.nextOffset
            })
        },
        pre1 () {
            this.currentOffset1 = this.prevOffset1
            this.refresh3()
        },
        next1 () {
            this.currentOffset1 = this.nextOffset1
            this.refresh3()
        },
        pre2 () {
            this.currentOffset2 = this.prevOffset2
            this.refresh4()
        },
        next2 () {
            this.currentOffset2 = this.nextOffset2
            this.refresh4()
        },
        // 注销用户
        subUnbind () {
            let request = {...user.resetEmail}
            request.data = {
                uid: this.uid
            }
            this.showUnbund = false
            this.$axios(request).then(res => {
                this.$Message.success({content: this.$t('注销成功')})
                this.$router.push('/userSearch')
            })
        },
        // ga验证下一步
        gaNext (type) {
            let request = {...user.gaCheck}
            request.params = {
                captcha: this.gaCode
            }
            this.$axios(request).then(res => {
                if ( this.rebindType === 'ga' ) {
                    this.rebindGa()
                }
                if ( this.rebindType === 'phone' ) {
                    this.rebindPhone()
                }
                if ( type && type === 'email' ) {
                    this.nextSuccess = true
                }
            })
        },
        // 换绑ga
        rebindGa () {
            let request = {...user.rebindGa}
            request.params = {
                uid: this.uid
            }
            this.$axios(request).then(res => {
                this.nextSuccess = true
                this.bindLink = res.data
            })
        },
        // 换绑手机
        rebindPhone () {
            let request = {...user.rebindPh}
            request.params = {
                uid: this.uid
            }
            this.$axios(request).then(res => {
                this.nextSuccess = true
                this.bindLink = res.data
            })
        },
        // 复制link
        copyLink () {
            const input = document.querySelector('#copyLink input')
            input.select()
            if (document.execCommand('copy')) {
                document.execCommand('copy')
            }
        },
        // 获取用户所属站点
        getUserSite () {
            let request = {...user.userSite}
            request.params = {
                uid: this.uid
            }
            this.$axios(request).then(res => {
                this.tableDatePro = [res.data] || []
            })
        }
    },
    watch: {
        showGa (val) {
            if ( !val ) {
                this.nextSuccess = false
                this.bindLink = ''
                this.gaCode = ''
                this.rebindType = ''
            }
        },
        showUnbund (val) {
            if ( !val ) {
                this.nextSuccess = false
                this.gaCode = ''
            }
        }
    }
}

const column0 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('认证级别')
            },
            align: 'left',
            key: 'level'
        },
        {
            renderHeader: (h) => {
                return vm.$t('userInfo.safety["姓名"]')
            },
            align: 'left',
            key: 'name'
        },
        {
            renderHeader: (h) => {
                return vm.$t('userInfo.safety["证件号码"]')
            },
            align: 'left',
            render: (h, params) => {
                return h('div', {
                    class: 'flex-between-center'
                }, [
                    h('span', params.row.idNo),
                    // h('a', {
                    //     on: {
                    //         click: () => {
                    //             vm.table0Date[params.index].show = !vm.table0Date[params.index].show
                    //             vm.get()
                    //         }
                    //     }
                    // }, vm.table0Date[params.index].show ? vm.$t('隐藏部分') : vm.$t('显示全部'))
                ])
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('userInfo.safety["证件类型"]')
            },
            align: 'left',
            key: 'idType',
            render: (h, params) => {
                for (let item of vm.authType) {
                    if ( item.num === params.row.idType ) {
                        return vm.$t(item.label)
                    }
                }
                return params.row.idType
            }
        },
        // {
        //     renderHeader: (h) => {
        //         return vm.$t('状态')
        //     },
        //     align: 'left',
        //     key: 'state',
        //     render: (h, params) => {
        //         if ( params.row.state == 1 ) {
        //             return vm.$t('审核通过')
        //         } else if ( params.row.state == 2 ) {
        //             return vm.$t('待审核')
        //         } else if ( params.row.state == 3 ) {
        //             return vm.$t('审核未通过')
        //         }
        //     }
        // },
        {
            renderHeader: (h) => {
                return vm.$t('userInfo.safety["去解除"]')
            },
            align: 'left',
            render: (h, params) => {
                let lv = params.row.level
                if ( (lv && lv === 1 ) || vm.inWhiteList ) {
                    return
                }
                return h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            let lv = params.row.level
                            let msgs = {
                                '2': '确定解除U2认证',
                                '3': '确定解除U3认证',
                                '4': '确定解除U4认证'
                            }
                            let modalMsg = msgs[lv]
                            vm.$Modal.confirm({
                                title: vm.$t('确定解除认证'),
                                content: vm.$t(modalMsg) + '?',
                                okText: vm.$t('userInfo.safety["解除确定"]'),
                                onOk: () => {
                                    user.unbind.params = {
                                        uid: vm.uid,
                                        authLevel: lv
                                    }
                                    vm.$axios(user.unbind).then(res => {
                                        vm.refresh1()
                                        vm.$Message.success(vm.$t('userInfo.safety["操作成功"]'))
                                    })
                                }
                            })
                        }
                    }
                }, vm.$t('解除'))
            }
        }
    ]
}

const column1 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('安全验证项')
            },
            align: 'left',
            key: 'items'
        },
        {
            renderHeader: (h) => {
                return vm.$t('绑定状态')
            },
            align: 'left',
            key: 'state'
        },
        {
            renderHeader: (h) => {
                return vm.$t('开启状态')
            },
            align: 'left',
            key: 'open'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作')
            },
            align: 'left',
            render: (h, params) => {
                let labelMap = {
                    'email': vm.$t('注销'),
                    'phone': vm.$t('换绑'),
                    'ga': vm.$t('换绑')
                }
                // 按钮禁止状态控制
                let btnStatus = {
                    'email': params.row.email === 'unbound' ? true : false,
                    'phone': params.row.phone === 'unbound' ? true : false,
                    'ga': params.row.ga === 'unbound' ? true : false
                }
                let label = labelMap[params.row.type]
                return h('Button', {
                    props: {
                        type: params.row.type === 'email' ? 'error' : 'primary',
                        disabled: btnStatus[params.row.type],
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            if ( params.row.type === 'ga' || params.row.type === 'phone' ) {
                                vm.showGa = true
                                vm.rebindType = params.row.type
                            }
                            if ( params.row.type === 'email' ) {
                                vm.showUnbund = true
                            }
                        }
                    }
                }, label)
            }
        },
    ]
}

const column2 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('操作项')
            },
            align: 'left',
            key: 'actionType',
            render: (h, params) => {
              for (let item of vm.oper) {
                  if ( item.key === params.row.actionType ) {
                      return vm.$t(item.name)
                  }
              }
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('IP 地址')
            },
            align: 'left',
            key: 'ip'
        },
        {
            renderHeader: (h) => {
                return vm.$t('国家')
            },
            align: 'left',
            key: 'country'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作时间')
            },
            align: 'left',
            key: 'gmtCreated',
            render: (h, params) => {
                if ( params.row.gmtCreated ) {
                    return vm.$moment(params.row.gmtCreated).format('YYYY-MM-DD HH:mm:ss')
                } else {
                    return ''
                }
            }
        }
    ]
}
const column3 = (vm) => {
    return [
        {
            title: 'ID',
            align: 'left',
            render: (h, params) => {
                return h('span', vm.uid)
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('登陆时间')
            },
            align: 'left',
            key: 'gmtCreated',
            render: (h, params) => {
                if ( params.row.gmtCreated ) {
                    return vm.$moment(params.row.gmtCreated).format('YYYY-MM-DD HH:mm:ss')
                } else {
                    return ''
                }
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('登陆端')
            },
            align: 'left',
            key: 'way'
        },
        {
            renderHeader: (h) => {
                return vm.$t('IP 地址')
            },
            align: 'left',
            key: 'ip'
        },
        {
            renderHeader: (h) => {
                return vm.$t('状态')
            },
            align: 'left',
            key: 'state',
            render: (h, params) => {
                return params.row.state === 0 ? vm.$t('失败') : vm.$t('成功')
            }
        }
    ]
}
</script>
<style lang="less" scope>
</style>
