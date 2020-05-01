<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">    
                    <p slot="title">
                        {{$t('资产概览')}}
                    </p>  
                    <Table  :no-data-text="$t('暂无数据')"
                    		:columns="assetTitle"
                            :data="assetList"
                    ></Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import { finance } from '__util/api'

export default {
	data () {
		return {
			assetTitle: [
				{
					renderHeader: () => {
                        return this.$t('币种名称')
                    },
                    key: 'currency'
				},
				{
					renderHeader: () => {
                        return this.$t('热钱包')
                    },
                    key: 'hotWalletAmount'
				},
				{
					renderHeader: () => {
                        return this.$t('冷钱包')
                    },
                    key: 'coldWalletAmount'
				}
			],
			assetList: []
		}
	},
    mounted () {

        if (this.$store.state.user.checkPerm('pro:fince:walletAssets')) {
            this.getBaseList()
        }
    },
    methods: {
        // 获取基础列表
        getBaseList (page) {
            this.$axios(finance.walletAsset).then((res) => {
                this.assetList = res.data
            })
        },
    },
    components: {
    }
}
</script>

<style lang="less" scope>
@import '../../../assets/style/layout.less';
@import '../../../assets/style/public.less';
</style>
