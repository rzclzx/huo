<template lang="html">
    <div class="applyList-match-pane">
        <Row type="flex" :gutter="30">
            <Col>
                <Input v-model="formItem.bankflowid" :placeholder="$t('输入匹配的流水号')" style="width: 300px"></Input>
            </Col>
            <Col>
                <Button type="primary" @click="search()">{{ $t('查询') }}</Button>
            </Col>
        </Row>
        <Table
           :columns="columns"
           :data="tableData"
           :no-data-text="$t('暂无数据')"
           style="width: 100%;margin-top: 20px"></Table>
        <div class="img-title" v-if="imgUrl">补充资料</div>
        <div class="img-info" v-if="imgUrl" @click="zoom" :style="{background: 'url(' + imgUrl + ')', backgroundSize: '100% 100%'}"></div>
        <div class="btn-pane">
            <Button type="ghost" @click="cancel()" style="margin-right: 40px">{{ $t('取消') }}</Button>
            <Button type="primary" @click="save()">{{ $t('确认') }}</Button>
        </div>
        <Modal v-model="zoomMadal" width="100%" class-name="modal-clear-line zoom-modal">
            <p slot="header" style="text-align:center">
                <span>{{ $t('补充资料') }}</span>
            </p>
            <div style="text-align:center">
                <img :src="imgUrl" v-if="imgUrl"/>
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
            formItem: {},
            zoomMadal: false,
            imgUrl: '',
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('匹配项')
                    },
                    key: 'matchName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('ID')
                    },
                    key: 'id'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('申请时间')
                    },
                    width: '180px',
                    key: 'applyTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('UID')
                    },
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('姓名')
                    },
                    key: 'name'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('打款银行')
                    },
                    key: 'payBankName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('打款银行账号')
                    },
                    width: '150px',
                    key: 'payBankAccount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('申请金额')
                    },
                    key: 'depositAmount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('备注码')
                    },
                    key: 'verCode'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    render: (h, params) => {
                      if ( params.row.matchName == 'DepositApply' ){
                        for (let item of this.applyArr) {
                            if ( params.row.status === item.status ) {
                                return item.label
                            }
                        }
                      } else if ( params.row.matchName == 'BankFlow' ) {
                        for (let item of this.bankArr) {
                            if ( params.row.status === item.status ) {
                                return item.label
                            }
                        }
                      }
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('到账时间')
                    },
                    key: 'payTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('上传时间')
                    },
                    key: 'uploadTime'
                }
            ],
            // 申请单状态列表
            applyArr: [
                {status: 1, label: '待确认'},
                {status: 2, label: '待匹配'},
                {status: 3, label: '撤销'},
                {status: 4, label: '匹配成功'},
                {status: 5, label: '上账成功'},
                {status: 6, label: '匹配待审核'},
                {status: 7, label: '取消'},
                {status: 8, label: '超时取消'},
                {status: 9, label: '匹配中'},
                {status: 10, label: '匹配失败'},
            ],
            // 流水单状态列表
            bankArr: [
                {status: 1, label: '待匹配'},
                {status: 2, label: '已匹配'},
                {status: 3, label: '已退款'},
                {status: 4, label: '不处理'},
                {status: 5, label: '匹配中'},
                {status: 6, label: '上账成功'},
                {status: 7, label: '匹配失败'},
            ],
            tableData: []
        }
    },
    props: {
        applyId: Number
    },
    methods: {
        initForm () {
            this.formItem = {}
            this.tableData = []
            this.imgUrl = ''
        },
        search () {
            if (!this.formItem.bankflowid) return
            let option = {...legalTender.chargeManage.getInfoMatch}
            option.path = {
                depositid: this.applyId,
                bankflowid: this.formItem.bankflowid
            }
            this.$axios(option).then(res => {
                this.tableData = res.data.item
                this.imgUrl = res.data.attachUrl
            })
        },
        cancel () {
            this.$emit('close')
        },
        // 提交
        save () {
            let option = {...legalTender.chargeManage.infoMatch}
            option.data = {
                depositid: this.applyId,
                bankflowid: this.formItem.bankflowid
            }
            this.$axios(option).then(res => {
                this.$Message.success({content: this.$t('匹配成功')})
                this.$emit('close')
            })
        },
        // 放大资料
        zoom () {
            this.zoomMadal = true
        }
    }
}
</script>

<style lang="less">
.applyList-match-pane {
    .img-title {
        margin-top: 50px;
    }
    .img-info {
        width: 400px;
        height: 250px;
        margin-top: 20px;
        border: 1px solid #aaa;
    }
    .btn-pane {
        text-align: center;
        margin-top: 50px;
    }
    .ivu-modal {
        top: 0!important;
    }
    .zoom-modal {
    }
}
</style>
