<template>
  <div class="userAuth_wrap">
    <Tabs :animated="false">
        <TabPane :label="$t('本地站币种')" v-if="$store.state.user.checkPerm('tab:local:currency')">
          <CoinSetting />
        </TabPane>
        <TabPane :label="$t('Pro币种')" v-if="$store.state.user.checkPerm('tab:pro:currency')">
          <ProCoinSetting />
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import CoinSetting from './coinSetting'
import ProCoinSetting from './proCoinSetting'

export default {
  name: 'search',
  data () {
    return {
      msg: ''
    }
  },
  created () {
  },
  components: {
    CoinSetting,
    ProCoinSetting
  },
  methods: {
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
</style>
