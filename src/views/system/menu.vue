<template lang="html">
    <Row>
        <Row>
            <Button type="primary" @click="add" icon="plus" style="margin-right: 10px" v-if="$store.state.user.checkPerm('sys:menu:save')">{{ $t('新增') }}</Button>
            <Button type="primary" @click="edit" icon="edit" style="margin-right: 10px" v-if="$store.state.user.checkPerm('sys:menu:update')">{{ $t('修改') }}</Button>
            <Button type="primary" @click="del" icon="trash-a" v-if="$store.state.user.checkPerm('sys:menu:delete')">{{ $t('删除') }}</Button>
        </Row>
        <Card style="margin-top: 20px" class="table-tree">
            <Table :columns="columns" :data="dataList" style="width: 100%;" @on-selection-change="selectChange"></Table>
        </Card>
        <Modal v-model="modal" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ $t('新增菜单') }}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="60">
                    <FormItem :label="$t('类型')" style="text-align: left">
                        <RadioGroup v-model="formItem.type">
                            <Radio :label="0">{{ $t('目录') }}</Radio>
                            <Radio :label="1">{{ $t('菜单') }}</Radio>
                            <Radio :label="2">{{ $t('按钮') }}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem :label="$t('菜单名称')">
                        <Input v-model="formItem.name" :placeholder="$t('菜单名称或按钮名称')"></Input>
                    </FormItem>
                    <FormItem :label="$t('上级菜单')">
                        <Input v-model="formItem.parentName" :placeholder="$t('一级菜单')" @on-focus="chooseMenu"></Input>
                    </FormItem>
                    <FormItem :label="$t('菜单URL')">
                        <Input v-model="formItem.url" :placeholder="$t('菜单URL')"></Input>
                    </FormItem>
                    <FormItem :label="$t('授权标识')">
                        <Input v-model="formItem.perms" :placeholder="$t('多个用逗号分隔，如') + '：user:list,user:create'"></Input>
                    </FormItem>
                    <FormItem :label="$t('排序号')">
                        <InputNumber v-model="formItem.orderNum" placeholder="" style="width: 100%"></InputNumber>
                    </FormItem>
                    <FormItem :label="$t('图标')">
                        <Input v-model="formItem.icon" :placeholder="$t('菜单图标')"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="border-top: 0">
                <Button type="primary" @click="addSub">{{ $t('确定') }}</Button>
                <Button type="ghost" @click="modal = false">{{ $t('返回') }}</Button>
            </div>
        </Modal>
        <modal-tree
            :show="showTree"
            :list="parentList"
            :id="'menuId'"
            :title="$t('选择菜单')"
            @onClose="showTree = false"
            @message="changeMenu">
        </modal-tree>
    </Row>
</template>

<script>
import modalTree from '__components/my-tree'
import { sys } from '__util/api'
import util from '__util/util'
export default {
    components: {
        modalTree
    },
    data () {
        return {
            formItem: {
                orderNum: 1,
                type: 0,
                parentId: 0,
                parentName: this.$t('一级菜单')
            },
            modal: false,
            // 选择菜单
            showTree: false,
            // 选中的item
            checkedArr: [],
            columns: [],
            dataList: [],
            // 上级菜单
            parentList: []
        }
    },
    created () {
        document.getElementsByTagName('body')['0'].className = 'l-del';
        if ( this.$store.state.user.checkPerm('sys:menu:list') ) {
            this.getMenuList()
        }
    },
    mounted () {
        this.initColumns()
    },
    methods: {
        initForm () {
            this.formItem = {
                orderNum: 1,
                type: 0,
                parentId: 0,
                parentName: this.$t('一级菜单')
            }
        },
        initColumns () {
            this.columns = [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'

                },
                {
                    title: this.$t('菜单ID'),
                    key: 'menuId',
                },
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(
                            'div',
                            [
                                h('Table', {
                                    props: {
                                        columns: this.columns,
                                        data: params.row.children,
                                        'show-header': false
                                    },
                                    on: {
                                        'on-selection-change': this.selectChange
                                    }
                                })
                            ]
                        )
                    }
                },
                {
                    title: this.$t('菜单名称'),
                    key: 'name',

                },
                {
                    title: this.$t('上级菜单'),
                    key: 'parentName',
                },
                {
                    title: this.$t('图标'),
                    key: 'icon',
                },
                {
                    title: this.$t('类型'),
                    key: 'type',
                },
                {
                    title: this.$t('排序号'),
                    key: 'orderNum',
                },
                {
                    title: this.$t('菜单URL'),
                    key: 'url',
                },
                {
                    title: this.$t('授权标识'),
                    key: 'perms',
                }
            ]
        },
        getMenuList () {
            this.checkedArr = []
            this.$axios(sys.menu.menuList).then((res) => {
                this.dataList = util.toMenuData(res.data)
                this.parentList = res.data
            })
        },
        add () {
            this.formItem = {
                orderNum: 1,
                type: 0,
                parentId: 0,
                parentName: this.$t('一级菜单')
            }
            this.modal = true
        },
        edit () {
            if ( this.checkedArr.length !== 1 ) {
                this.$Message.error({content: this.$t('请选择一条菜单')})
                return
            }
            this.modal = true
            this.formItem = this.checkedArr[0]
        },
        editSub () {
            this.$axios(sys.menu.updateMenu).then((res) => {
                // this.dataList = util.toMenuData(res.data)
                this.$Message.success({content: this.$t('修改成功')})
                this.getMenuList()
            })
        },
        del () {
            if ( this.checkedArr.length === 0 ) {
                this.$Message.error({content: this.$t('请选择一条菜单')})
                return
            } else {
                this.$Modal.confirm({
                    title: this.$t('确认'),
                    content: this.$t('确定删除'),
                    onOk: this.delSub
                })
            }
        },
        // 删除提交
        delSub () {
            if ( this.checkedArr.length !== 1 ) {
                this.$Message.error({content: this.$t('请选择一条菜单')})
                return
            }
            sys.menu.deleteMenu.params = {
                menuId: this.checkedArr[0].menuId
            }
            this.$axios(sys.menu.deleteMenu).then((res) => {
                this.$Message.success({content: this.$t('删除成功')})
                this.getMenuList()
            })
        },
        addSub () {
            this.modal = false
            let option = this.formItem.menuId ? sys.menu.updateMenu : sys.menu.addMenu
            option.data = this.formItem
            this.$axios(option).then((res) => {
                let msg = this.formItem.menuId ? this.$t('修改') : this.$t('添加')
                this.$Message.success({content: msg + this.$t('成功')})
                this.getMenuList()
            })
        },
        chooseMenu () {
            this.showTree = true
        },
        changeMenu (item) {
            if ( item.data && item.data.menuId ) {
                this.formItem.parentId = item.data.menuId
                this.formItem.parentName = item.data.title
            }
        },
        selectChange (item) {
            this.checkedArr = item
        }
    }
}
</script>

<style lang="less">
.table-tree {
    td.ivu-table-expanded-cell {
        padding: 0;
    }
    td .ivu-table-wrapper, td td{
        border: 0
    }
}
</style>
