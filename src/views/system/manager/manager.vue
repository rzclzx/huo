<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <div>
        <div class="flex-start-center" style="margin-top: 20px">
            <div style="width: 260px;margin-right: 10px">
                <Input></Input>
            </div>
            <Button style="margin-right: 10px">查询</Button>
            <Button type="primary" style="margin-right: 10px">新增</Button>
            <Button type="primary" style="margin-right: 10px">修改</Button>
            <Button type="primary" style="margin-right: 10px">删除</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        财务记录
                    </p>
                    <Table  refs="table0"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                    <Row>
                        <Col span="24">
                            <div style="margin-top: 10px" class="flex-end-center">
                                <Page show-elevator :total="100" size="small" show-total>
                                    <slot>
                                        {{ $t('共') + ' ' + coinPage.total + ' ' + $t('条') }}
                                    </slot>
                                </Page>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="showModal" width="800" :title="title">
            <Form class="modal-form" ref="modal" :label-width="80">
                <FormItem label="用户名">
                    <Input type="text" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input type="text" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input type="text" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input type="text" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input type="text" placeholder=""></Input>
                </FormItem>
                <FormItem label="角色">
                    <RadioGroup>
                        <Radio label="0">
                            <span>关闭</span>
                        </Radio>
                        <Radio label="1">
                            <span>开启</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'finance',
    data () {
        return {
            table0Date: [],
            table0Column: [],
            title: '新增',
            showModal: false
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            for (let i = 0;i < 7;i++) {
                this.table0Date.push({
                    name: '张' + i,
                    sex: i % 2 === 0 ? '男' : '女',
                    work: '工程师' + i
                })
            }
            this.table0Column = column0(this)
        },
        toggleModal () {
            this.showModal = !this.showModal
        },
        choiceCell (index) {
            this.modalCurrent = index
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
        title: '用户ID',
        align: 'left',
        key: 'name'
    },
    {
        title: '用户名',
        align: 'left',
        key: 'sex'
    },
    {
        title: '所属部门',
        align: 'left',
        key: 'sex'
    },
    {
        title: '邮箱',
        align: 'left',
        key: 'sex'
    },
    {
        title: '手机号',
        align: 'left',
        key: 'sex'
    },
    {
        title: '状态',
        align: 'left',
        render: (h, params) => {
            return h('Button', {
                props: {
                    type: 'primary'
                }
            }, '正常')
        }
    },
    {
        title: '创建时间',
        align: 'left',
        key: 'sex'
    }
]
}
</script>
