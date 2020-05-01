<style lang="less" scope>
@import '../../../../../assets/style/layout.less';
@import '../../../../../assets/style/public.less';
.modal-content{
    margin: 30px auto;
    .flex-wrap-start-center;
    div{
        width: 20%;
        height: 60px;
        text-align: center;
        div{
            width: 120px;
            height: 40px;
            .border-gray-1;
            border-radius: 4px;
            font-size: 16px;
            line-height: 40px;
            .center;
            .pointer;
        }
    }
}
.current{
    .gray-current;
}
</style>
<template>
    <div>
        <div class="flex-start-center">
            <div class="input" style="margin-right: 10px">
                <Input v-model="obj.value" :placeholder="$t('备注类型')"></Input>
            </div>
            <Button type="primary" @click="add" v-if="$store.state.user.checkPerm('user:remark:type:add')">{{$t('添加')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('类型列表')}}
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
import { user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'remark',
    data () {
        const remarkCheck = (rule, value, callback) => {
            if ( maxL(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('最多10个字符')))
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

            if (num > 10) {
                return false
            } else {
                return true
            }
        }
        return {
            table0Date: [],
            table0Column: [],
            obj: {},
            ruleItem: {
                value: [
                    // { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    // { validator: remarkCheck, trigger: 'blur' }
                ]
            },
            timer: null
        }
    },
    created () {
        document.getElementsByTagName('body')['0'].className = 'l-del';
        this.init()
    },
    methods: {
        init () {
            this.table0Column = remark(this)
            this.refresh()
        },
        refresh () {
            let obj = handler.clone(user.remarkTypeList)
            this.$axios(obj).then(res => {
                this.table0Date = res.data || []
            })
        },
        add () {
            if (this.obj.value) {
              let obj = handler.clone(user.remarkTypeAdd)
              obj.data = {
                  name: this.obj.value
              }
              this.$axios(obj).then(res => {
                  this.$Message.success(this.$t('成功'))
                  this.obj.value = ''
                  this.refresh()
              })
            } else {
              this.$Message.info(this.$t('请输入备注类型'))
            }


        }
    }
}

const remark = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('编号')
            },
            align: 'left',
            key: 'id'
        },
        {
            renderHeader: (h) => {
                return vm.$t('类型名称')
            },
            align: 'left',
            key: 'name'
        },
        {
            renderHeader: (h) => {
                return vm.$t('添加时间')
            },
            align: 'left',
            key: 'createTime'
        },
        {
            renderHeader: (h) => {
                return vm.$t('userAuthReview["操作"]')
            },
            align: 'left',
            render: (h, params) => {
                return h('Button', {
                    props: {
                        type: 'primary',
                        disabled: !vm.$store.state.user.checkPerm('user:remark:type:del')
                    },
                    on: {
                        click: () => {
                            vm.$Modal.confirm({
                                content: vm.$t('确定删除吗'),
                                okText: vm.$t('删除'),
                                onOk: () => {
                                    let obj = handler.clone(user.remarkTypeDelete)
                                    obj.url += '/' + params.row.id
                                    vm.$axios(obj).then(res => {
                                        vm.$Message.success(vm.$t('成功'))
                                        vm.refresh()
                                    })
                                }
                            })
                        }
                    }
                }, vm.$t('删除'))
            }
        }
    ]
}
</script>
