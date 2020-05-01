<template lang="html">
    <Tabs>
        <TabPane v-if="$store.state.user.checkPerm('tab:lmanuallegal:hbdepositapply')" :label="$t('充值单申请')" name="0">
            <ApplyList></ApplyList>
        </TabPane>
        <TabPane v-if="$store.state.user.checkPerm('tab:manuallegal:hbdepositbankflow')" :label="$t('充值流水')" name="1">
            <ChargeFlow></ChargeFlow>
        </TabPane>
        <TabPane v-if="$store.state.user.checkPerm('tab:manuallegal:hbdepositapplyreview')" :label="$t('申请单复核')" name="2">
            <Review></Review>
        </TabPane>
        <TabPane v-if="$store.state.user.checkPerm('tab:manuallegal:hbuploadbankflow')" :label="$t('上传流水')" name="3">
            <UploadFlow></UploadFlow>
        </TabPane>
    </Tabs>
</template>

<script>
import ApplyList from './applyList/applyList.vue'
import Review from './review/applyListReview.vue'
import ChargeFlow from './flow/chargeFlow.vue'
import UploadFlow from './uploadFlow/uploadFlow.vue'
import { legalTender } from '__util/api'

export default {
    components: {
        ApplyList,
        ChargeFlow,
        Review,
        UploadFlow
    },
    created () {
      if (this.$store.state.user.checkPerm('manuallegal:hbdepositapply:listReceiptAccount')) {
          this.getBankList()
      }
      this.getPayBank()
    },
    methods: {
        // 收款银行
        getBankList () {
            this.$store.state.app.bankList = []
            let option = {...legalTender.chargeManage.getBankInfo}
            this.$axios(option).then(res => {
                let data = res.data
                let bank = {}
                for (let item of data) {
                    if ( !bank[item.bankName] ) {
                        bank[item.bankName] = true
                        this.$store.state.app.bankList.push({
                            bankName: item.bankName,
                            bankCode: item.bankCode,
                            id: item.id,
                            accountArr: [
                                {
                                    accountName: item.accountName,
                                    accountNumber: item.accountNumber,
                                    bankCode: item.bankCode,
                                    id: item.id
                                }
                            ]
                        })
                    } else {
                        for (let bank of this.$store.state.app.bankList) {
                            if ( item.bankName === bank.bankName ) {
                                bank.accountArr.push({
                                    accountName: item.accountName,
                                    accountNumber: item.accountNumber,
                                    bankCode: item.bankCode,
                                    id: item.id
                                })
                            }
                        }
                    }
                }
            })
        },
        // 付款银行
        getPayBank () {
            let option = {...legalTender.getPayBankList}
            this.$axios(option).then(res => {
                this.$store.state.app.payBankList = res.data
            })
        }
    }
}
</script>

<style lang="css">
</style>
