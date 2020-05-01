<style lang="less" scope>
@import '../../../../assets/style/layout.less';
@import '../../../../assets/style/public.less';
</style>
<template>
    <div>
        <div class="flex-start-center">
            <div style="margin-right: 10px">
                开启自动审核：        
            </div>
            <RadioGroup v-model="radio">
                <Radio label="0">
                    <span>关闭</span>
                </Radio>
                <Radio label="1">
                    <span>开启</span>
                </Radio>
            </RadioGroup>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select" style="overflow: hidden; padding-bottom: 20px">
                    <div slot="title" class="flex-between-center">
                        <p>财务记录</p>
                        <div class="flex-between-center">
                            <Button type="primary" style="margin-right: 10px">全部开启</Button>
                            <Button type="primary">全部关闭</Button>
                        </div>  
                    </div>
                    <Row>
                        <Col span="8">
                            <div style="width: 80%;margin: 0 auto;">
                                <Table  refs="table0"
                                        :data="table0Date"
                                        :columns="table0Column"
                                ></Table>
                            </div>
                        </Col>
                        <Col span="8">
                            <div style="width: 80%;margin: 0 auto;">
                                <Table  refs="table1"
                                        :data="table0Date"
                                        :columns="table0Column"
                                ></Table>
                            </div>
                        </Col>
                        <Col span="8">
                            <div style="width: 80%;margin: 0 auto;">
                                <Table  refs="table2"
                                        :data="table0Date"
                                        :columns="table0Column"
                                ></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style="text-align: center">
                            <Button type="primary" size="large" style="margin-top: 20px">保存</Button>
                        </Col>  
                    </Row>  
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
            table0Column: [],
            radio: 0
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            for (let i = 0;i < 5;i++) {
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
            title: '限额',
            align: 'left',
            render: (h, params) => {
                return h('RadioGroup', [
                    h('Radio', {
                        props: {
                            label: 0
                        }
                    }, [
                        h('span', '关闭')
                    ]),
                    h('Radio', {
                        props: {
                            label: 1
                        }
                    }, [
                        h('span', '开启')
                    ])
                ])
            }
        }
    ]
}
</script>