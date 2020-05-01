<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <div>
        <div class="flex-start-center" style="margin-top: 20px">
            <Button v-if="$store.state.user.checkPerm('sys:dept:save')" type="primary" icon="plus" style="margin-right: 10px" @click="create">{{$t('新增')}}</Button>
            <Button v-if="$store.state.user.checkPerm('sys:dept:update')" type="primary" icon="edit" style="margin-right: 10px" @click="update">{{$t('修改')}}</Button>
            <Button v-if="$store.state.user.checkPerm('sys:dept:delete')" type="primary" icon="trash-a" style="margin-right: 10px" @click="del">{{$t('删除')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('部门管理')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                            @on-selection-change="choice"
                    ></Table>
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
            selected: []
        }
    },
    created () {
        document.getElementsByTagName('body')['0'].className = 'l-del';
        if ( this.$store.state.user.checkPerm('sys:dept:list') ) {
            this.init()
        }
    },
    methods: {
        init () {
            this.refresh()
            this.table0Column = column0(this)
        },
        create () {
            this.$router.push('/sysDeptHandle')
        },
        update () {
            if (this.getId()) this.$router.push('/sysDeptHandle/' + this.id)
        },
        del () {
            if (this.getId()) {
                let conf = this.$Modal.confirm({
                    content: this.$t('确定删除'),
                    onOk: () => {
                        let obj = handler.clone(sys.dept.deptDelete)
                        obj.params = { deptId: this.id }
                        this.$axios(obj).then(res => {
                            this.$Message.info(this.$t('成功'))
                            this.refresh()
                        })
                    }
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
            this.id = this.selected[0].deptId
            return true
        },
        refresh () {
            this.$axios(sys.dept.deptList).then(res => {
                this.table0Date = res.data || []
            })
        }
    }
}

const column0 = (vm) => {
    return [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        renderHeader: (h) => {
            return vm.$t('部门ID')
        },
        align: 'left',
        key: 'deptId'
    },
    {
        renderHeader: (h) => {
            return vm.$t('部门名称')
        },
        align: 'left',
        key: 'name'
    },
    {
        renderHeader: (h) => {
            return vm.$t('上级部门')
        },
        align: 'left',
        key: 'parentName'
    },
    {
        renderHeader: (h) => {
            return vm.$t('排序号')
        },
        align: 'left',
        key: 'orderNum'
    }
]
}
</script>
