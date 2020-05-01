<template>
  <div class="userAuth_wrap">
    <Tabs :animated="false">
        <TabPane :label="$t('审核列表')">
          <review-list></review-list>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import reviewList from './reviewList'

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
    reviewList
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
