<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <div>
        <div class="flex-start-center" style="margin-top: 20px">
            <div v-if="$store.state.user.checkPerm('sys:user:list')" style="width: 260px;margin-right: 10px">
                <Input v-model="name" :placeholder="$t('用户名称')"></Input>
            </div>
            <Button v-if="$store.state.user.checkPerm('sys:user:list')" style="margin-right: 10px" @click="refresh">{{$t('查询')}}</Button>
            <Button v-if="$store.state.user.checkPerm('sys:user:save')" type="primary" icon="plus" style="margin-right: 10px" @click="create">{{$t('新增')}}</Button>
            <Button v-if="$store.state.user.checkPerm('sys:user:update')" type="primary" icon="edit" style="margin-right: 10px" @click="update">{{$t('修改')}}</Button>
            <Button v-if="$store.state.user.checkPerm('sys:user:delete')" type="primary" icon="trash-a" style="margin-right: 10px" @click="del">{{$t('删除')}}</Button>
            <Button v-if="$store.state.user.checkPerm('sys:user:resetPass')" type="primary" style="margin-right: 10px" icon="loop" @click="resetPwd">{{$t('重置密码')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('管理员管理')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                            @on-selection-change="choice"
                    ></Table>
                    <Row>
                        <Col span="24">
                            <div style="margin-top: 10px" class="flex-end-center">
                                <Page show-elevator :total="totalCount" @on-change="onChange" size="small" show-total>
                                    <slot>
                                        {{ $t('共') + ' ' + totalCount + ' ' + $t('条') }}
                                    </slot>
                                </Page>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { sys } from '__util/api';
import handler from '__util/publicMethod';
export default {
    data () {
        return {
            table0Date: [],
            table0Column: [],
            title: this.$t('新增'),
            id: undefined,
            delName: undefined,
            selected: [],
            name: '',
            currPage: 1,
            pageSize: 10,
            totalCount: 0
        }
    },
    created () {
        document.getElementsByTagName('body')['0'].className = 'l-del';
        if ( this.$store.state.user.checkPerm('sys:user:list') ) {
            this.init()
        }
    },
    methods: {
        init () {
            this.refresh()
            this.table0Column = column0(this)
        },
        create () {
            this.$router.push('/sysUserHandle')
        },
        update () {
            if (this.getId()) this.$router.push('/sysUserHandle/' + this.id)
        },
        del () {
            if (this.getId()) {
                this.$Modal.confirm({
                    content: this.$t('确定删除'),
                    onOk: () => {
                        let obj = handler.clone(sys.user.userDelete)
                        obj.params = { userId: this.id, userName: this.delName }
                        this.$axios(obj).then(res => {
                            this.$Message.success(this.$t('成功'))
                            this.refresh()
                        })
                    }
                })

            }
        },
        // 重置密码
        resetPwd () {
            if ( this.getId() ) {
                let option = sys.user.resetPwd
                option.data = {
                    userId: this.selected[0].userId
                }
                this.$axios(option).then(res => {
                    this.$Message.success(this.$t('操作成功'))
                })
            }
        },
        choice (row) {
            this.selected = row
        },
        getId () {
            if (this.selected.length > 1) {
                this.$Message.error(this.$t('只能选择一条'))
                return false
            }
            if (this.selected.length === 0) {
                this.$Message.error(this.$t('没选择'))
                return false
            }
            this.id = this.selected[0].userId
            this.delName = this.selected[0].username
            return true
        },
        refresh () {
            let obj = sys.user.userList
            obj.data = {
                username: this.name,
                page: this.currPage,
                limit: this.pageSize
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data.list || []
                this.currPage = res.data.currPage || 0
                this.totalCount = res.data.totalCount
                if (this.totalCount && this.table0Date.length === 0) {
                    this.currPage--
                    this.refresh()
                }
            })
        },
        onChange (code) {
            this.currPage = code
            this.refresh()
        }
    }
}

const column0 = (vm) => {
    return [
    {
        title: ' ',
        type: 'index',
        width: 60,
        align: 'center'
    },
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        renderHeader: (h) => {
            return vm.$t('用户ID')
        },
        align: 'left',
        key: 'userId'
    },
    {
        renderHeader: (h) => {
            return vm.$t('用户名')
        },
        align: 'left',
        key: 'username'
    },
    {
        renderHeader: (h) => {
            return vm.$t('所属部门')
        },
        align: 'left',
        key: 'deptName'
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
        key: 'mobile'
    },
    {
        renderHeader: (h) => {
            return vm.$t('状态')
        },
        align: 'left',
        render: (h, params) => {
            return h('Tag', {
                props: {
                    color: params.row.status ? 'green' : 'red'
                }
            }, params.row.status ? vm.$t('正常') : vm.$t('禁用'))
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('创建时间')
        },
        align: 'left',
        key: 'createTime'
    }
]
}
</script>
