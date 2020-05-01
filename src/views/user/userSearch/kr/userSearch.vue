<style lang="less" scope>
@import '../../../../assets/style/layout.less';
@import '../../../../assets/style/public.less';
.input{
    width: 260px;
    margin-right: 30px
}
</style>
<template>
    <div>
        <Row v-if="$store.state.user.checkPerm('user:mgt:query:list')">
            <Col>
                <Card class="dis-select">
                    <div>{{$t('普通查询')}}</div>
                    <div class="flex-start-center" style="margin-top: 10px">
                        <div style="margin-right: 30px">
                            <Input v-model="condition" :placeholder="$t('请输入')">
                                <Select v-model="type" slot="prepend" style="width: 80px" :placeholder="$t('请选择')" v-autoLocale>
                                    <Option value="uid">UID</Option>
                                    <Option value="phone">{{$t('电话号码')}}</Option>
                                    <Option value="email">{{$t('邮箱')}}</Option>
                                </Select>
                            </Input>
                        </div>
                        <div style="margin-right: 30px;">
                            <Input v-model="address" :placeholder="$t('虚拟币充值地址')">
                                <Select v-model="currency" slot="prepend" style="width: 80px" :placeholder="$t('全部')" v-autoLocale>
                                    <Option :value="''">{{$t('全部')}}</Option>
                                    <Option :value="item" v-for="item in currencyList">{{ item }}</Option>
                                </Select>
                            </Input>
                        </div>
                        <div style="margin-right: 30px;" v-if="currency === 'XRP'">
                            <Input v-model="tag" :placeholder="$t('地址标签')"></Input>
                        </div>
                        <Button type="primary" @click="refresh" v-if="$store.state.user.checkPerm('user:mgt:query:list')">{{$t('查询')}}</Button>
                    </div>
                    <!--<div style="margin-top: 20px">{{$t('高级查询')}}</div>
                    <div class="flex-start-center" style="margin-top: 10px">
                        <div style="margin-right: 30px">
                            <Input v-model="a5" :placeholder="$t('用户姓名')"></Input>
                        </div>
                        <div style="margin-right: 30px">
                            <Input v-model="a6" :placeholder="$t('证件号码')"></Input>
                        </div>
                        <div style="margin-right: 30px">
                            <Input v-model="a7" :placeholder="$t('IP 地址')"></Input>
                        </div>
                        <div style="margin-right: 30px">
                            <Input v-model="a8" :placeholder="$t('净资产大于(数字资产)')"></Input>
                        </div>
                        <div style="margin-right: 30px;">
                            <DatePicker @on-change="choiceDate" :value="a9" format="yyyy/MM/dd" type="daterange" :placeholder="$t('注册时间 - 始 - 注册时间 - 止')" placement="bottom-end" style="width: 240px"></DatePicker>
                        </div>
                        <Button type="primary" @click="refresh">{{$t('查询')}}</Button>
                    </div>!-->
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                    <Row style="margin-top: 10px">
                        <Col span="24">
                            <div class="flex-end-center">
                                <Button @click="pre" :disabled="prevOffset === -1" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                                <Button @click="next" :disabled="nextOffset === -1" type="primary">{{$t('下一页')}}</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { user, recharge } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'userSearch',
    data () {
        return {
            table0Date: [],
            table0Column: [],
            currentOffset: 0,
            prevOffset: -1,
            nextOffset: -1,
            type: 'uid',
            condition: '',
            currency: '',
            address: '',
            currencyList: [],
            // xrp标签
            tag: ''
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.getCoin()
        },
        refresh () {
            let obj = handler.clone(user.search)
            if (this.type === 'uid' && !this.address) {
                if ( !/^[0-9]+$/.test(this.condition) ) {
                    this.$Message.error(this.$t('uid格式不正确!'));
                    return
                }
            }
            obj.data = {
                page: this.currentOffset,
                type: this.type,
                condition: this.condition,
                currency: this.currency,
                address: this.address
            }
            if ( this.currency === 'XRP' ) {
                obj.data.tag = this.tag
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data && res.data.data || []
                this.prevOffset = this.table0Date.length > 0 ? res.data.prevOffset : -1
                this.currentOffset = this.table0Date.length > 0 ? res.data.currentOffset : 0
                this.nextOffset = this.table0Date.length > 0 ? res.data.nextOffset : -1
            })
        },
        onChange (code) {
            this.currPage = code
            this.refresh()
        },
        choiceDate (obj) {

        },
        pre () {
            this.currentOffset = this.prevOffset
            this.refresh()
        },
        next () {
            this.currentOffset = this.nextOffset
            this.refresh()
        },
        // 获取币种
        getCoin () {
            this.$axios(recharge.currencyList).then((res) => {
                this.currencyList = res.data.map((item)=>{
                    item = item.toUpperCase();
                    return item
                });
            })
        },
    }
}

const column0 = (vm) => {
    return [
        {
          title: 'UID',
          align: 'left',
          key: 'uid'
        },
        {
          renderHeader: (h) => {
            return vm.$t('邮箱')
          },
          align: 'left',
          key: 'emial'
        },
        {
          renderHeader: (h) => {
            return vm.$t('手机号')
          },
          align: 'left',
          key: 'phone'
        },
        {
          renderHeader: (h) => {
            return vm.$t('认证级别')
          },
          align: 'left',
          key: 'authLevel'
        },
        {
          renderHeader: (h) => {
            return vm.$t('净资产折合')
          },
          align: 'left',
          key: 'balanceKRW'
        },
        {
          renderHeader: (h) => {
            return vm.$t('操作')
          },
          align: 'left',
          render: (h, params) => {
              return h('Button', {
                  props: {
                      type: 'primary',
                      disabled: !vm.$store.state.user.checkPerm('user:mgt:query:detail')
                  },
                  on: {
                      click: () => {
                          vm.$router.push('userInfo/' + params.row.uid)
                      }
                  }
              }, vm.$t('查看详情'))
          }
        }
    ]
}
</script>
