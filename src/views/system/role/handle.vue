<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
.ivu-tree-arrow{
    position: relative;
    bottom: 2px;
}
.ivu-checkbox-wrapper{
    position: relative;
    bottom: 2px;
}
</style>
<template>
    <Row>
        <Col>
            <Card>
                <p slot="title">
                    {{ title }}
                </p>
                <div style="width: 600px">
                    <Form ref="rule" :model="obj" :rules="ruleItem" class="modal-form" :label-width="80" style="width: 600px">
                        <FormItem :label="$t('角色名称')" prop="roleName">
                            <Input v-model="obj.roleName" type="text" :placeholder="$t('角色名称')" :maxlength="32"></Input>
                        </FormItem>
                        <FormItem :label="$t('所属部门')" prop="deptName">
                            <Input @on-focus="choiceModal" v-model="obj.deptName" type="text" :placeholder="$t('所属部门')"></Input>
                        </FormItem>
                        <FormItem :label="$t('备注')" prop="remark">
                            <Input v-model="obj.remark" type="text" :placeholder="$t('备注')"></Input>
                        </FormItem>
                    </Form>
                    <div class="flex-start-start dis-select" style="padding: 40px">
                        <div style="width: 400px;margin-right: 20px">
                            <h3>{{$t('功能权限')}}</h3>
                            <Tree ref="tree0" @on-check-change="choiceMenu" :data="menuList" :render="renderContent" show-checkbox></Tree>
                        </div>
                        <div style="width: 400px">
                            <h3>{{$t('数据权限')}}</h3>
                            <Tree ref="tree1" @on-check-change="choiceDate" :data="dataList" :render="renderContent" show-checkbox></Tree>
                        </div>
                    </div>
                    <div class="flex-end-center">
                        <Button type="primary" style="margin-right: 10px" @click="submit">{{$t('确定')}}</Button>
                        <Button @click="cancel">{{$t('返回')}}</Button>
                    </div>
                </div>
            </Card>
        </Col>
        <myTree  :show="show"
                 :list="modalList"
                 :id="'deptId'"
                 :title="$t('选择部门')"
                 @message="onMessage"
        ></myTree>
    </Row>
</template>
<script>
import { sys } from '__util/api';
import handler from '__util/publicMethod';
import myTree from '__components/my-tree';
export default {
    data () {
        return {
            title: this.$t('新增'),
            id: undefined,
            obj: {},
            menuList: [],
            dataList: [],
            show: false,
            modalList: [],
            async: 0,
            ruleItem: {
                roleName: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' }
                ],
                deptName: [
                    { required: true, message: this.$t('不能为空'), trigger: 'change blur' }
                ]
            }
        }
    },
    components: {
        myTree
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.id = this.$route.params.id
            this.$axios(sys.role.deptList).then(res => {
                this.modalList = res.data || []
                this.dataList = this.trans(0, 'deptId', this.modalList)
                this.async++
                this.$emit('trri')
            })
            this.$axios(sys.role.menuList).then(res => {
                let list = res.data || []
                this.menuList = this.trans(0, 'menuId', list)
                this.async++
                this.$emit('trri')
            })
            this.$on('trri', (val) => {
                this.trri()
            })
            if (this.id === undefined) {
                this.create()
            } else {
                this.update()
            }
        },
        create () {
            this.title = this.$t('新增')
        },
        update () {
            this.title = this.$t('编辑')
            let obj = handler.clone(sys.role.roleInfo)
            obj.url = obj.url + '/' + this.id
            this.$axios(obj).then(res => {
                this.obj = res.data || {}
                this.async++
                this.$emit('trri')
            })
        },
        submit () {
            this.$refs['rule'].validate((valid) => {
                if (valid) {
                    let obj
                    if (this.id === undefined) {
                        obj = handler.clone(sys.role.roleSave)
                        obj.data = this.obj
                    } else {
                        obj = handler.clone(sys.role.roleUpdate)
                        obj.data = this.obj
                        obj.data.roleId = this.id
                    }
                    obj.data.menuIdList = this.filterId(this.menuList, 'menuId')
                    obj.data.deptIdList = this.filterId(this.dataList, 'deptId')
                    this.$axios(obj).then(res => {
                        this.$router.push('/sysRole')
                    })
                }
            });
        },
        cancel () {
            this.$router.push('/sysRole')
        },
        renderContent (h, { root, node, data }) {
            return h('div', {
                style: {
                    fontSize: '16px',
                    display: 'inline-block'
                },
                on: {
                    click: () => {
                        this.mCurrent = data.nodeKey
                        this.mCurrentData = data
                    }
                }
            }, [
                h('Icon', {
                    props: {
                        type: data.children.length !== 0 ? (data.expand ? 'ios-folder-outline' : 'ios-folder') : 'ios-paper-outline'
                    },
                    style: {
                        marginRight: '8px'
                    }
                }),
                h('span', data.title)
            ])
        },
        trans (id, key, list) {
            let arr = []
            for (let i = 0;i < list.length;i++) {
                if (id === list[i].parentId) {
                    let obj = {
                        title: this.$t(list[i].name),
                        expand: false,
                        children: this.trans(list[i][key], key, list)
                    }
                    obj[key] = list[i][key]
                    arr.push(obj)
                }
            }
            return arr
        },
        filterId (tree, key) {
            let arr = []
            let act = (list, k) => {
                for (let i of list) {
                    if (i.checked) {
                        arr.push(i[k])
                    }
                    if (i.children) {
                        act(i.children, key)
                    }
                }
            }
            act(tree, key)
            return arr
        },
        choiceId (tree, ids, key) {
            for (let i of tree) {
                if (this.choiceByArr(i[key], ids)) {
                    i.checked = true
                } else {
                    i.checked = false
                }
                if (i.children) {
                    this.choiceId(i.children, ids, key)
                }
            }
        },
        choiceByArr (id, arr) {
            for (let i of arr) {
                if (i === id) {
                    return true
                }
            }
            return false
        },
        trri () {
            if (this.async === 3) {
                this.choiceId(this.dataList, this.obj.deptIdList, 'deptId')
                this.choiceId(this.menuList, this.obj.menuIdList, 'menuId')
                this.choiceMenu()
                this.choiceDate()
            }
        },
        choiceModal () {
            this.show = true
        },
        onMessage (obj) {
            this.show = obj.isShow
            if (obj.data) {
                this.obj.deptId = obj.data.deptId
                this.obj.deptName = obj.data.title
            }
        },
        choiceMenu (val) {
            this.menuList.push({children: []})
            setTimeout(() => {
                this.menuList.pop()
            },0)
        },
        choiceDate (val) {
            this.dataList.push({children: []})
            setTimeout(() => {
                this.dataList.pop()
            },0)
        }
    }
}

</script>
