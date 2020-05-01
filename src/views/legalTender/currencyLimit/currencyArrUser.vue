<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
<template>
    <div>
        <Row>
            <Input v-model="uid" :placeholder="$t('UID')" style="width: 150px"></Input>
            <Select clearable v-model="groupId" :placeholder="$t('额度组')" style="width: 150px" v-autoLocale>
                <Option v-for="item in groupArr" :value="item.groupId" :key="item.groupName">{{ item.groupName }}</Option>
            </Select>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('legal:withdrawlegalgroupuser:list')">{{$t('查询')}}</Button>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('额度组用户')}}
                    </p>
                    <Table  :no-data-text="$t('')"
                            :columns="currencyLimitTitle"
                            :data="data"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Modal
            v-model="addUserModel"
            :title="$t('添加用户')"
            class-name="modal-clear-line"
            >
            <Form :model="userFormItem" :label-width="110" :rules="formRules">
                <FormItem prop="groupName" :label="$t('用户组名称')">
                    <Select v-model="userArrVal" :placeholder="$t('用户组')" style="width: 150px" v-autoLocale>
                        <Option v-for="item in userArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="uidArr" :label="$t('UID')">
                    <Input v-model="userFormItem.uidArr" :placeholder="$t('用户UID,以英文逗号分隔')" type="textarea" class="m-input"></Input>
                </FormItem>
            </Form>
            <div style="text-align: center;">
                <Button type="primary" @click="addUserSave">{{$t('保存')}}</Button>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>
<script>
import { legalTender } from '__util/api';

export default {
    data () {
        return {
            // 添加用户表单
            userFormItem: {},
            // 添加用户表单验证规则
            formRules: {},
            // 添加用户显示按钮
            addUserModel: false,
            // 查询UID
            sreachID: '',
            // 查询用户组
            userArrVal: '',
            // 用户组列表
            groupArr:[
                // {
                //     value: 'all',
                //     label: '全部'
                // },
                // {
                //     value: 'REM',
                //     label: '人民币'
                // },
                // {
                //     value: 'MEIYUAN',
                //     label: '美元'
                // }
            ],
            // 列表表头
            currencyLimitTitle: [
                {
                    renderHeader: () => {
                        return this.$t('UID')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div',{
                            style: {
                                height: '100px',
                                lineHeight: '100px'
                            }
                        }, params.row.userId)
                    }
                },
                {
                    renderHeader: () => {
                        return this.$t('额度组')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div',{
                            style: {
                                height: '100px',
                                lineHeight: '100px'
                            }
                        }, params.row.groupName)
                    }
                },
                {
                    renderHeader: () => {
                        return this.$t('限制条件')
                    },
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '100px'
                            }
                        },
                        [
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, this.$t('1日累计')),
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, this.$t('1月累计'))
                        ])
                    }
                },
                {
                    renderHeader: () => {
                        return this.$t('韩元限额')
                    },
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '100px'
                            }
                        },
                        [
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, params.row.dailyAmount),
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, params.row.monthlyAmount)
                        ])
                    }
                },
                {
                    renderHeader: () => {
                        return this.$t('备注')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div',{
                            style: {
                                height: '100px',
                                paddingTop: '10px'
                            }
                        }, params.row.remark)
                    }
                },
                {
                    renderHeader: () => {
                        return this.$t('操作')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div',{
                            style: {
                                height: '100px',
                                lineHeight: '100px'
                            }
                        },
                        [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    disabled: !this.$store.state.user.checkPerm('legal:withdrawlegalgroupuser:delete')
                                },
                                on: {
                                    click: () => {
                                        this.modifyId  = params.row.id
                                        this.$Modal.confirm({
                                            title: this.$t('确认'),
                                            content: this.$t('确定删除'),
                                            onOk: ()=>this.del(params.row)
                                        })
                                    }
                                }
                            }, this.$t('删除'))
                        ])
                    }

                }
            ],
            userArr:[],
            data:[],
            groupId:'',
            uid:'',
            // form:{},
            name: ''
        }
    },
    mounted () {
        // this.getList()
    },
    methods: {
        search(){
            this.getList()
        },
        async getList(){
            console.log(this.uid)
            const obj = {
                data:{ 
                    uid:this.uid?Number(this.uid):'',
                    groupId:this.groupId?Number(this.groupId):''
                }, 
                ...legalTender.limitSetList
            }
            const { data=[] } = await this.$axios(obj)

            let groupArr = []
            let o = {}
            data.forEach(v=>{
                if(!o[v.groupId]){
                    groupArr.push(v)
                    o[v.groupId] = true
                }
            })
            this.groupArr = groupArr
            // console.log(data)
            // console.log('xxx')
            // console.log(123,data)
            this.data = data
            // console.log(data)
        },
        // 确认删除
        async del (item) {
            const data = {
                id:item.id,
                uid:item.userId
            }
            const res = await this.$axios({ data, ...legalTender.limitSetDelete})
            this.getList()
            
            
        },
        // 添加用户按钮
        addUser () {
            this.addUserModel = true
        },
        // 保存新增用户组
        addUserSave () {

        }
    }
}

</script>
