<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
.cell{
    height:50px;
    line-height:50px;
}
.mt5{
    margin-top: 5px;
}
.text-primary{
    color:#3399ff;
}

</style>
<template>
    <div>
        <Row v-if="$store.state.user.checkPerm('legal:withdrawlegalgroup:save')">
            <Button type="primary" @click="openAddGroup">{{$t('添加额度组')}}</Button>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('提现额度组')}}
                    </p>
                    <Table  :no-data-text="$t('暂无数据')"
                            :columns="groupsTitle"
                            :data="groups"
                    ></Table>
                </Card>
            </Col>
        </Row>




            <GroupForm @success='formSuccess' :show.sync='groupModal'  :form="addForm"></GroupForm>

        <Modal
            v-model="addModal"
            :title="$t('添加用户')"
            class-name="modal-clear-line"
            >
            <!-- <Table  refs="table0"
                    :no-data-text="$t('暂无数据')"
                    :data="currencyLimitList"
                    :columns="colsGeoup"
            ></Table> -->
            <Row style="margin-top: 15px; margin-bottom: 15px;">
                <Col span="5">
                    {{$t('额度组用户')}}
                </Col>
                <Col span="15">
                    {{addUserGroupName}}
                </Col>
            </Row>
            <Row style="margin-top: 15px; margin-bottom: 15px;">
                <Col span="5">
                    UID
                </Col>
                <Col span="15">
                    <Input v-model="addUidForm.uids" type="textarea" style="width: 100%" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('')"></Input>
                </Col>
            </Row>

            <div style="text-align: center;">
                <Button type="primary" @click="addUser">{{$t('保存')}}</Button>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>
<script>
import { legalTender } from '__util/api'
import {Button} from 'iview'
import GroupForm from './GroupForm'

export default {
    components:{
        GroupForm
    },
    created () {
        if(this.$store.state.user.checkPerm('legal:withdrawlegalgroup:list')){

            this.getList()
        }
    },
    methods: {
        formSuccess(){
            this.groupModal = false
            this.getList()
            // console.log('add success?')
        },
        async getList(){
            const res = await this.$axios(legalTender.grouplist)
            this.groups = res.data
        },
        openAddGroup(){
            this.groupModal = true
        },
        async del (item) {
            const obj = {...legalTender.groupDelete,data:{id:item.id,groupName:item.groupName}}
            const res = await this.$axios(obj)
            if(res.success){
                this.getList()
            }
        },
        edit (item) {
            this.addForm = item
            this.groupModal = true
            // this.limitGroup = true
        },
        addUserModal(item){
            this.addUserGroupName = item.groupName
            this.addUidForm.id = item.id
            this.addModal =  true
            // console.log(item)
        },
        async addUser(){
            if(Number(this.addUidForm.uids)!=this.addUidForm.uids){
                this.$Message.error('UID不合法')
                return false
            }
            const obj = {...legalTender.addUser, data:this.addUidForm}
            const res = await this.$axios(obj)

            if(res.success){
                this.addModal = false
                this.$Message.success('添加成功')
                this.getList()
            }
        }
    },
    watch:{
        addModal:function(v){
            if(!v){

                this.addUidForm.uids = ''
            }
        },
        groupModal:function(v){
            if(!v){
                this.addForm = {}
            }
        }
    },
    data () {
        return {
            addUserGroupName:'',
            groupModal:false,
            addModal:false,
            addForm:{},
            addUidForm:{},
            groups:[],
            // addModal:false,

            currencySwitch: false,
            limitGroup: false,
            groupsTitle: [
                {
                    renderHeader: () =>this.$t('用户组名称'),
                    align: 'center',
                    render: (h, params) => <div>{params.row.groupName}</div>
                },
                {
                    renderHeader: () => this.$t('限制条件'),
                    render: (h, params) => (
                        <div>
                            <div class='cell'>{this.$t('1日累计')}</div>
                            <div class='cell'>{this.$t('1月累计')}</div>
                        </div>
                    )
                },
                {
                    renderHeader: () =>this.$t('韩元限额'),
                    render: (h, params) => (
                        <div>
                            <div class='cell'>{params.row.dailyAmount}</div>
                            <div class='cell'>{params.row.monthlyAmount}</div>
                        </div>
                    )


                },
                {
                    renderHeader: () => this.$t('备注'),
                    align: 'center',
                    render: (h, params) => <div>{params.row.remark}</div>
                },
                {
                    renderHeader: () => this.$t('用户数'),
                    align: 'center',
                    render: (h, params) => <div>{params.row.count}</div>

                },
                {
                    renderHeader: () => this.$t('操作'),
                    align: 'center',
                    render: (h, params) => (
                        <div>
                            <div >
                                {this.$store.state.user.checkPerm('legal:withdrawlegalgroup:addUser')?<Button type="primary" size="small" onClick={()=>this.addUserModal(params.row)}>{this.$t('增加')}</Button>:null}
                            </div>

                            <div class='mt5'>
                                {this.$store.state.user.checkPerm('legal:withdrawlegalgroup:update')?<Button type="primary" size="small" onClick={()=>this.edit(params.row)}>{this.$t('修改')}</Button>:null}
                            </div>
                            <div class='mt5'>
                                {this.$store.state.user.checkPerm('legal:withdrawlegalgroup:delete')?<Button type="error" size="small" onClick={()=>{
                                    this.modifyId  = params.row.id
                                    this.$Modal.confirm({
                                        title: this.$t('确认'),
                                        content: this.$t('确定删除')+'<span class="text-primary">'+params.row.groupName+'组?</span',
                                        onOk: ()=>this.del(params.row)
                                    })
                                }}>{this.$t('删除')}</Button>:null}
                            </div>
                        </div>

                    )
                }
            ],
            colsGeoup: [
                {
                    renderHeader: () => {
                        return this.$t('用户组名称')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div',{
                            style: {
                                height: '150px',
                                lineHeight: '150px'
                            }
                        }, params.row.currency)
                    }
                },
                {
                    renderHeader: () => {
                        return this.$t('限制条件')
                    },
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '150px'
                            }
                        },
                        [
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, this.$t('单次限额')),
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
                        return this.$t('人民币限额')
                    },
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '150px'
                            }
                        },
                        [
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, params.row.singleAmount),
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
                        return this.$t('A类地址')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '150px'
                            }
                        },
                        [
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, params.row.singleAmount),
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
                        return this.$t('非A类地址')
                    },
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '150px'
                            }
                        },
                        [
                            h('div', {
                                style: {
                                    height: '50px',
                                    lineHeight: '50px'
                                }
                            }, params.row.singleAmount),
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

                }
            ],
            name: ''
        }
    },

}

</script>
