<template>
    <div class="trial-container">
        <h2>提币审核列表
            <Button type="primary">全部关闭</Button>
            <Button type="primary">全部开启</Button>
        </h2>
        <Form action="" id="gaga">
            <Table :columns="columns" :data="data1"></Table>
        </Form>
        <Button type="primary" style="text-align: center;">保存</Button>
    </div>
</template>

<script>
    export default {
        name: "auto-switch",
        methods:{
            getOperation(name){
                return ''
            }
        },
        data() {
            return {
                animal:'金斑蝶',
                data1:[
                    {
                        name: 'BTC',
                        value: 1
                    },

                    {
                        name: 'BTC2',
                        value: 2
                    }
                ],
                columns:[
                    {
                        title: '币种',
                        key: 'name'
                    },
                    {
                        title: '操作',
                        render(h, params) {
                            return h(
                                'RadioGroup',
                                {
                                    props:{
                                        'v-model': params.row.value
                                    }
                                },
                                [
                                    h('Radio', {
                                        props: {
                                            value: 1,
                                            name: params.row.name
                                        },
                                        style: {
                                            marginRight: '15px'
                                        }
                                    }, '开'),
                                    h('Radio', {
                                        props: {
                                            value: 2,
                                            name: params.row.name
                                        },
                                        style: {
                                            marginRight: '15px'
                                        }
                                    }, '关'),
                                ]
                            );
                        }
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
