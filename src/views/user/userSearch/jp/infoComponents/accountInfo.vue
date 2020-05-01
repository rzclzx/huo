<style lang="less" scope>
.modal-form{
    width: 500px;
    font-size: 14px;
    margin: 30px auto;
}
</style>
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
                    <div slot="title" class="flex-between-center">
                        <p>{{$t('备注信息')}}</p>
                        <Button v-if="table2Date.length === 0" type="primary" @click="toggleModal">{{$t('添加备注')}}</Button>
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
        <Modal  v-model="showModal" width="800">
            <h3 class="modal-title">{{$t('添加备注')}}</h3>
            <Form class="modal-form"  :label-width="80"  ref="remark" :model="remark" :rules="ruleItem">
                <FormItem :label="$t('备注类型')" prop="typeId">
                    <Select v-model="remark.typeId" :placeholder="$t('备注类型')" v-autoLocale>
                        <Option v-for="i in remarkList" :value="i.id">{{i.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('提现提示')">
                    <RadioGroup v-model="remark.show" >
                        <Radio label="1">
                            <span>{{$t('关闭')}}</span>
                        </Radio>
                        <Radio label="0">
                            <span>{{$t('开启')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="$t('备注文案')" prop="content">
                    <Input v-model="remark.content" type="textarea" :rows="5" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="primary" @click="submit('remark')">{{ $t('确定') }}</Button>
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
            table3Date: [],
            column0: [],
            column1: [],
            column2: [],
            column3: [],
            showModal: false,
            radio: 0,
            remark: {
                show: 1
            },
            showR: false,
            showRM: '',
            total: 0,
            remarkList: [],
            ruleItem : {
                typeId  : [
                    { required: true, message: this.$t('备注类型不能为空') }
                ],
                content  : [
                    { required: true, message: this.$t('备注不能为空') }
                ],
            },
        }
    },
    props: {
        userId: String
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
            //this.table3Column = column3(this)
            this.refresh1()
            this.refresh2()
            this.refresh3()
            this.refresh4()
        },
        toggleModal () {
            // this.remark = {}
            this.showModal = !this.showModal
        },
        submit (name) {
            this.$refs[name].validate((valid) => {

                if (valid) {
                    let obj = handler.clone(user.userremarkAdd)
                    obj.data = this.remark
                    obj.data.userId = this.userId
                    this.$axios(obj).then(res => {
                        this.$Message.info(this.$t('成功'))
                        this.refresh3()
                            this.showModal = false;
                    })
                }
            })

        },
        refresh1 () {
            let obj = handler.clone(user.accountauth)
            obj.params = {
                userId: this.userId*1
            }
            this.$axios(obj).then(res => {
                this.table1Date = []
                if (res.data) this.table1Date.push(res.data)
            })
        },
        refresh2 () {
            let obj = handler.clone(user.accountbasic)
            obj.data = {
                userId: this.userId*1
            }
            this.$axios(obj).then(res => {
                this.table0Date = []
                if (res.data) this.table0Date.push(res.data)
            })
        },
        refresh3 () {
            let obj = handler.clone(user.userremarkList)
            obj.url += '/' + this.userId
            this.$axios(obj).then(res => {
                this.table2Date = []
                if (res.data) this.table2Date.push(res.data)
            })
        },
        refresh4 () {
            let obj = handler.clone(user.remarkTypeList)
            this.$axios(obj).then(res => {
                this.remarkList = res.data || []
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
          return vm.$t('认证级别')
        },
        align: 'left',
        key: 'authType'
    },
    {
        renderHeader: (h) => {
          return vm.$t('净资产折合')
        },
        align: 'left',
        key: 'assets'
    }
]
}
const column1 = (vm) => {
    return [
    {
        renderHeader: (h) => {
          return vm.$t('姓名')
        },
        align: 'left',
        key: 'name'
    },
    {
        renderHeader: (h) => {
          return vm.$t('认证信息')
        },
        align: 'left',
        key: 'id'
    },
    {
        renderHeader: (h) => {
          return vm.$t('国籍')
        },
        align: 'left',
        key: 'nationality'
    },
    {
        title: vm.$t('AML'),
        align: 'left',
        key: 'aml'
    },
    {
        renderHeader: (h) => {
          return vm.$t('注册时间')
        },
        align: 'left',
        key: 'regTime'
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
              return vm.$t('操作')
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
                                    onOk: () => {
                                        let obj = handler.clone(user.userremarkDel)
                                        obj.url += '/' + params.row.id
                                        vm.$axios(obj).then(res => {
                                            vm.$Message.info(vm.$t('成功'))
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
              return vm.$t('操作类型')
            },
            align: 'left',
            key: 'type'
        },
        {
            renderHeader: (h) => {
              return vm.$t('操作时间')
            },
            align: 'left',
            key: 'time'
        },
        {
            renderHeader: (h) => {
              return vm.$t('操作人')
            },
            align: 'left',
            key: 'name'
        },
        {
            renderHeader: (h) => {
              return vm.$t('备注内容')
            },
            align: 'left',
            render: (h, params) => {
                return h('Button', {
                    props: {
                        type: 'primary',
                        disabled: !vm.$store.state.user.checkPerm('user:mgt:query:account:detail')
                    },
                    style: {
                        fontSize: '14px'
                    },
                    on: {
                        click: () => {
                            vm.showRM = params.row.remark
                            vm.showR = true
                        }
                    }
                }, vm.$t('查看'))
            }
        }
    ]
}
</script>
