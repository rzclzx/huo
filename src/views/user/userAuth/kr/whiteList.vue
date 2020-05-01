<template>
    <div class="whiteList_wrap">
        <Row style="margin-top: 20px">
            <Input placeholder="UID" v-model="searchUId" style="margin-right: 20px;width: 150px"></Input>
            <Button type="primary"
                v-if="$store.state.user.checkPerm('audituser:whitelist:query')"
                @click="search">{{$t('查询')}}
            </Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('白名单查询结果')}}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="whiteTArr" :data="whiteArr" :no-data-text="this.$t('暂无数据')"></Table>
            </Row>
        </Card>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('用户白名单列表')}}
            </p>
            <Row>
                <Table :columns="whiteTitleArr" :data="whiteListArr" :no-data-text="this.$t('暂无数据')"></Table>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="coinPage.total" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getWhiteList" size="small" show-total>
                    <slot>{{ $t('共') + ' ' + coinPage.total + ' ' + $t('条') }}</slot>
                </Page>
            </div>
        </Card>
    </div>
</template>

<script>
import { user } from '__util/api'

export default {
  name: 'search',
  data () {
    return {
      msg: '',
      authLevel: '',
      authStatus: '',
      searchUId: '',
      modifyUID: '',
      // 币种分页参数
      coinPage: {
          currPage: 1,
          pageSize: 10,
          total: 0
      },
      whiteTArr: [
        {
          title: 'UID',
          key: 'uid'
        },
        {
          title: this.$t('邮箱'),
          key: 'email'
        },
        {
          title: this.$t('手机'),
          key: 'phone'
        },
        {
          title: this.$t('白名单认证'),
          key: 'whiteAuth',
          className: 'auth_btn',
          render: (h, params) => {
             let option = {
                  style: {
                      color: params.row.showAuth == 1 ? '#1991EB' : '#aaa',
                      cursor: params.row.showAuth == 1 ? 'pointer' : 'default'
                  },
                  on: {
                      click: () => {
                          if ( params.row.showAuth == 1 && this.$store.state.user.checkPerm("auth:white:pass")) {
                              this.modifyUID = params.row.uid
                              this.$Modal.confirm({
                                  title: this.$t('确认'),
                                  content: this.$t('确认通过'),
                                  onOk: this.passWhite
                              })
                          } else if (this.$store.state.user.checkPerm("auth:white:pass")  && params.row.showAuth != 1) {
                              return
                          } else {
                            this.$Message.error(this.$t('没有权限'));
                            return
                          }
                      }
                  }
              }
              return h('span', option, params.row.showAuth == 1 ? this.$t('通过认证') : this.$t('已认证'))
          }
        }
      ],
      whiteArr: [],
      whiteTitleArr: [
        {
          title: 'UID',
          key: 'uid'
        },
        {
          title: this.$t('邮箱'),
          key: 'email'
        },
        {
          title: this.$t('手机'),
          key: 'phone'
        },
        {
          title: this.$t('审核人'),
          key: 'adminName'
        },
        {
          title: this.$t('添加时间'),
          key: 'createTime'
        },
        {
          title: this.$t('白名单认证'),
          key: 'whiteAuth',
          className: 'auth_btn',
          render: (h, params) => {
              if (this.$store.state.user.checkPerm('auth:white:revoke')) {
                  return h('span', {
                      style: {
                          color: '#1991EB',
                          cursor: 'pointer'
                      },
                      on: {
                          click: () => {
                              this.modifyUID = params.row.id
                              this.$Modal.confirm({
                                  title: this.$t('确认'),
                                  okText: this.$t('确认'),
                                  content: this.$t('确定撤销'),
                                  onOk: this.removeWhite
                              })
                          }
                      }
                  }, this.$t('撤销'))
              } else return ''
          }
        }
      ],
      whiteListArr: [],
    }
  },


  mounted () {
    this.getWhiteList()
  },
  methods: {
    // 获取基础列表
    getWhiteList (page) {
        user.whiteList.params = {
            page: page ? page : this.coinPage.currPage,
            limit: this.coinPage.pageSize,
            UID: this.searchUId
        }
        this.$axios(user.whiteList).then((res) => {
            this.coinPage.currPage = res.data.data.list.currPage
            this.coinPage.pageSize = res.data.data.list.pageSize
            this.coinPage.total = res.data.data.list.totalCount
            this.whiteListArr = res.data.data.list.list
            this.whiteArr = res.data.data.serchInfo.uid ? [res.data.data.serchInfo] : []
        })
    },
    // 撤销白名单
    removeWhite () {
        user.removeWhite.data = {
            id: this.modifyUID
        }
        this.$axios(user.removeWhite).then((res) => {
            this.getWhiteList()
        })
    },
    // 通过认证
    passWhite () {
        user.passWhite.data = {
            UID: this.modifyUID
        }
        this.$axios(user.passWhite).then((res) => {
            this.getWhiteList()
        })
    },
    search () {
      if (this.searchUId.match(/^[0-9]+$/)){
        this.getWhiteList()
      } else {
        this.$Message.info(this.$t('请输入有效的UID'))
      }

    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
</style>
