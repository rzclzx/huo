<template lang="html">
    <Tabs :value="defaultTab" class="tab" @on-click="clickTab">
        <TabPane :label="$t('匹配信息')" name="matchInfo" class="tab-pane" v-if="true">
            <div v-if="matchInfo">
                <Row :gutter="20" type="flex">
                    <Col span="8">
                        <label>{{ $t('匹配状态') }}：</label><span>{{ getStatus(matchInfo.status) }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('最近一次匹配尝试') }}：</label><span>{{ matchInfo.lastMatchTime }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('方式') }}：</label><span>{{ getWay(matchInfo.matchWay) }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('匹配收款账号') }}：</label><span>{{ matchInfo.depositAccount }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('收款银行') }}：</label><span>{{ matchInfo.depositBank }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('开户名') }}：</label><span>{{ matchInfo.depositName }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('匹配收款流水号') }}：</label><span>{{ matchInfo.depositBankflowId }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('流水付款账号') }}：</label><span>{{ matchInfo.payAccount }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('付款银行') }}：</label><span>{{ getBankName(matchInfo.payBank) }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('姓名') }}：</label><span>{{ matchInfo.payName }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('到款金额') }}：</label><span>{{ matchInfo.amount }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('系统提示') }}：</label><span>{{ getMsg(matchInfo.msg) }}</span>
                    </Col>
                </Row>
            </div>
            <div v-else>{{ $t('未找到可匹配的流水') }}</div>
        </TabPane>
        <TabPane :label="$t('要求信息')" name="requiredInfo" class="tab-pane" v-if="true">
            <div v-if="needInfo">
                <Row :gutter="20" type="flex">
                    <Col span="8">
                        <label>{{ $t('收款账号') }}：</label><span>{{ needInfo.depositAccount }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('收款银行') }}：</label><span>{{ needInfo.depositBank }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('开户名') }}：</label><span>{{ needInfo.depositName }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('备注验证码') }}：</label><span>{{ needInfo.depositCode }}</span>
                    </Col>
                </Row>
            </div>
        </TabPane>
        <TabPane :label="$t('其他')" name="other" class="tab-pane" v-if="true">
            <div v-if="otherInfo && otherInfo.length > 0" class="otherRow" v-for="item in otherInfo">
                <Row :gutter="20" type="flex">
                    <Col span="8">
                        <label>{{ $t('来源') }}：</label><span>{{ getSource(item.source) }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('生成时间') }}：</label><span>{{ item.createTime }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('操作时间') }}：</label><span>{{ item.operTime }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('方式') }}：</label><span>{{ getWay(item.way) }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('操作项') }}：</label><span>{{ getOper(item.oper) }}</span>
                    </Col>
                    <Col span="8">
                        <label>{{ $t('经办人') }}：</label><span>{{ item.operator }}</span>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" style="margin-top: 20px">
                    <Col span="8">
                        <label>{{ $t('备注') }}：</label><span>{{ item.remark }}</span>
                    </Col>
                </Row>
            </div>
        </TabPane>
    </Tabs>
</template>

<script>
export default {
    data () {
        return {
            defaultTab: 'matchInfo',
            needInfo: null,
            matchInfo: null,
            otherInfo: null,
            // 方式
            way: [
                {num: 1, label: '人工操作'},
                {num: 2, label: '机器操作'},
                {num: 3, label: '用户操作'}
            ],
            // 来源
            source: [
                {num: 1, label: '操作员新增充值申请单'},
                {num: 2, label: '操作员匹配充值申请单'},
                {num: 3, label: '操作员取消充值申请单'},
                {num: 4, label: '操作员恢复充值申请单'},
                {num: 5, label: '操作员拒绝充值申请单'},
                {num: 6, label: '操作员通过充值申请单'},
            ],
            // 系统提示
            sysMsg: [
                {msg: 1, label: '匹配成功'},
                {msg: 3, label: '姓名错误'},
                {msg: 4, label: '付款银行错误'},
                {msg: 5, label: '付款银行账号错误'},
                {msg: 6, label: '金额错误'}
            ],
            // 操作项
            oper: [
                {status: 1, label: '操作员新增充值申请单'},
                {status: 2, label: '操作员匹配充值申请单'},
                {status: 3, label: '操作员取消充值申请单'},
                {status: 4, label: '操作员恢复充值申请单'},
                {status: 5, label: '操作员人工匹配审核-拒绝'},
                {status: 6, label: '操作员人工匹配审核-通过'},
                {status: 7, label: '用户创建充值申请单'},
                {status: 8, label: '系统超时取消'},
                {status: 9, label: '系统匹配充值申请单'},
                {status: 10, label: '用户确认汇款'},
                {status: 11, label: '用户撤销申请单'}
            ],
            // 状态列表
            statusArr: [
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
            bankList: this.$store.state.app.bankList
        }
    },
    props: {
        defaultInfo: {
            type: String,
            default: 'matchInfo'
        },
        data: Object
    },
    methods: {
        clickTab () {

        },
        getWay (num) {
            for (let item of this.way) {
                if ( num === item.num ) {
                    return this.$t(item.label)
                }
            }
        },
        getMsg (num) {
            for (let item of this.sysMsg) {
                if ( num === item.msg ) {
                    return this.$t(item.label)
                }
            }
        },
        getOper (num) {
            for (let item of this.oper) {
                if ( num === item.status ) {
                    return this.$t(item.label)
                }
            }
        },
        getBankName (num) {
            for (let item of this.bankList) {
                if ( item.bankCode === num ) {
                    return this.$t(item.bankName)
                }
            }
            return num
        },
        getStatus (num) {
            for (let item of this.statusArr) {
                if ( num === item.status ) {
                    return this.$t(item.label)
                }
            }
        },
        getSource (num) {
            for (let item of this.source) {
                if ( num === item.num ) {
                    return this.$t(item.label)
                }
            }
        },
    },
    watch: {
        defaultInfo (val) {
            this.defaultTab = val
        },
        data (val) {
            if ( val._expandData ) {
                this.needInfo = val._expandData.neededInfo
                this.matchInfo = val._expandData.matchedInfo
                this.otherInfo = val._expandData.otherInfo
            }
        }
    }
}
</script>

<style lang="less" scoped>
    label {
        color: #333;
    }
    .tab-pane {
        padding: 0 20px;
    }
    .tab {
        border: 1px solid #dddee1;
        padding-bottom: 20px;
    }
    .otherRow {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e6e6e6;
    }
</style>
