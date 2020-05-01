<style lang="less" scope>
@import '../../../../assets/style/layout.less';
@import '../../../../assets/style/public.less';
</style>
<template>
    <div>
        <div class="flex-start-center">
            <div v-if="$store.state.user.checkPerm('risk:specialUsers:list')" style="width: 300px;margin-right: 10px">
                <Input v-model="paramValue" :placeholder="$t('请输入')">
                    <Select v-model="paramKey" slot="prepend" style="width: 120px" v-autoLocale>
                        <Option value="uid">UID</Option>
                        <Option value="phone">{{$t('电话号码')}}</Option>
                        <Option value="email">{{$t('邮箱')}}</Option>
                    </Select>
                </Input>
            </div>
            <Button v-if="$store.state.user.checkPerm('risk:specialUsers:list')" type="primary" @click="refresh">{{$t('查询')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card>
                    <p slot="title">
                        {{$t('特殊额度用户')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Modal v-model="showLog" width="600" @on-ok="update" :loading="loading">
            <h3 class="modal-title">{{$t('每日提币额度限制')}}</h3>
            <Table style="margin-top: 30px" refs="table0"
                    :no-data-text="$t('暂无数据')"
                    :data="table1Date"
                    :columns="table1Column"
            ></Table>
            <div slot="footer" style="border-top: 0">
                <Button type="primary" @click="update()">{{ $t('确定') }}</Button>
                <Button type="ghost" @click="cancel()">{{ $t('取消') }}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { limit } from '__util/api';
import handler from '__util/publicMethod';
export default {
    data () {
        return {
            table0Date: [],
            table0Column: [],
            table1Date: [],
            table1Column: [],
            showLog: false,
            id: '',
            paramKey: 'uid',
            paramValue: '',
            loading: true
        }
    },
    created () {
        if ( this.$store.state.user.checkPerm('risk:specialUsers:list') ) {
            this.init()
        }
    },
    methods: {
        init () {
            this.table0Column = columns0(this)
            this.table1Column = columns1(this)
            this.refresh()
        },
        refresh () {
            let obj = handler.clone(limit.special.specialList)
            obj.params = {
                paramKey: this.paramKey,
                type: 1
            }
            if (handler.removeBlank(this.paramValue)) {
                obj.params.paramValue = this.paramValue
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data || []
            })
        },
        limitRefresh (id) {
            let obj = handler.clone(limit.special.specialInfo)
            obj.params = {
                userId: id
            }
            this.$axios(obj).then(res => {
                this.table1Date = res.data || []
            })
        },
        cancel () {
          this.showLog = false;
        },
        update () {
            if (this.$store.state.user.checkPerm('risk:specialUsers:update')) {
                let valid = true
                for (let i of this.table1Date) {
                    if (!this.validate(i.dailyAmount)) valid = false
                }
                if (valid) {
                    let obj = handler.clone(limit.special.specialUpdate)
                    obj.data = {
                        userId: this.id,
                        limitCommonReqList: this.table1Date
                    },
                    this.$axios(obj).then(res => {
                        this.$Message.success(this.$t('成功'))
                        this.refresh()
                        this.showLog = false
                    })
                }
            } else {
                this.loading = false
                setTimeout(() => {
                    this.loading = true
                }, 0)
            }
        },
        validate (str) {
            if (str === null || str === '') return true
            str = str.toString()
            if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(str)) {
                this.$Modal.error({
                    content: this.$t('必须为正数'),
                    onOk: () => {
                        this.loading = false
                        setTimeout(() => {
                            this.loading = true
                        }, 0)
                    }
                })
                return false
            }
            if (str.indexOf('.') > 0) {
                let arr = str.split('.')
                if (arr[0].length > 8) {
                    this.$Modal.error({
                        content: this.$t('小数点前最多8位'),
                        onOk: () => {
                            this.loading = false
                            setTimeout(() => {
                                this.loading = true
                            }, 0)
                        }
                    })
                    return false
                }
                if (arr[1].length > 4) {
                    this.$Modal.error({
                        content: this.$t('小数点后最多4位'),
                        onOk: () => {
                            this.loading = false
                            setTimeout(() => {
                                this.loading = true
                            }, 0)
                        }
                    })
                    return false
                }
            } else {
                if (str.length > 8) {
                    this.$Modal.error({
                        content: this.$t('数字最多8位'),
                        onOk: () => {
                            this.loading = false
                            setTimeout(() => {
                                this.loading = true
                            }, 0)
                        }
                    })
                    return false
                }
            }
            return true
        }
    }
}

const columns0 = (vm) => {
    return [
        {
            title: 'UID',
            align: 'left',
            key: 'uid'
        },
        {
            renderHeader: (h) => {
                return vm.$t('邮箱')
            },
            align: 'left',
            key: 'mailBox'
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
                return vm.$t('操作人')
            },
            align: 'left',
            key: 'operator'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作时间')
            },
            align: 'left',
            key: 'operateTime'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作')
            },
            align: 'left',
            render: (h, params) => {
                return h('Button', {
                    props: {
                        type: 'primary',
                        disabled: !vm.$store.state.user.checkPerm('risk:specialUsers:info')
                    },
                    on: {
                        click: () => {
                            vm.showLog = true
                            vm.limitRefresh(params.row.uid)
                            vm.id = params.row.uid
                        }
                    }
                }, vm.$t('查看限额'))
            }
        }
    ]
}
const columns1 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('币种')
            },
            align: 'left',
            key: 'currency'
        },
        {
            renderHeader: (h) => {
                return vm.$t('限额')
            },
            align: 'left',
            render: (h, params) => {
                return h('Input', {
                    props: {
                        type: 'text',
                        value: vm.table1Date[params.index].dailyAmount
                    },
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    },
                    on: {
                        input: (val) => {
                            params.row.dailyAmount = val
                        },
                        'on-blur': () => {
                            vm.table1Date[params.index].dailyAmount = params.row.dailyAmount
                        }
                    }
                })
            }
        }
    ]
}
</script>
