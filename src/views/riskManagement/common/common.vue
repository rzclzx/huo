<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
html[lang="jp"]{
    .ivu-modal-confirm{
        .ivu-modal-confirm-footer{
            overflow: hidden;
            button{
                float: right;
            }
        }
    }
}
</style>
<template>
    <div>
        <div class="flex-start-center" style="margin-top: 20px">
            <div v-if="$store.state.user.checkPerm('risk:management:list')" style="width: 260px;margin-right: 10px">
                <Input v-model="name" :placeholder="$t('币种名称')"></Input>
            </div>
            <Button v-if="$store.state.user.checkPerm('risk:management:list')" type="primary" style="margin-right: 10px" @click="refresh">{{$t('查询')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('通用额度限制')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
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
            name: ''
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            if (this.$store.state.user.checkPerm('risk:management:list')) {
                this.refresh()
            }
        },
        refresh () {
            let obj = handler.clone(limit.common.commonList)
            if (handler.removeBlank(this.name)) {
                obj.params = {
                    currency: this.name
                }
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data || []
            })
        }
    }
}


const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('币种名称')
        },
        align: 'left',
        render: (h, params) => {
            return h('div',{
                style: {
                    height: '150px',
                    lineHeight: '150px'
                }
            }, params.row.currency)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('限制条件')
        },
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '150px'
                }
            }, [
                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, vm.$t('单次限额')),
                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, vm.$t('1日累计')),
                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, vm.$t('1月累计'))
            ])
        }
    },
    {
        title: 'Level1',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '150px'
                }
            }, [
                getInput(vm, h, params, 'singleAmount', 'level1'),
                getInput(vm, h, params, 'dailyAmount', 'level1'),
                getInput(vm, h, params, 'monthlyAmount', 'level1')
            ])
        }
    },
    {
        title: 'Level2',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '150px'
                }
            }, [
                getInput(vm, h, params, 'singleAmount', 'level2'),
                getInput(vm, h, params, 'dailyAmount', 'level2'),
                getInput(vm, h, params, 'monthlyAmount', 'level2')
            ])
        }
    },
    {
        title: 'Level3',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '150px'
                }
            }, [
                getInput(vm, h, params, 'singleAmount', 'level3'),
                getInput(vm, h, params, 'dailyAmount', 'level3'),
                getInput(vm, h, params, 'monthlyAmount', 'level3')
            ])
        }
    },
    {
        title: 'Level4',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '150px'
                }
            }, [
                getInput(vm, h, params, 'singleAmount', 'level4'),
                getInput(vm, h, params, 'dailyAmount', 'level4'),
                getInput(vm, h, params, 'monthlyAmount', 'level4')
            ])
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
                    position: 'relative',
                    height: '150px'
                }
            }, [
                h('div', {
                    style: {
                        position: 'absolute',
                        height: '50px',
                        lineHeight: '50px',
                        top: '50%',
                        marginTop: '-25px'
                    }
                }, [
                    getButton(vm, h, params, 'monthlyAmount', 3)
                ])
            ])
        }
    }
]
}

const getInput = (vm, h, params, type, level) => {
    return h('div', {
        style: {
            height: '50px',
            lineHeight: '50px'
        }
    }, [
        h('Input', {
            props: {
                value: params.row[type][level],
                disabled: !vm.$store.state.user.checkPerm('risk:management:update')
            },
            style: {
                height: '30px',
                lineHeight: '30px'
            },
            on: {
                input: (val) => {
                    params.row[type][level] = val
                },
                'on-blur': () => {
                    if (params.row[type][level] === '') {
                        params.row[type][level] = null
                    }
                }
            }
        })
    ])
}

const validate = (vm, str) => {
    if (!str && str !== 0) {
        vm.$Modal.error({
            content: vm.$t('限制额度不能为空')
        })
        return false
    }
    str = str.toString()
    if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(str)) {
        vm.$Modal.error({
            content: vm.$t('必须为整数')
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

const getButton = (vm, h, params, type, code) => {
    return h('Button', {
        props: {
            type: 'primary',
            disabled: !vm.$store.state.user.checkPerm('risk:management:update')
        },
        on: {
            click: () => {
                let keyMap = {
                    'dailyAmount': vm.$t('1日累计'),
                    'monthlyAmount': vm.$t('1月累计'),
                    'singleAmount': vm.$t('单次限额')
                }
                // 提交数据
                let subData = {
                    currency: params.row.currency
                }
                // 数据验证
                for (let item in params.row) {
                    if ( keyMap[item] ) {
                        // 防止返回数据字段顺序发生变化，用这个循环
                        for (let i = 1; i < 5; i++) {
                            let val = params.row[item]['level' + i]
                            // 正常验证
                            if ( !validate(vm, val) ) return
                            let cur = parseInt(val)
                            let nextLv = parseInt(params.row[item]['level' + (i + 1)])
                            // 判断lv大小
                            if ( nextLv && cur > nextLv) {
                                vm.$Modal.error({
                                    title: vm.$t('错误'),
                                    content: `${keyMap[item]}: ` + vm.$t('common_pre') + i + vm.$t('common_middle') + `${i + 1}` + vm.$t('common_tail'),
                                })
                                return
                            }
                            // 处理提交数据格式
                            if ( !subData['level' + i] ) {
                                subData['level' + i] = {}
                            }
                            subData['level' + i][item] = cur
                        }
                    }
                }
                for (let item in subData) {
                    if ( item.indexOf('level') > -1 ) {
                        if ( subData[item]['singleAmount'] > subData[item]['dailyAmount'] && subData[item]['singleAmount'] != 0) {
                            vm.$Modal.error({
                                title: vm.$t('错误'),
                                content: vm.$t('单次限额必须小于等于1日累计')
                            })
                            return
                        }
                        if ( subData[item]['dailyAmount'] > subData[item]['monthlyAmount'] && subData[item]['dailyAmount'] != 0 ) {
                            vm.$Modal.error({
                                title: vm.$t('错误'),
                                content: vm.$t('1日累计必须小于等于1月累计')
                            })
                            return
                        }
                    }
                }
                vm.$Modal.confirm({
                    title: vm.$t('修改'),
                    content: vm.$t('是否修改'),
                    okText: vm.$t('修改'),
                    renderFooter: () => {
                        return h('div', '234234')
                    },
                    onOk: () => {
                        let obj = handler.clone(limit.common.commonUpdate)
                        obj.data = subData
                        vm.$axios(obj).then(res => {
                            vm.$Message.success({
                                content: vm.$t('修改成功')
                            })
                            vm.refresh()
                        })
                    }
                })

            }
        }
    }, vm.$t('修改'))
}
</script>
