<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <Row>
        <Col>
            <Card>
                <p slot="title">
                    {{ title }}
                </p>
                <Form :model="obj" :rules="ruleItem" class="modal-form" ref="rule" :label-width="80" style="width: 600px">
                    <FormItem :label="$t('部门名称')" prop="name">
                        <Input v-model="obj.name" type="text" :placeholder="$t('部门名称')" :maxlength="32"></Input>
                    </FormItem>
                    <FormItem :label="$t('上级部门')" prop="parentName">
                        <Input @on-focus="choiceModal" v-model="obj.parentName" type="text" :placeholder="$t('所属部门')"></Input>
                    </FormItem>
                    <FormItem :label="$t('排序号')" prop="orderNum">
                        <Input v-model="obj.orderNum" type="text" :placeholder="$t('排序号')" :maxlength="10"></Input>
                    </FormItem>
                    <div class="flex-end-center">
                        <Button @click="submit" type="primary" style="margin-right: 10px">{{$t('确定')}}</Button>
                        <Button @click="cancel">{{$t('返回')}}</Button>
                    </div>
                </Form>
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
            show: false,
            modalList: [],
            ruleItem: {
                name: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' }
                ],
                parentName: [
                    { required: true, message: this.$t('不能为空'), trigger: 'change blur' }
                ],
                orderNum: [
                    { required: true, message: this.$t('不能为空'), trigger: 'blur' },
                    { pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: this.$t('只能为正整数'), trigger: 'blur' }
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
            this.$axios(sys.dept.deptList).then(res => {
                this.modalList = res.data
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
            let obj = handler.clone(sys.dept.deptInfo)
            obj.url = obj.url + '/' + this.id
            this.$axios(obj).then(res => {
                this.obj = res.data || {}
                this.obj = handler.objChildrenToString(this.obj)
            })
        },
        submit () {
            this.$refs['rule'].validate((valid) => {
                if (valid) {
                    let obj
                    if (this.id === undefined) {
                        obj = handler.clone(sys.dept.deptSave)
                        obj.data = this.obj
                    } else {
                        obj = handler.clone(sys.dept.deptUpdate)
                        obj.data = this.obj
                        obj.data.deptId = this.id
                    }
                    this.$axios(obj).then(res => {
                        this.$router.push('/sysDept')
                    })
                }
            });
        },
        cancel () {
            this.$router.push('/sysDept')
        },
        choiceModal () {
            this.show = true
        },
        onMessage (obj) {
            this.show = obj.isShow
            if (obj.data) {
                this.obj.parentId = obj.data.deptId
                this.obj.parentName = obj.data.title
            }
        }
    }
}

</script>
