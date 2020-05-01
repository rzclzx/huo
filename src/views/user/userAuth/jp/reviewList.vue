<template>
  <div class="reviewList_wrap">
    <div class="form_list clear">
      <div class="flex-start-center" style="margin-top: 10px">
        <div style="margin-right: 30px">
          <Input v-model="searchForm.searchParams" :placeholder="$t('用户标识')">
            <Select v-model="searchForm.searchType" slot="prepend" style="width: 120px" :placeholder="$t('请选择')" v-autoLocale>
                <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Input>
        </div>
        <div class="input_box">
        <Select v-model="searchForm.searchLevel" :placeholder="$t('认证级别')" v-autoLocale>
          <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="input_box">
        <Select v-model="searchForm.searchStatus" :placeholder="$t('认证状态')" style="width: 140px" v-autoLocale>
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="input_box">
        <Col span="12">
          <DatePicker type="daterange" style="width: 300px" placement="bottom-end" :placeholder="$t('申请时间-起 - 申请时间-止')"></DatePicker>
        </Col>
      </div>
      <div class="btn_box">
        <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('page:user:audit:list')">{{$t('查询')}}</Button>
      </div>
      </div>
    </div>

    <div class="authList_wrap clear">
      <h3>{{$t('待审核列表')}}<span>{{$t('待审核')}}：333人</span></h3>
      <div class="authList_box">
        <Table :columns="authTitleArr" :data="authListArr" :no-data-text="this.$t('暂无数据')"></Table>
      </div>
      <div class="page-pane" v-if="coinPage.totalPage">
          <Page show-elevator :total="coinPage.totalPage" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getAuditList" size="small" show-total>
            <slot>
                {{ $t('共') + ' ' + coinPage.totalPage + ' ' + $t('条') }}
            </slot>
          </Page>
      </div>
    </div>
    <Modal v-model="modal" width="800" class-name="modal-clear-line">
        <p slot="header" style="text-align:center">
            <span>{{$t('认证审核')}}</span>
        </p>
        <div style="text-align:center">
            <auth-info ref="authInfoCom" @onClose="modalClose"></auth-info>
        </div>
        <div slot="footer" style="border-top: 0">
        </div>
    </Modal>
  </div>
</template>

<script>
import authInfo from './authInfo'
import { user } from '__util/api'

export default {
  name: 'search',
  components: {
      authInfo
  },
  data () {
    return {
      msg: '',
      modal: false,
      allCount: '',
      searchForm: {},
      // 币种分页参数
      coinPage: {
          currPage: 1,
          pageSize: 10,
          totalPage: 0
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
        {
          value: '3',
          label: 'U3'
        },
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
          label: this.$t('待审核')
        },
        {
          value: '2',
          label: this.$t('未通过')
        },
        {
          value: '3',
          label: this.$t('再次审核')
        }
      ],
      authTitleArr: [
        {
          title: this.$t('UID'),
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
          title: this.$t('认证等级'),
          key: 'authLevel'
        },
        {
          title: this.$t('提交时间'),
          key: 'updateTime'
        },
        {
          title: this.$t('状态'),
          key: 'status',
          className: 'no_auth'
        },
        {
          title: this.$t('操作'),
          className: 'auth_btn',
          render: (h, params) => {
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
              }, this.$t('查看'))
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
        this.getAuditList()
      },
      // 获取基础列表
      getAuditList (page) {
          user.auditList.params = {
              page: page ? page : this.coinPage.currPage,
              limit: this.coinPage.pageSize,
              ucParamType: this.searchForm.searchType,
              ucParamValue: this.searchForm.searchParams,
              authLevel: this.searchForm.searchLevel,
              authStatus: this.searchForm.searchStatus,
              startTime: this.searchForm.startTime,
              endTime: this.searchForm.endTime
          }
          this.$axios(user.auditList).then((res) => {
              if (res.data.list) {
                  res.data.list.map((e) => {
                      e.authLevel = `U${e.authLevel}`
                      if (e.authStatus === 1) {
                        e.status = '待审核'
                      } else if (e.authStatus === 2) {
                        e.status = '未通过'
                      } else if (e.authStatus === 3) {
                        e.status = '再次审核'
                      }
                  })
              }
              this.coinPage.currPage = res.data.currPage
              this.coinPage.pageSize = res.data.pageSize
              this.coinPage.totalPage = res.data.totalCount
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
.clear::after{
  display: block;
  content: '';
  clear:both;
}
.flexd{
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap: wrap;
  align-items: flex-start;
}
.flexed(@size){
  -webkit-flex: @size;
  -ms-flex: @size;
  flex: @size;
  -moz-box-flex: @size;
  -o-box-flex: @size;
}
.reviewList_wrap{
  /*background-color: #EFF3F6;
  padding-bottom: 17px;*/
  .form_list{
    background-color: #F8F8F8;
    padding: 12px 30px;
    .btn_box{
      /*float: left;
      margin-left: 20px;
      line-height: 40px;*/
      .ivu-btn{
        font-size: 12px;
      }
    }
    .input_box{
      float: left;
      margin-right: 30px;
      .ivu-input-wrapper{
        /*width: 240px;*/
        .ivu-input{
          font-size: 12px;
        }
      }
      .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
        font-size: 12px;
      }
    }
  }
  .authList_wrap{
    margin: 20px 0px 10px 0px;
    background-color: #fff;
    border-radius: 4px;
    h3{
      font-size: 16px;
      color: #354052;
      font-weight: normal;
      height: 48px;
      line-height: 48px;
      padding-left: 30px;
      span{
        padding-left: 20px;
        color: #7F8FA4;
        font-size: 12px;
      }
    }
    .authList_box{
      padding: 12px;
      .ivu-table::after{
        background-color: transparent;
      }
      .ivu-table-wrapper{
        border: 0;
      }
      .ivu-table{
        border: 1px solid #E6EAEE;
        font-size: 12px;
      }
      .ivu-table th{
        /*background-color: #F8F8F8;
        color: #495060;*/
      }
      .ivu-table td.no_auth{
        color: #EE4848;
      }
      .ivu-table td.auth_btn{
        color: #1991EB;
        cursor: pointer;
      }
    }
    .pages_box{
      float: right;
      padding: 19px 30px 19px 0;
    }
  }
}
</style>
