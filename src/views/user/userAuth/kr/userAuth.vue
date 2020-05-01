<template>
  <div class="userAuth_wrap">
    <Tabs :animated="false">
        <TabPane :label="$t('审核列表')" v-if="$store.state.user.checkPerm('audit:check')">
          <review-list></review-list>
        </TabPane>
        <TabPane :label="$t('认证用户白名单')" v-if="$store.state.user.checkPerm('audituser:whitelist')">
          <white-list></white-list>
        </TabPane>
        <TabPane :label="$t('拒绝理由设置')" v-if="$store.state.user.checkPerm('auth:refuse')">
          <refuse-reason></refuse-reason>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import reviewList from './reviewList'
import whiteList from './whiteList'
import refuseReason from './refuseReason'

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
    reviewList,
    whiteList,
    refuseReason
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
