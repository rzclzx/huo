<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('基础信息')}}
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
                        {{$t('安全信息')}}
                    </p>
                    <Table  refs="table1"
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
                    <p slot="title">
                        {{$t('认证信息')}}
                    </p>
                    <Table  refs="table3"
                            :no-data-text="$t('暂无数据')"
                            :data="table3Date"
                            :columns="table3Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <div slot="title" class="flex-between-center">
                        <p>{{$t('备注信息')}}</p>
                        <Button v-if="$store.state.user.checkPerm('user:remark:add')" type="primary" @click="toggleModal">{{$t('添加备注')}}</Button>
                    </div>
                    <Table  refs="table2"
                            :no-data-text="$t('暂无数据')"
                            :data="table2Date"
                            :columns="table2Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <!--<Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('管理操作历史')}}
                    </p>
                    <Table  refs="table3"
                            :no-data-text="$t('暂无数据')"
                            :data="table3Date"
                            :columns="table3Column"
                    ></Table>
                    <Row>
                        <Col span="24">
                            <div style="margin-top: 10px" class="flex-end-center">
                                <Page show-elevator :total="total" size="small" show-total></Page>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>!-->
        <Modal  v-model="showModal" width="800" class-name="modal-clear-line">
            <h3 class="modal-title">{{$t('添加备注')}}</h3>
            <Form class="modal-form" ref="modal" :label-width="80" style="margin-top: 30px">
                <FormItem :label="$t('备注类型')">
                    <Select v-model="remark.typeId" :placeholder="$t('备注类型')" v-autoLocale>
                        <Option v-for="i in remarkList" :value="i.id">{{i.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('提现提示')">
                    <RadioGroup v-model="remark.show">
                        <Radio label="1">
                            <span>{{$t('关闭')}}</span>
                        </Radio>
                        <Radio label="0">
                            <span>{{$t('开启')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="$t('备注文案')">
                    <Input v-model="remark.content" type="textarea" :rows="5" placeholder=""></Input>
                </FormItem>
            </Form>
            <div class="" slot="footer">
                <Button type="primary" @click="submit">{{ $t('accountInfo["确定保存"]') }}</Button>
            </div>
        </Modal>
        <Modal  v-model="showR" width="400">
            <h3 class="modal-title">{{$t('备注内容')}}</h3>
            <div style="margin-top: 30px;text-align: center">{{ showRM }}</div>
        </Modal>
    </div>
</template>
<script>
import { user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'accountInfo',
    data () {
        return {
            table0Date: [],
            table1Date: [],
            table2Date: [],
            table3Date: [{}],
            column0: [],
            column1: [],
            column2: [],
            column3: [],
            showModal: false,
            radio: 0,
            remark: {},
            showR: false,
            showRM: '',
            total: 0,
            remarkList: [],
            showBtn: true,
            // 是否在白名单中
            authWhiteList: false
        }
    },
    props: {
        uid: Number
    },
    created () {
        document.getElementsByTagName('body')['0'].className = 'l-del';
        this.init()
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.table1Column = column1(this)
            this.table2Column = column2(this)
            this.table3Column = column3(this)
            // this.refresh1()
            this.refresh2()
            this.refresh3()
            this.refresh4()
        },
        toggleModal () {
            if (this.table2Date.length === 0) {
              this.remark = {}
              this.showModal = !this.showModal
            } else {
              this.$Modal.info({
                  title: this.$t('accountInfo["提示"]'),
                  okText: this.$t('accountInfo["确定"]'),
                  content: this.$t('已存在用户备注信息')
              })
            }

        },
        submit () {
            let obj = handler.clone(user.userremarkAdd)
            obj.data = this.remark
            obj.data.uid = this.uid
            this.$axios(obj).then(res => {
                this.$Message.success(this.$t('成功'))
                this.refresh3()
            })
        },
        refresh1 () {
            let obj = handler.clone(user.accountauth)
            obj.params = {
                uid: this.uid*1
            }
            this.$axios(obj).then(res => {
                this.table1Date = []
                if (res.data) this.table1Date.push(res.data)
            })
        },
        refresh2 () {
            let obj = handler.clone(user.accountbasic)
            obj.data = {
                uid: this.uid*1
            }
            this.$axios(obj).then(res => {
                this.table0Date = []
                if (res.data) {
                    this.table0Date.push(res.data)
                    this.authWhiteList = res.data.authWhiteList
                    this.table1Date = [res.data.userSafetyRes]
                    this.table3Date = [res.data.userAccountAuthRes]
                }
            })
        },
        refresh3 () {
            let obj = handler.clone(user.userremarkList)
            obj.url += '/' + this.uid
            this.$axios(obj).then(res => {
                this.table2Date = []
                if (res.data) {
                    this.table2Date.push(res.data)
                    this.showBtn = false
                }
            })
        },
        refresh4 () {
            let obj = handler.clone(user.remarkTypeList)
            this.$axios(obj).then(res => {
                this.remarkList = res.data || []
            })
        },
        // 解除绑定
        unBind (lv) {
            let msgs = {
                '2': '确定解除U2认证',
                '3': '确定解除U3认证'
            }
            let modalMsg = msgs[lv]
            this.$Modal.confirm({
                title: this.$t('确定解除认证'),
                content: this.$t(modalMsg) + '?',
                onOk: () => {
                    user.unbind.params = {
                        userId: this.table0Date[0].userId,
                        authLevel: lv
                    }
                    this.$axios(user.unbind).then(res => {
                        this.refresh2()
                        this.$Message.success(this.$t('操作成功'))
                    })
                }
            })
        }
    }
}

const column0 = (vm) => {
    return [
    {
        title: vm.$t('UID'),
        align: 'left',
        key: 'uid'
    },
    {
        renderHeader: (h) => {
          return vm.$t('邮箱')
        },
        align: 'left',
        key: 'email'
    },
    {
        renderHeader: (h) => {
          return vm.$t('手机号')
        },
        align: 'left',
        key: 'phone'
    },
    {
        renderHeader: (h) => {
          return vm.$t('国籍')
        },
        align: 'left',
        key: 'nationality',
        render: (h, params) => {
            return params.row.userAccountAuthRes.nationality
        }
    },
    {
        renderHeader: (h) => {
          return vm.$t('姓名')
        },
        align: 'left',
        key: 'name',
        render: (h, params) => {
            return params.row.userAccountAuthRes.name
        }
    },
    {
        renderHeader: (h) => {
          return vm.$t('AML')
        },
        align: 'left',
        key: 'aml',
        render: (h, params) => {
            return params.row.userAccountAuthRes.aml
        }
    },
    {
        renderHeader: (h) => {
          return vm.$t('净资产折合')
        },
        align: 'left',
        key: 'assetsKRW',
        render: (h, params) => {
            return `${params.row.assetsKRW} KRW`
        }
    }
]
}
const column1 = (vm) => {
    return [
    {
        renderHeader: (h) => {
          return vm.$t('绑定手机')
        },
        align: 'left',
        render: (h, params) => {
            let labelState = []
            if ( params.row.phone === 'unbound' ) {
                labelState.push(h('div', vm.$t('未绑定')))
                labelState.push(h('div', vm.$t('未开启')))
            }
            if ( params.row.phone === 'disable' ) {
                labelState.push(h('div', vm.$t('已绑定')))
                labelState.push(h('div', vm.$t('未开启')))
            }
            if ( params.row.phone === 'enable' ) {
                labelState.push(h('div', vm.$t('已绑定')))
                labelState.push(h('div', vm.$t('已开启')))
            }
            return h('div',{
                style: {
                    display: 'flex'
                },
            }, [
                h('div', {style: {marginRight: '20px'}}, params.row.phoneNumber),
                h('div', labelState)
            ])
        }
    },
    {
        renderHeader: (h) => {
          return vm.$t('绑定邮箱')
        },
        align: 'left',
        render: (h, params) => {
            let labelState = []
            if ( params.row.email === 'unbound' ) {
                labelState.push(h('div', vm.$t('未绑定')))
                labelState.push(h('div', vm.$t('未开启')))
            }
            if ( params.row.email === 'disable' ) {
                labelState.push(h('div', vm.$t('已绑定')))
                labelState.push(h('div', vm.$t('未开启')))
            }
            if ( params.row.email === 'enable' ) {
                labelState.push(h('div', vm.$t('已绑定')))
                labelState.push(h('div', vm.$t('已开启')))
            }
            return h('div',{
                style: {
                    display: 'flex'
                },
            }, [
                h('div', {style: {marginRight: '20px'}}, params.row.emailAddress),
                h('div', labelState)
            ])
        }
    },
    {
        renderHeader: (h) => {
          return vm.$t('绑定GA')
        },
        align: 'left',
        render: (h, params) => {
            let labelState = []
            if ( params.row.ga === 'unbound' ) {
                labelState.push(h('div', vm.$t('未绑定')))
                labelState.push(h('div', vm.$t('未开启')))
            }
            if ( params.row.ga === 'disable' ) {
                labelState.push(h('div', vm.$t('已绑定')))
                labelState.push(h('div', vm.$t('未开启')))
            }
            if ( params.row.ga === 'enable' ) {
                labelState.push(h('div', vm.$t('已绑定')))
                labelState.push(h('div', vm.$t('已开启')))
            }
            return h('div',{
                style: {
                    display: 'flex'
                },
            }, [
                h('div', labelState)
            ])
        }
    }
]
}
const column2 = (vm) => {
    return [
        {
            renderHeader: (h) => {
              return vm.$t('添加时间')
            },
            align: 'left',
            key: 'addTime'
        },
        {
            renderHeader: (h) => {
              return vm.$t('类型')
            },
            align: 'left',
            key: 'type'
        },
        {
            renderHeader: (h) => {
              return vm.$t('备注内容')
            },
            align: 'left',
            key: 'content'
        },
        {
            renderHeader: (h) => {
              return vm.$t('添加人')
            },
            align: 'left',
            key: 'operator'
        },
        {
            renderHeader: (h) => {
              return vm.$t('展示状态')
            },
            align: 'left',
            render: (h, params) => {
                return h('a', {
                    on: {
                        click: () => {
                            let obj = handler.clone(user.userremarkShow)
                            obj.data = {
                                show: params.row.show === 1 ? 0 : 1,
                                id: params.row.id
                            }
                            vm.$axios(obj).then(res => {
                                vm.refresh3()
                            })
                        }
                    }
                }, params.row.show === 0 ? vm.$t('展示') : vm.$t('取消展示'))
            }
        },
        {
            renderHeader: (h) => {
              return vm.$t('accountInfo["操作"]')
            },
            align: 'left',
            render: (h, params) => {
                return h('div', {
                    style: {
                        fontSize: '14px'
                    }
                }, [
                    h('a', {
                        on: {
                            click: () => {
                                vm.$Modal.confirm({
                                    content: vm.$t('确定删除吗'),
                                    okText: vm.$t('accountInfo["确定删除"]'),
                                    onOk: () => {
                                        let obj = handler.clone(user.userremarkDel)
                                        obj.url += '/' + params.row.id
                                        vm.$axios(obj).then(res => {
                                            vm.$Message.success(vm.$t('成功'))
                                            vm.refresh3()
                                        })
                                    }
                                })
                            }
                        }
                    }, vm.$t('删除'))
                ])
            }
        }
    ]
}

const column3 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('注册时间')
            },
            align: 'left',
            key: 'regTime'
        },
        {
            renderHeader: (h) => {
                return vm.$t('认证级别')
            },
            align: 'left',
            key: 'authType'
        },
        {
            renderHeader: (h) => {
                return vm.$t('U2认证信息')
            },
            align: 'left',
            render: (h, params) => {
                if ( params.row.authType && params.row.authType.replace('U','')*1 < 2 ) {
                    return vm.$t('未认证')
                }
                let valueType = {
                    'TELEPHONE': params.row.telephone,
                    'PASSPORT': params.row.passportNo
                }
                let value = valueType[params.row.u2AuthWay]

                return h('div', value)
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('U3认证信息')
            },
            align: 'left',
            render: (h, params) => {
                if ( params.row.authType && params.row.authType.replace('U','')*1 < 3 ) {
                    return vm.$t('未认证')
                }
                let bank = h('div', {}, [
                    h('div', params.row.bankName),
                    h('div', params.row.bankNo)
                ])
                return bank
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('U4认证信息')
            },
            align: 'left',
            render: (h, params) => {
                if ( !vm.authWhiteList && params.row.authType !== 'U4' ) {
                    return vm.$t('未认证')
                }
                if ( params.row.authType === 'U4' ) {
                    return vm.$t('已认证')
                }
                return params.row.u4No
            }
        }
    ]
}
</script>
<style lang="less" scope>
</style>
