<template>
    <Card>
        <h2 slot="title">
            {{$t('拒绝理由列表')}}
        </h2>
        <div slot="extra">
            <Button type="primary" @click="showModal">{{$t('添加理由')}}</Button>
        </div>
        <div style="position: relative;">
            <RefuseTable v-if="dataList" :dataList="dataList" @update="search"/>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

        <Modal v-model="modalShow"
               :title="modalTitle"
               @on-cancel="close">
            <Form ref="formReason" :model="formData"  :label-width="120" :rules="ruleInline">
                <FormItem prop="locReason" :label="$t('拒绝理由-本地')">
                    <Input v-model="formData.locReason"/>
                </FormItem>
                <FormItem prop="cnReason" :label="$t('拒绝理由-中文')">
                    <Input v-model="formData.cnReason"/>
                </FormItem>
                <FormItem prop="enReason" :label="$t('拒绝理由-英文')">
                    <Input v-model="formData.enReason"/>
                </FormItem>
                <FormItem prop="sort" :label="$t('排序')">
                    <InputNumber :min="0" v-model="formData.sort"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="close">{{$t('取消')}}</Button>
                <Button type="primary" :loading="modalLoading" @click="vaditeSave">{{$t('确定')}}</Button>
            </div>
        </Modal>
    </Card>
</template>

<script>
    import RefuseTable from './refuseTable';

    import {recharge} from '__util/api';

    export default {
        name: "refuseConfig",
        components: {
            RefuseTable
        },
        mounted() {
            this.search();
        },
        methods: {
            search() {
                if (this.$store.state.user.checkPerm('withdraw:refuse:list')) {
                    this.spinShow = true;
                    this.$axios(recharge.refuseList).then((res) => {
                        let list = res.data.list

                        this.dataList = list.map((item) => {
                                item.reasons = JSON.parse(item.reasons)
                                item.cnReason = item.reasons.cn;
                                item.enReason = item.reasons.en;
                                item.locReason = item.reasons.loc;
                                console.log('ssss')
                                return item
                            });
                        this.spinShow = false
                    }).catch((e)=>{
                        this.spinShow = false
                    })
                }
            },
            showModal() {
                this.modalShow = true;
                this.$refs['formReason'].resetFields();
            },
            vaditeSave() {
                this.modalLoading = true;
                this.$refs['formReason'].validate((valid) => {
                    if (valid) {
                        this.save();
                    } else {
                        this.modalLoading = false;
                    }
                })
            },
            save() {
                if(this.$store.state.user.checkPerm('withdraw:refuse:add')) {
                let params = {...this.formData};
                params.reasons.cn = params.cnReason;
                params.reasons.en = params.enReason;
                params.reasons.loc = params.locReason;
                params.reasons = JSON.stringify(params.reasons);
                delete params.cnReason;
                delete params.enReason;
                recharge.refuseAdd.data = {...params};
                this.$axios(recharge.refuseAdd).then((res) => {
                    this.modalShow=false;
                    this.modalLoading = false;
                    this.$Modal.success({title:this.$t('成功'),content:this.$t('添加成功')});
                    this.search();
                })
                }else {
                    this.$Modal.error(this.$t('没有权限'))
                }
            },
            close() {
                this.modalShow = false;
                this.$refs['formReason'].resetFields();
            }
        },
        data() {
            return {
                spinShow: false,
                modalShow: false,
                modalTitle: this.$t('添加拒绝理由'),
                modalLoading:false,
                dataList: null,
                ruleInline:{
                    cnReason: [
                        {type:'string', required: true, message: this.$t('请填写中文理由'), trigger: 'blur' }
                    ],
                    locReason: [
                        {type:'string', required: true, message: this.$t('请填写理由'), trigger: 'blur' }
                    ],
                    enReason: [
                        {type:'string', required: true, message: this.$t('请填写英文理由'), trigger: 'blur' }
                    ],
                    sort: [
                        {type:'number', required: true, message: this.$t('请填写排序'), trigger: 'blur' }
                    ],
                },
                formData: {
                    sort:null,
                    reasons:{}
                }
            }
        }
    }
</script>

<style scoped>
    .trial-outer-container {
        min-height: 350px;
    }
    .trial-container {
        background-color: #ffffff;
        border: 1px solid #E6EAEE;
        position: relative;
    }
    .trial-container > h2 {
        font-weight: bold;
        font-size: 16px;
        padding: 10px 20px;
    }
    .trial-pagition {
        text-align: right;
        padding: 10px;
    }
</style>
