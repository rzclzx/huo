<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('额度触发限制')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="data"
                            :columns="tableColumn"
                    ></Table>
                </Card>
            </Col>
        </Row>

    <Modal
        v-model="confirmModal"
        :title="$t('确认')"
        @on-cancel="cancel">

        <p>{{$t('将')}}
            <span class="text-primary"></span>
            {{$t('提现额度触发设置为：')}}
        </p>
        <Table  :columns="columns" :data="confirmInfo" style="width: 100%;margin:30px 0;"></Table>

        <div slot="footer">
            <Button type="primary" @click='cancel'>{{$t('取消')}}</Button>
            <Button type="primary" @click='confirm'>{{$t('确定')}}</Button>
        </div>


    </Modal>



    </div>
</template>
<script>
import { legalTender } from '__util/api';


export default {
    data () {
        return {
            confirmModal:false,
            tableColumn: [],
            data:[],
            confirmInfo:[],
            obj:{},
            columns:[
                {
                    renderHeader: (h) => {
                        return this.$t('限制条件')
                    },
                    key: 'text'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('Level1')
                    },
                    key: 'level1'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('Level2')
                    },
                    key: 'level2'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('Level3')
                    },
                    key: 'level3'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('Level4')
                    },
                    key: 'level4'
                },

            ]
        }
    },
    created () {
        this.init()
        if(this.$store.state.user.checkPerm('legal:withdrawlegalsetting:list')){
            this.getList()
        }
    },
    methods: {
        confirm(){
            this.$axios(this.obj).then(res => {
                this.$Modal.info({
                    content: this.$t('修改成功')
                })
                this.refresh()
                this.confirmModal = false

            }).catch(res => {
                this.$Modal.error({
                    content: this.$t('errorCode.' + res)
                })
                this.refresh()
                this.confirmModal = false

            })

        },
        cancel(){
            this.confirmModal = false
            this.$emit('cancel')
        },
        init () {
            this.tableColumn = column(this)
        },
        async getList(){
            let { data=[] } = await this.$axios(legalTender.userLimitList)
            if(data.currency){
                data = [data]
            }
            this.data = data
        },
        refresh () {
            this.getList()
        }
    }
}

const column = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('法币名称')
        },
        align: 'left',
        render: (h, params) => {
            return h('div',{
                style: {
                    height: '100px',
                    lineHeight: '100px'
                }
            }, params.row.currencyName+'/'+params.row.currency)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('限制条件')
        },
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '100px'
                }
            }, [
                // h('div', {
                //     style: {
                //         height: '50px',
                //         lineHeight: '50px'
                //     }
                // }, vm.$t('单次限额')),
                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, vm.$t('1日累计')),
                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, vm.$t('1月累计'))
            ])
        }
    },
    {
        title: 'Level1',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '100px'
                }
            }, [
                // getInput(vm, h, params, 'singleAmount', 'level1'),
                getInput(vm, h, params, 'dailyLevel1'),
                getInput(vm, h, params, 'monthlyLevel1')
            ])
        }
    },
    {
        title: 'Level2',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '100px'
                }
            }, [
                getInput(vm, h, params, 'dailyLevel2'),
                getInput(vm, h, params, 'monthlyLevel2')
            ])
        }
    },
    {
        title: 'Level3',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '100px'
                }
            }, [
                getInput(vm, h, params, 'dailyLevel3'),
                getInput(vm, h, params, 'monthlyLevel3')
            ])
        }
    },
    {
        title: 'Level4',
        align: 'left',
        render: (h, params) => {
            return h('div', {
                style: {
                    height: '100px'
                }
            }, [
                getInput(vm, h, params, 'dailyLevel4'),
                getInput(vm, h, params, 'monthlyLevel4')
            ])
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('操作')
        },
        align: 'left',
        render: (h, params) => {

            let arr = []
        if (vm.$store.state.user.checkPerm('legal:withdrawlegalsetting:update')) {

                arr = [

                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, [
                    getButton(vm, h, params, 'dailyLevel', 'day')
                ]),
                h('div', {
                    style: {
                        height: '50px',
                        lineHeight: '50px'
                    }
                }, [
                    getButton(vm, h, params, 'monthlyLevel', 'month')
                ])
            ]
            }
            return h('div', {
                style: {
                    height: '100px'
                }
            }, arr)
        }
    }
]
}

const getInput = (vm, h, params, type) => {
    return h('div', {
        style: {
            height: '50px',
            lineHeight: '50px'
        }
    }, [
        h('Input', {
            props: {
                value: params.row[type],
                disabled: !vm.$store.state.user.checkPerm('legal:withdrawlegalsetting:update')
            },
            style: {
                height: '30px',
                lineHeight: '30px'
            },
            on: {
                input: (val) => {
                    params.row[type] = val
                },
                'on-blur': () => {
                    if (params.row[type] === '') {
                        params.row[type] = null
                    }
                }
            }
        })
    ])
}

const validate = (vm, str='') => {
    if (str === null || str === '') {
        return true
        // vm.$Modal.error({
        //     content: vm.$t('条件不能为空')
        // })
        // return false
    }
    str = str.toString()
    if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)|^[+]{0,1}(\d+)(\,\d+)+$/.test(str)) {
        vm.$Modal.error({
            content: vm.$t('必须为整数')
        })
        return false
    }
    if (str.indexOf('.') > 0) {
        let arr = str.split('.')
        if (arr[0].length > 8) {
            vm.$Modal.error({
                content: vm.$t('小数点前最多8位')
            })
            return false
        }
        if (arr[1].length > 4) {
            vm.$Modal.error({
                content: vm.$t('小数点后最多4位')
            })
            return false
        }
    } else {
        if (str.length > 8) {
            vm.$Modal.error({
                content: vm.$t('数字最多8位')
            })
            return false
        }
    }
    return true
}

const getButton = (vm, h, params, type, code) => {
    return h('Button', {
        props: {
            type: 'primary',
            disabled: !vm.$store.state.user.checkPerm('legal:withdrawlegalsetting:update')
        },
        on: {
            click: () => {
                let obj = {...legalTender.userLimitUpdate}
                // console.log(params)
                // console.log(obj)
                console.log(code)
                let valid = false
                const item = params.row

                // if(code=='day'){

                    if (validate(vm, params.row.dailyLevel1) && validate(vm, params.row.dailyLevel2) && validate(vm, params.row.dailyLevel3) && validate(vm, params.row.dailyLevel4)) {
                        if (validate(vm, params.row.monthlyLevel1) && validate(vm, params.row.monthlyLevel2) && validate(vm, params.row.monthlyLevel3) && validate(vm, params.row.monthlyLevel4)) {
                        
                        
                        valid = true;

                        const monthArr = ['1','2','3','4']
                        monthArr.some((v,i)=>{
                            const prefix = 'monthlyLevel'
                            if(v!='4'){
                                if(Number(params.row[prefix+v]) &&Number(params.row[prefix+(i+2)])&& Number(params.row[prefix+v])>Number(params.row[prefix+(i+2)])){

                                    vm.$Modal.warning({
                                        title: '错误',
                                        content: `
                                            <p>额度设置需满足Level ${i+2}>=Level${v}</p>
                                            <p>设置无法生效，请返回重新设置</p>
                                        `
                                    });
                                    valid = false
                                    return true
                                }
                            }
                        })

                        const dayArr = ['1','2','3','4']
                        dayArr.some((v,i)=>{
                            const prefix = 'dailyLevel'
                            if(v!='4'){
                                if(Number(params.row[prefix+v])&& Number(params.row[prefix+(i+2)]) && Number(params.row[prefix+v])>Number(params.row[prefix+(i+2)])){

                                    vm.$Modal.info({
                                        title: '错误',
                                        content: `
                                            <p>额度设置需满足Level ${i+2}>=Level${v}</p>
                                            <p>设置无法生效，请返回重新设置</p>
                                        `
                                    });
                                    valid = false
                                    return true
                                }
                            }
                        })
                        }
                        
                        // if()
                    }
                // }
                // if(code=='month'){
                //     if (validate(vm, params.row.monthlyLevel1) && validate(vm, params.row.monthlyLevel2) && validate(vm, params.row.monthlyLevel3) && validate(vm, params.row.monthlyLevel4)) {
                //     if (validate(vm, params.row.dailyLevel1) && validate(vm, params.row.dailyLevel2) && validate(vm, params.row.dailyLevel3) && validate(vm, params.row.dailyLevel4)) {
                        
                //         valid = true

                //     }

                //     }
                // }

                ['1','2','3','4'].some(v=>{


                    if(Number(item['monthlyLevel'+v])<Number(item['dailyLevel'+v])){
                        vm.$Modal.warning({
                            title: '错误',
                            content: `
                                <p>额度设置需满足1月累计Level${v}>=1日累计Level${v}</p>
                                <p>设置无法生效，请返回重新设置</p>
                            `
                        });
                        valid = false
                        return true

                    }

                })

                if (valid) {

                    vm.confirmModal = true
                   console.log(params.row.currency)
                    // if(params.row.monthlyLevel1>params.row.dailyLevel1){}
                    obj.data = {
                        currency: params.row.currency,
                        // operator: code=='day'?0:1,
                        dailyLevel1: params.row.dailyLevel1,
                        dailyLevel2: params.row.dailyLevel2,
                        dailyLevel3: params.row.dailyLevel3,
                        dailyLevel4: params.row.dailyLevel4,
                        monthlyLevel1: params.row.monthlyLevel1,
                        monthlyLevel2: params.row.monthlyLevel2,
                        monthlyLevel3: params.row.monthlyLevel3,
                        monthlyLevel4: params.row.monthlyLevel4,
                    }
                    vm.obj = obj
                    vm.confirmInfo = [
                        {
                            text:vm.$t('1日累计'),
                            level1:params.row.dailyLevel1||'-',
                            level2:params.row.dailyLevel2||'-',
                            level3:params.row.dailyLevel3||'-',
                            level4:params.row.dailyLevel4||'-',
                        },
                        {
                            text:vm.$t('1月累计'),
                            level1:params.row.monthlyLevel1||'-',
                            level2:params.row.monthlyLevel2||'-',
                            level3:params.row.monthlyLevel3||'-',
                            level4:params.row.monthlyLevel4||'-',
                        },

                    ]

                }
            }
        }
    }, vm.$t('修改'))
}
</script>
