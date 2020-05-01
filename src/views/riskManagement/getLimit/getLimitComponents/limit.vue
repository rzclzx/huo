<style lang="less" scope>
@import '../../../../assets/style/layout.less';
@import '../../../../assets/style/public.less';
</style>
<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <div>描述</div>
                    <div>描述</div>
                    <div>描述</div>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <div slot="title" class="flex-between-center">
                        <p>自动提币审核设置</p>
                        <Button type="primary">保存全部</Button>
                    </div> 
                    <Table  refs="table0"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            table0Date: [],
            table0Column: []
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            for (let i = 0;i < 1;i++) {
                this.table0Date.push({
                    name: '张' + i,
                    sex: i % 2 === 0 ? '男' : '女',
                    work: '工程师' + i
                })
            }
            this.table0Column = column0(this)
        }
    }
}

const column0 = (vm) => {
    return [
        {
            title: '币种',
            align: 'left',
            key: 'name'
        },
        {
            title: '旧地址免审额度',
            align: 'left',
            render: (h, params) => {
                return h('Input')
            }
        },
        {
            title: '新地址小额免审额度',
            align: 'left',
            render: (h, params) => {
                return h('Input')
            }
        },
        {
            title: '新地址证件免审额度',
            align: 'left',
            render: (h, params) => {
                return h('Input')
            }
        },
        {
            title: '操作',
            align: 'left',
            render: (h, params) => {
                return h('Button', {
                    props: {
                        type: 'primary'
                    },
                    on: {
                        click: () => {
    
                        }
                    }
                }, '保存')
            }
        }
    ]
}
</script>