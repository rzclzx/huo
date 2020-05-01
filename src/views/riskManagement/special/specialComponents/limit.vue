<style lang="less" scope>
@import '../../../../assets/style/layout.less';
@import '../../../../assets/style/public.less';
</style>
<template>
    <div>
        <div class="flex-start-center">
            <div v-if="$store.state.user.checkPerm('risk:specialAmountManager')" style="width: 300px;margin-right: 10px">
                <Input v-model="paramValue" :placeholder="$t('请输入')">
                    <Select v-model="paramKey" slot="prepend" style="width: 120px" v-autoLocale>
                        <Option value="uid">UID</Option>
                        <Option value="phone">{{$t('电话号码')}}</Option>
                        <Option value="email">{{$t('邮箱')}}</Option>
                    </Select>
                </Input>
            </div>
            <Button v-if="$store.state.user.checkPerm('risk:specialAmountManager')" type="primary" @click="refresh">{{$t('查询')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('用户信息')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px" v-if="table1Date.length > 0">
            <Col>
                <Card class="dis-select" style="overflow: hidden; padding-bottom: 20px">
                    <p slot="title">
                        {{$t('每日提币额度限制')}}
                    </p>
                    <Row>
                        <Col span="8">
                            <div style="width: 80%;margin: 0 auto;">
                                <Table  refs="table1"
                                        :no-data-text="$t('暂无数据')"
                                        :data="table1Date"
                                        :columns="table1Column"
                                ></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style="text-align: center">
                            <Button v-if="$store.state.user.checkPerm('risk:specialUsers:update')" type="primary" size="large" style="margin-top: 20px" @click="update">{{$t('设置')}}</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
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
            id: '',
            paramKey: 'uid',
            paramValue: ''
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.table1Column = column1(this)
        },
        refresh () {
            let obj = handler.clone(limit.special.specialList)
            obj.params = {
                paramKey: this.paramKey,
                type: 0
            }
            if (handler.removeBlank(this.paramValue)) {
                obj.params.paramValue = this.paramValue
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data || []
                if (this.table0Date.length === 1 && this.$store.state.user.checkPerm('risk:specialUsers:info')) {
                    this.id = this.table0Date[0].uid
                    this.limitRefresh()
                } else {
                    this.table1Date = []
                }
            })
        },
        limitRefresh () {
            let obj = handler.clone(limit.special.specialInfo)
            obj.params = {
                userId: this.id
            }
            this.$axios(obj).then(res => {
                this.table1Date = res.data || []
            })
        },
        update () {
            let obj = handler.clone(limit.special.specialUpdate)
            obj.data = {
                userId: this.id,
                limitCommonReqList: this.table1Date

            }
            this.$axios(obj).then(res => {
                this.$Modal.success({
                    okText: this.$t('关闭'),
                    content: this.$t('成功')
                })
                this.limitRefresh()
            })
        }
    }
}

const column0 = (vm) => {
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
                return vm.$t('状态')
            },
            align: 'left',
            render: (h, params) => {
                return h('span', params.row.state == 0 ? vm.$t('正常') : vm.$t('禁止'))
            }
        }
    ]
}
const validate = (vm, str) => {
    if (str === null || str === '') return true
    str = str.toString()
    if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(str)) {
        vm.$Modal.error({
            content: vm.$t('必须为正数')
        })
        return false
    }
    if (str.indexOf('.') > 0) {
        let arr = str.split('.')
        if (arr[0].length > 8) {
            vm.$Modal.error({
                content: vm.$t('小数点前最多8位')
            })
            return false
        }
        if (arr[1].length > 4) {
            vm.$Modal.error({
                content: vm.$t('小数点后最多4位')
            })
            return false
        }
    } else {
        if (str.length > 8) {
            vm.$Modal.error({
                content: vm.$t('数字最多8位')
            })
            return false
        }
    }
    return true
}
const column1 = (vm) => {
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
                        value: vm.table1Date[params.index].dailyAmount,
                        disabled: !vm.$store.state.user.checkPerm('risk:specialUsers:update')
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
                            if (validate(vm, params.row.dailyAmount)) {
                                vm.table1Date[params.index].dailyAmount = params.row.dailyAmount
                            } else {
                                let value = vm.table1Date[params.index].dailyAmount
                                vm.table1Date[params.index].dailyAmount = ''
                                setTimeout(() => {
                                    vm.table1Date[params.index].dailyAmount = value
                                }, 0)
                            }
                        }
                    }
                })
            }
        }
    ]
}
</script>
