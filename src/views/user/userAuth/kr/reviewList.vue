<template>
    <div class="reviewList_wrap">
        <Row type="flex" :gutter="20" style="margin-top: 20px">
            <Col>
                <Input v-model="searchForm.searchParams" :placeholder="$t('用户标识')">
                  <Select v-model="searchForm.searchType" slot="prepend" style="width: 90px" v-autoLocale>
                      <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Input>
            </Col>
            <Col>
                <Select v-model="searchForm.searchLevel" :placeholder="$t('认证级别')" style="width: 130px;" v-autoLocale>
                    <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col>
                <Select v-model="searchForm.searchStatus" :placeholder="$t('认证状态')" style="width: 130px" v-autoLocale>
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col>
                <DatePicker type="daterange" v-model="searDate" placement="bottom-end" :placeholder="$t('申请时间-起 - 申请时间-止')"></DatePicker>
            </Col>
            <Col>
                <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('audit:check:list')">{{$t('查询')}}</Button>
            </Col>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('审核列表')}}<span>{{$t('待审核')}}：{{allCount}}{{$t('人')}}</span>
            </p>
            <Row>
                <Table :columns="authTitleArr" :data="authListArr" :no-data-text="this.$t('暂无数据')"></Table>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="coinPage.total" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getAuditList" size="small" show-total>
                    <slot>{{ $t('共') + ' ' + coinPage.total + ' ' + $t('条') }}</slot>
                </Page>
            </div>
        </Card>
        <Drawer v-model="modal" @close="modalClose" width="800px" placement="right">
          <p slot="header"><span>{{$t('认证审核')}}</span></p>
          <auth-info ref="authInfoCom" @onClose="modalClose"></auth-info>
        </Drawer>
        <!-- <Modal v-model="modal" width="800" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{$t('认证审核')}}</span>
            </p>
            <div style="text-align:center">
                <auth-info ref="authInfoCom" @onClose="modalClose"></auth-info>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal> -->
  </div>
</template>

<script>
import Drawer from '__components/drawer.vue'//20180420添加 左侧滑入弹窗
import authInfo from './authInfo'
import { user } from '__util/api'

export default {
  name: 'search',
  components: {
    Drawer,
    authInfo
  },
  data () {
    return {
      msg: '',
      modal: false,
      searDate: '',
      allCount: '',
      searchForm: {},
      // 币种分页参数
      coinPage: {
          currPage: 1,
          pageSize: 10,
          total: 0
      },
      searchTypeArr: [
          {
              value: 'uid',
              label: 'UID'
          },
          {
              value: 'phone',
              label: this.$t('电话号码')
          },
          {
              value: 'email',
              label: this.$t('邮箱')
          }
      ],
      levelList: [
        {
          value: ' ',
          label: this.$t('全部')
        },
        {
          value: '2',
          label: 'U2'
        },
        // {
        //   value: '3',
        //   label: 'U3'
        // },
        {
          value: '4',
          label: 'U4'
        }
      ],
      statusList: [
        {
          value: ' ',
          label: this.$t('全部')
        },
        {
          value: '1',
          label: this.$t('审核通过')
        },
        {
          value: '2',
          label: this.$t('待审核')
        },
        {
          value: '3',
          label: this.$t('未通过')
        },
        //20180420新增 再次审核选项
        {
          value: '4',
          label: this.$t('再次审核')
        }
      ],
      authTitleArr: [
        {
          key: 'uid',
          renderHeader:() => {
            return this.$t('UID')
          }
        },
        {
          key: 'email',
          renderHeader:() => {
            return this.$t('邮箱')
          }
        },
        {
          key: 'phone',
          renderHeader:() => {
            return this.$t('手机')
          }
        },
        {
          key: 'authLevel',
          renderHeader:() => {
            return this.$t('认证等级')
          }
        },
        {
          key: 'applyTime',
          renderHeader:() => {
            return this.$t('提交时间')
          }
        },
        {
          key: 'status',
          className: 'no_auth',
          renderHeader:() => {
            return this.$t('状态')
          }
        },
        {
          className: 'auth_btn',
          renderHeader:() => {
            return this.$t('userAuthReview["操作"]')
          },
          render: (h, params) => {
              if (this.$store.state.user.checkPerm('audit:check:check') && params.row.authState != 1 && params.row.authState != 3) {
                  return h('span', {
                      style: {
                          color: '#1991EB',
                          cursor: 'pointer'
                      },
                      on: {
                          click: () => {
                              this.viewAuthModal(params.row)
                          }
                      }
                  }, this.$t('审核'))
              } else return ''
          }
        }
      ],
      authListArr: []
    }
  },
  mounted () {
    this.getAuditList()
  },
  methods: {
      viewAuthModal (item) {
          this.modal = true
          this.$refs['authInfoCom'].getAuthInfo(item.id)
      },
      // 查询
      search () {
        if (this.searDate && this.searDate.length !== 0 && this.searDate[0] !== null) {
            this.startTime = this.$moment(this.searDate[0]).format('YYYY-MM-DD HH:mm:ss')
            this.endTime = this.$moment(this.searDate[1]).format('YYYY-MM-DD HH:mm:ss')
            this.authListArr = []
            this.getAuditList()
        }else {
           this.startTime = ''
           this.searDate = []
           this.authListArr = []
           this.getAuditList()
        }
      },
      // 获取基础列表
      getAuditList (page) {
          user.auditList.params = {
              page: page ? page : this.coinPage.currPage,
              limit: this.coinPage.pageSize,
              ucParamType: this.searchForm.searchType,
              ucParamValue: this.searchForm.searchParams,
              authLevel: this.searchForm.searchLevel,//20180420 修改认证级别项
              authState: this.searchForm.searchStatus,
              startTime: this.startTime,
              endTime: this.endTime
          }
          user.auditList.params.page = user.auditList.params.page
          this.$axios(user.auditList).then((res) => {
            if (!res.data.list) return
              res.data.list.map((e) => {
                  e.authLevel = `U${e.authLevel}`
                  if (e.authState === 1) {
                    e.status = this.$t('审核通过')
                  } else if (e.authState === 2) {
                    e.status = this.$t('待审核')
                  } else if (e.authState === 3) {
                    e.status = this.$t('未通过')
                  } else if (e.authState === 4) {//20180420 添加 再次审核项
                    e.status = this.$t('再次审核')
                  }
              })
              this.coinPage.currPage = res.data.currPage
              this.coinPage.pageSize = res.data.pageSize
              this.coinPage.total = res.data.totalCount
              this.authListArr = res.data.list
              this.allCount = res.data.auditingCount
          })
      },
      // 关闭认证审核详情
      modalClose (success) {
          if ( success ) {
              this.modal = false
              this.getAuditList()
          } else {
              this.modal = false
          }
          this.$refs['authInfoCom'].initForm()
      }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.ivu-card-head p span{
  font-size: 14px;
  color: #7F8FA4;
  margin-left: 20px;
}
</style>
