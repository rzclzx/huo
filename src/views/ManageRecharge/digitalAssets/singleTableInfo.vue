<template>
    <div class="single-group" v-if='tableData'>
        <Table :columns="columns" :key="$store.state.app.lang" :data="[tableData]"></Table>
        <div class="single-table-info">
            <span>
                {{$t('提币地址')}}：{{tableData.toAddress}}
            </span>
            <span v-if="type==='other' && tableData.hashValue">
                {{$t('交易')}}ID：{{tableData.hashValue}}
            </span>
            <span v-if="type==='other' && tableData.approveAdmin">
                {{$t('审核人员')}}：{{tableData.approveAdmin}}
            </span>
            <span v-if="type==='other' && tableData.submitRecheckAdmin">
                {{$t('复审人员')}}：{{tableData.submitRecheckAdmin}}
            </span>
            <span v-if="type==='other' && tableData.cnReason">
                {{$t('拒绝理由-中文')}}：{{tableData.cnReason}}
            </span>
            <span v-if="type==='other' && tableData.enReason">
                {{$t('拒绝理由-英文')}}：{{tableData.enReason}}
            </span>
            <span v-if="type==='other' && tableData.code">
                {{$t('拒绝理由')}}：{{tableData.code}}
            </span>
            <span>
                <i :class="setSafetyClass" style="font-style: inherit">{{$t('安全判定')}}: <a @click="viewSafetyDetail">{{$t('查看')}}</a></i>
            </span>
            <span v-if='tableData.state==9'>

                <i :class="setSafetyClass" style="font-style: inherit">{{$t('操作')}}: <a @click="unfreeze(tableData)">{{$t('解冻')}}</a></i>
            </span>


        </div>

        <Modal
            v-model="refuseModal"
            :title="$t('选择拒绝理由')"
            @on-visible-change="refuseVisible"
            @on-cancel="refuseCancel">
            <Select v-model="selectedRefuse" @on-change="refuseSelect" v-autoLocale>
                <Option v-for="(item, index) in refuseList" :key="index" :value="item.id">
                    <div class="refuseReason">
                        <span v-if="$store.state.app.lang !== 'en'">{{item.reasons.loc}}</span>
                        <span>{{item.reasons.en}}</span>
                    </div>
                </Option>
            </Select>
            <div slot="footer">
                <Button type="ghost" @click="refuseCancel">{{$t('取消')}}</Button>
                <Button type="primary" :loading="modal_loading" :disabled="refuseModalDisabled" @click="refuseConfirm">
                    {{$t('确定')}}
                </Button>
            </div>
        </Modal>

        <Modal
            v-model="safetyDetailModal"
            :title="$t('安全判定条件')"
            @on-cancel="refuseCancel">
            <ul>
                <li>{{$t('是否为新增地址')}}：{{$t(formatSafeData('addrUsed'))}}</li>
                <li>{{$t('是否平账')}}：{{$t(formatSafeData('checkBalance'))}}</li>
                <li>{{$t('安全风险')}}：{{$t(formatSafeData('securityRisk'))}}</li>
                <li>{{$t('距上次充值')}}：{{tableData.lastDepositTime}}</li>
                <li>{{$t('距离上次提现')}}：{{tableData.lastWithdrawTime}}</li>
                <li>{{$t('近2次提现间是否有同额度充值')}}：{{$t(formatSafeData('isSameWithdraw'))}}</li>
            </ul>
            <div slot="footer">
                <Button type="primary" @click="safetyDetailModalCancel">{{$t('确定')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {recharge} from '__util/api';

    export default {
        name: "single-table-info",
        props: {
            data: Object,
            type: String
        },
        computed: {
            setSafetyClass() {
                return this.tableData.addrUsed === 1 || this.tableData.checkBalance !== 1 || this.tableData.securityRisk !== 'NONE' ? 'danger' : ''
            },
        },
        methods: {
            unfreeze(item){

                const self = this
                        // this.$emit('search');


// return false
                this.$Modal.confirm({
                    title:this.$t('解冻'),
                    content:this.$t('确认要解冻用户冻结的币种？'),
                    async onOk(){
                        recharge.repealed.data = {
                            uid:item.uid,
                            withdrawId:item.orderId

                        }
                        const res = await self.$axios(recharge.repealed)
                        if(res.success){
                            self.tableData = null
                            self.$Message.success(self.$t('解冻成功'))

                        }

                    }
                })
            },
            refuseSelect(e) {
                this.reasonId = e;
                this.refuseModalDisabled = !e;
            },
            refuseVisible(visible) {
                if (visible) {
                    this.$axios(recharge.refuseList).then((res) => {
                        this.refuseList = res.data.list
                            .map((item) => {
                                item.reasons = JSON.parse(item.reasons);
                                item.cnReason = item.reasons.cn;
                                item.enReason = item.reasons.en;
                                return item
                            });
                    })
                } else {
                    this.selectedRefuse = null;
                }
            },
            refuseCancel() {
                this.refuseId = null;
                this.refuseModal = false
            },
            refuseConfirm() {
                const trailRefuse = this.type === 'first' ? recharge.firstTrialRefuse : recharge.reviewTrialRefuse;
                trailRefuse.params = {
                    id: this.refuseId,
                    reasonId: this.reasonId
                };
                this.modal_loading = true;
                this.$axios(trailRefuse).then((res) => {
                    this.modal_loading = false;
                    this.refuseId = null;
                    this.refuseModal = false;
                    this.modal_loading = false;
                    this.tableData.state = 6;
                    this.tableType = 'other'
                }).catch((res) => {
                    this.modal_loading = false;
                })
            },
            refuse(id) {
                this.refuseId = id;
                this.refuseModal = true
            },
            submit(id) {
                const trailSubmit = this.type === 'first' ? recharge.firstTrialSubmit : recharge.reviewTrialSubmit;
                trailSubmit.params = {id};
                this.tableType = 'other'
                this.$axios(trailSubmit).then((res) => {
                    this.tableDate.state = 0
                }).catch((res) => {
                    this.tableDate.state = 2
                })
            },
            pass(id) {
                const trialPass = this.type === 'first' ? recharge.firstTrialPass : recharge.reviewTrialPass;
                trialPass.params = {id};
                this.$axios(trialPass).then((res) => {
                    this.tableData.state = 5
                    this.tableType = 'other'
                })
            },
            confirmSubmit(type, id) {
                const config = {};
                switch (type) {
                    case 'refuse':
                        config.title = this.$t('拒绝');
                        config.content = this.$t('确认拒绝该申请');
                        config.onOk = () => {
                            this.refuse(id)
                        };
                        break;
                    case 'firstPass':
                        config.title = this.$t('提交');
                        config.content = this.$t('确认提交复审') + "?";
                        config.onOk = () => {
                            this.submit(id);
                        };
                        break;
                    case 'pass':
                        config.title = this.$t('通过');
                        config.content = this.$t('确认通过该申请') + '?';
                        config.onOk = () => {
                            this.pass(id)
                        };
                        break;
                }
                this.$Modal.confirm(config)
            },
            getOperationFormat(h, row) {
                let doms = [];
                if (this.type==='first' && this.$store.state.user.checkPerm('withdraw:fCheck:refuse')
                    || this.type === 'review' && this.$store.state.user.checkPerm('withdraw:rCheck:refuse')) {
                    doms.push(h('a', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '15px'
                        },
                        on: {
                            click: () => {
                                this.refuse(row.id)
                            }
                        }
                    }, this.$t('拒绝')))
                }
                if (this.type === 'first' && this.$store.state.user.checkPerm('withdraw:fCheck:submit')) {
                    doms.push(h('a', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '15px'
                        },
                        on: {
                            click: () => {
                                this.confirmSubmit('firstPass', row.id);
                            }
                        }
                    }, this.$t('提交复审')))
                }
                if (this.$store.state.user.checkPerm('withdraw:fCheck:pass') || this.$store.state.user.checkPerm('withdraw:rCheck:pass')) {
                    doms.push(h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.confirmSubmit('pass', row.id);
                            }
                        }
                    }, this.$t('通过')))
                }
                switch (this.tableType) {
                    case 'first':
                        return h(
                            'div',doms
                        );
                    case 'review':
                        return h(
                            'div',
                            doms
                        );
                    default:
                        const statusText = this.$t(`status[${row.state}]`);
                        return h(
                            'div', {}, statusText
                        );
                }
            },
            formatSafeData(type) {
                switch (type) {
                    case 'addrUsed':
                        if (this.tableData[type] === 0) {
                            return this.$t('否')
                        } else {
                            return this.$t('是')
                        }
                    case 'checkBalance':
                        if (this.tableData[type] === 0) {
                            return this.$t('否')
                        } else if (this.tableData[type] === 1) {
                            return this.$t('是')
                        } else {
                            return this.$t('异常')
                        }
                    case 'securityRisk':
                        if (this.tableData[type] === 'SECURITY_CHANGE_RISK') {
                            return this.$t('安全项修改风险')
                        } else if (this.tableData[type] === 'LOGIN_RISK') {
                            return this.$t('登录风险')
                        } else {
                            return this.$t('无风险')
                        }
                    case 'isSameWithdraw':
                        if (this.tableData[type] === 0) {
                            return this.$t('否')
                        } else {
                            return this.$t('是')
                        }
                }
            },
            safetyDetailModalCancel() {
                this.safetyDetailModal = false;
            },
            viewSafetyDetail() {
                this.safetyDetailModal = true;
            }
        },
        data() {
            return {
                refuseModal: false,
                safetyDetailModal: false,
                refuseId: null,
                refuseList: [],
                selectedRefuse: null,
                tableData: {...this.data},
                tableType: this.type,
                modal_loading: false,
                refuseModalDisabled: true,
                columns: [
                    {
                        key: 'createDate',
                        renderHeader:() => {
                            return this.$t('申请时间')
                        }
                    },
                    {
                        key: 'uid',
                        renderHeader:() => {
                            return this.$t('UID')
                        }
                    },
                    {
                        key: 'orderId',
                        renderHeader:() => {
                            return this.$t('订单ID')
                        }
                    },
                    {
                        key: 'account',
                        renderHeader:() => {
                            return this.$t('手机号')
                        }
                    },
                    {
                        key: 'currency',
                        renderHeader:() => {
                            return this.$t('提币币种')
                        }
                    },
                    {
                        key: 'totalAmount',
                        renderHeader:() => {
                            return this.$t('提币金额')
                        }
                    },
                    {
                        key: 'fees',
                        renderHeader:() => {
                            return this.$t('提币手续费')
                        }
                    },
                    {
                        key: 'amount',
                        renderHeader:() => {
                            return this.$t('实提金额')
                        }
                    },
                    {
                        key: 'operation',
                        renderHeader:() => {
                            return this.type === 'other' ? this.$t('订单状态') : this.$t('操作')
                        },
                        width: 200,
                        render: (h, params) => {
                            const {row} = params;
                            return this.getOperationFormat(h, row);
                        }
                    }
                ]
            }
        }
    }
</script>

<style lang="less">
    .single-group {
        margin-top: -1px;
    }
    .single-group .ivu-table-wrapper {
        /*border: none;*/
        /*border-top: 1px solid #dddee1;*/
    }
    .single-table-info {
        background-color: #ffffff;
        border: 1px solid #dddee1;
        border-top: none;
        padding: 15px 18px;
    }
    .single-table-info span {
        margin-right: 15px;
    }
    .danger {
        color: #f00;
    }
    .refuseReason {
        span {
            display: inline-block;
            width: 50%;
            -ms-text-overflow: ellipsis;text-overflow: ellipsis;
            overflow: hidden;
        }
    }
</style>
