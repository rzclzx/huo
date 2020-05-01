<template>
    <div>
        <Table :no-data-text="$t('暂无数据')" :columns="columns" :data="localDataList"></Table>
        <Modal v-model="modalShow"
               :title="modalTitle"
               @on-cancel="close"
        >
            <Form ref="formReason" :model="formData" :label-width="120" :rules="ruleInline">
                <FormItem prop="locReason" :label="$t('拒绝理由-本地')">
                    <Input v-model="formData.locReason"/>
                </FormItem>
                <FormItem prop="cnReason" :label="$t('拒绝理由-中文')">
                    <Input v-model="formData.cnReason" />
                </FormItem>
                <FormItem prop="enReason" :label="$t('拒绝理由-英文')">
                    <Input v-model="formData.enReason" />
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
    </div>
</template>

<script>
    import {recharge} from '__util/api';

    export default {
        name: "refuse-table",
        props: {
            dataList: Array
        },
        watch: {
            '$props': {
                handler: function (val, oldVal) {
                    this.localDataList = [...this.dataList]
                },
                deep: true
            }
        },
        methods: {
            edit(row) {
                this.formData.cnReason = row.cnReason;
                this.formData.enReason = row.enReason;
                this.formData.locReason = row.locReason;
                this.formData.sort = row.sort;
                this.formData.id = row.id;
                this.modalShow = true;
            },
            showModal() {
                this.modalShow = true;
            },
            vaditeSave() {
                this.modalLoading = true;
                this.$refs['formReason'].validate((valid) => {
                    if (valid) {
                        this.save();
                    } else {
                        this.modalLoading = false;
                        this.$Message.error('Fail!');
                    }
                })
            },

            dataUpdate(formData, type) {
                this.localDataList = this.localDataList
                    .filter((item) => {
                        return type === 'delete' ? item.id !== formData.id : true;
                    })
                    .map((item) => {
                        if (item.id === formData.id) {
                            item.cnReason = formData.reasons.cn;
                            item.enReason = formData.reasons.en;
                            item.locReason = formData.reasons.loc;
                            item.reasons = formData.reasons;
                            item.sort = formData.sort;
                        }
                        return item
                    });
                this.formData = {sort: null, reasons: {}}
            },
            save() {
                if (this.$store.state.user.checkPerm('withdraw:refuse:edit')) {
                    let params = {...this.formData};
                    params.reasons.cn = params.cnReason;
                    params.reasons.en = params.enReason;
                    params.reasons.loc = params.locReason;
                    params.reasons = JSON.stringify(params.reasons);
                    delete params.cnReason;
                    delete params.enReason;
                    recharge.refuseEdit.data = {...params};
                    this.$axios(recharge.refuseEdit).then((res) => {
                        this.modalShow = false;
                        this.modalLoading = false;
                        this.$Modal.success({title: this.$t('成功'), content: this.$t('编辑成功')})
                        // this.dataUpdate(this.formData);
                        this.$emit('update')
                    })
                }
            },
            close() {
                this.modalShow = false;
            }
        },
        created(){
            document.getElementsByTagName('body')['0'].className = 'l-del';
        },
        data() {
            return {
                modalTitle: this.$t('编辑拒绝理由'),
                modalShow: false,
                localDataList: this.dataList,
                modalLoading: false,
                ruleInline: {
                    cnReason: [
                        {type: 'string', required: true, message: this.$t('请填写中文理由'), trigger: 'blur'}
                    ],
                    locReason: [
                        {type:'string', required: true, message: this.$t('请填写理由'), trigger: 'blur' }
                    ],
                    enReason: [
                        {type: 'string', required: true, message: this.$t('请填写英文理由'), trigger: 'blur'}
                    ],
                    sort: [
                        {type: 'number', required: true, message: this.$t('请填写排序'), trigger: 'blur'}
                    ],
                },
                formData: {
                    sort: null,
                    reasons: {}
                },

                delConfig: {
                    title: this.$t('删除'),
                    content: this.$t('确认删除该理由么') + '？',
                    okText: this.$t('确定'),
                    cancelText: this.$t('取消'),
                    onOk: () => {
                        if (this.$store.state.user.checkPerm('withdraw:refuse:del')) {
                            recharge.refuseDel.params.id = this.formData.id;
                            this.$axios(recharge.refuseDel).then((res) => {
                                this.dataUpdate(this.formData, 'delete');
                                setTimeout(() => {
                                    return this.$Modal.success({title: this.$t('成功'), content: this.$t('删除成功')});
                                }, 400)
                            })
                        } else {
                            this.$Modal.error({content: this.$t('无权限')})
                        }
                    },
                    onCancel: () => {
                        this.delReasonId = null;
                    }
                },
                columns: [
                    {
                        type: 'index',
                        key: 'id',
                        renderHeader:() => {
                            return this.$t('编号')
                        }
                    },
                    {
                        key: 'locReason',
                        renderHeader:() => {
                            return this.$t('拒绝理由')
                        }
                    },
                    {
                        key: 'cnReason',
                        renderHeader:() => {
                            return this.$t('中文拒绝理由')
                        }
                    },
                    {
                        key: 'enReason',
                        renderHeader:() => {
                            return this.$t('英文拒绝理由')
                        }
                    },
                    {
                        key: 'user',
                        renderHeader:() => {
                            return this.$t('添加人')
                        }
                    },
                    {
                        key: 'sort',
                        renderHeader:() => {
                            return this.$t('排序')
                        }
                    },
                    {
                        renderHeader:() => {
                            return this.$t('操作')
                        },
                        render: (h, {row}) => {
                            const doms = [];
                            if (this.$store.state.user.checkPerm('withdraw:refuse:edit')) {
                                doms.push (h('a', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(row)
                                        }
                                    }
                                }, this.$t('编辑')))
                            }
                            if (this.$store.state.user.checkPerm('withdraw:refuse:del')) {
                                doms.push(h('a', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.formData.id = row.id;
                                            this.$Modal.confirm(this.delConfig)
                                        }
                                    }
                                }, this.$t('删除')))
                            }

                            return h(
                                'div',
                                doms
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
