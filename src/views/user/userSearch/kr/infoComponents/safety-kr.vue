<style lang="less" scope>
@import '../../../../../assets/style/layout.less';
@import '../../../../../assets/style/public.less';
</style>
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
        <!--<Modal v-model="showGa" width="600" @on-ok="confirm">
            <h3 class="modal-title">{{$t('请输入双重认证')}}</h3>
            <Form class="modal-form" ref="modal">
                <FormItem>
                    <Input v-model="gaCode" type="text" :placeholder="$t('管理员GA')"></Input>
                </FormItem>
            </Form>
        </Modal>!-->
        <!--<Modal v-model="showUnbund" width="600" @on-ok="submit">
            <h3 class="modal-title">{{$t('解除绑定')}}</h3>
            <Form class="modal-form" ref="modal" :label-width="80">
                <FormItem :label="$t('操作说明')">
                    <Input v-model="gaCode" type="textarea" :rows="5" placeholder=""></Input>
                </FormItem>
            </Form>
        </Modal>!-->
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
            nextOffset1: 10,
            currentOffset2: 0,
            prevOffset2: -1,
            nextOffset2: 10,
        }
    },
    created () {
        this.init()
    },
    props: {
        userId: String
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.table1Column = column1(this)
            this.table2Column = column2(this)
            this.table3Column = column3(this)
            this.refresh1()
            this.refresh2()
            this.refresh3()
            this.refresh4()
        },
        // confirm () {
        //     this.showSet = true
        // },
        // submit () {

        // }
        refresh1 () {
            let obj = handler.clone(user.safetyAuth)
            obj.url += '/' + this.userId
            this.$axios(obj).then(res => {
                this.table0Date = []
                if (res.data) this.table0Date.push(res.data)
            })
        },
        refresh2 () {
            let obj = handler.clone(user.safetySafety)
            obj.url += '/' + this.userId
            this.$axios(obj).then(res => {
                let obj = res.data || {}
                this.table1Date = [
                    {
                        items: this.$t('邮箱'),
                        state: obj.email == 'disable' ? this.$t('未启用') : this.$t('已绑定 ') + obj.emailAddress
                    },
                    {
                        items: this.$t('手机号码'),
                        state: obj.phone == 'disable' ? this.$t('未启用') : this.$t('已绑定 ') + obj.phoneNumber
                    },
                    {
                        items: this.$t('谷歌验证'),
                        state: obj.ga == 'unbound' ? this.$t('未启用') : this.$t('已绑定')
                    },
                    // {
                    //     items: this.$t('资金密码')
                    // },
                ]
            })
        },
        refresh3 () {
            let obj = handler.clone(user.safetyOperation)
            obj.params = {
                userId: this.userId,
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
                userId: this.userId,
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
                return vm.$t('姓名')
            },
            align: 'left',
            key: 'name'
        },
        {
            renderHeader: (h) => {
                return vm.$t('证件号码')
            },
            align: 'left',
            render: (h, params) => {
                return h('div', {
                    class: 'flex-between-center'
                }, [
                    h('span', params.row.id),
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
                return vm.$t('证件类型')
            },
            align: 'left',
            key: 'type'
        },
        {
            renderHeader: (h) => {
                return vm.$t('状态')
            },
            align: 'left',
            key: 'state',
            render: (h, params) => {
                if ( params.row.state == 1 ) {
                    return vm.$t('审核通过')
                } else if ( params.row.state == 2 ) {
                    return vm.$t('待审核')
                } else if ( params.row.state == 3 ) {
                    return vm.$t('审核未通过')
                }
            }
        },
        // {
        //     renderHeader: (h) => {
        //         return vm.$t('认证日志')
        //     },
        //     align: 'left',
        //     render: (h, params) => {
        //         return h('a', {
        //             on: {
        //                 click: () => {
        //                     vm.showLog = true
        //                     vm.logTitle = vm.$t('认证历史')
        //                     vm.table4Date = [{
        //                         time: '2017-12-12',
        //                         level: 'U2',
        //                         state: vm.$t('审核不通过'),
        //                         reason: vm.$t('证件不清晰'),
        //                         name: 'admin'
        //                     }]
        //                     vm.table4Column = [
        //                         {
        //                             title: vm.$t('认证时间'),
        //                             width: 200,
        //                             align: 'left',
        //                             key: 'time'
        //                         },
        //                         {
        //                             title: vm.$t('认证等级'),
        //                             align: 'left',
        //                             key: 'level'
        //                         },
        //                         {
        //                             title: vm.$t('状态'),
        //                             align: 'left',
        //                             key: 'state'
        //                         },
        //                         {
        //                             title: vm.$t('原因'),
        //                             align: 'left',
        //                             key: 'reason'
        //                         },
        //                         {
        //                             title: vm.$t('等级'),
        //                             align: 'left',
        //                             key: 'level'
        //                         }
        //                     ]
        //                 }
        //             }
        //         }, vm.$t('查看'))
        //     }
        // },
        // {
        //     title: '操作',
        //     align: 'left',
        //     render: (h, params) => {
        //         return h('Button', {
        //             props: {
        //                 type: 'primary'
        //             },
        //             on: {
        //                 click: () => {
        //                     vm.aaa[params.index] = !vm.aaa[params.index]
        //                     vm.showTable0Date[params.index].code = vm.aaa[params.index] ? vm.table0Date[params.index].code : vm.table0Date[params.index].code.slice(0, 5) + '***'
        //                 }
        //             }
        //         }, '冻 结')
        //     }
        // }
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
                return vm.$t('状态')
            },
            align: 'left',
            key: 'state'
        },
        // {
        //     renderHeader: (h) => {
        //         return vm.$t('操作日志')
        //     },
        //     align: 'left',
        //     render: (h, params) => {
        //         if (params.index === 4) {
        //             return h('Button', {
        //                 props: {
        //                     type: 'primary'
        //                 },
        //                 on: {
        //                     click: () => {
        //                         vm.gaCode = ''
        //                         vm.showGa = true
        //                     }
        //                 }
        //             }, vm.$t('设置'))
        //         } else {
        //             return h('a', {
        //                 on: {
        //                     click: () => {
        //                         vm.showLog = true
        //                         vm.logTitle = params.row.a1 + vm.$t('操作日志')
        //                         vm.table4Date = [{
        //                             time: '2017-12-12',
        //                             log: vm.$t('操作人') + 'admin',
        //                             remark: vm.$t('无')
        //                         }]
        //                         vm.table4Column = [
        //                             {
        //                                 title: vm.$t('操作时间'),
        //                                 width: 200,
        //                                 align: 'left',
        //                                 key: 'time'
        //                             },
        //                             {
        //                                 title: vm.$t('操作记录'),
        //                                 align: 'left',
        //                                 key: 'log'
        //                             },
        //                             {
        //                                 title: vm.$t('操作备注'),
        //                                 align: 'left',
        //                                 key: 'remark'
        //                             }
        //                         ]
        //                     }
        //                 }
        //             }, vm.$t('查看'))
        //         }
        //     }
        // },
        // {
        //     title: '安全操作',
        //     align: 'left',
        //     render: (h, params) => {
        //         return h('div', {

        //         }, [
        //             h('a', {
        //                 style: {
        //                     marginRight: '20px'
        //                 },
        //                 on: {
        //                     click: () => {
        //                         vm.gaCode = undefined
        //                         vm.showGaCodeModal = true
        //                     }
        //                 }
        //             }, '解绑'),
        //             h('a', {
        //                 on: {
        //                     click: () => {

        //                     }
        //                 }
        //             }, '换绑')
        //         ])
        //     }
        // }
    ]
}

const column2 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('操作项')
            },
            align: 'left',
            key: 'actionType'
        },
        {
            renderHeader: (h) => {
                return vm.$t('IP 地址')
            },
            align: 'left',
            key: 'ip'
        },
        // {
        //     renderHeader: (h) => {
        //         return vm.$t('备注')
        //     },
        //     align: 'left',
        //     key: 'c2'
        // },
        {
            renderHeader: (h) => {
                return vm.$t('操作时间')
            },
            align: 'left',
            key: 'gmtCreated'
        }
    ]
}
const column3 = (vm) => {
    return [
        {
            title: 'ID',
            align: 'left',
            render: (h, params) => {
                return h('span', vm.userId)
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('登陆时间')
            },
            align: 'left',
            key: 'gmtCreated'
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
            key: 'state'
        }
    ]
}
</script>
