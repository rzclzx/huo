<style lang="less" scope>
@import '../../assets/style/layout.less';
@import '../../assets/style/public.less';
</style>



<template>
    <div>
        <Row>
            <Input v-model="form.baseCurrency" :placeholder="$t('基础货币')" style="width: 150px"></Input>
            <Select clearable v-model="form.quoteCurrency" :placeholder="$t('计价货币')" style="width: 150px" v-autoLocale>
                <Option v-for="item in currencys" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('job:hbprosymbols:list')">{{$t('查询')}}</Button>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('Pro站交易对')}}
                    </p>
                    <Table  :no-data-text="$t('暂无数据')"
                            :columns="columns"
                            :data="data"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <div class="page-pane">
            <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="getList" size="small" show-total>
                <slot>
                    {{ $t('共') + ' ' + page.total + ' ' + $t('条') }}
                </slot>
            </Page>
        </div>
    </div>
</template>
<script>
import { legalTender } from '__util/api';
import {Button} from 'iview'
export default {
    data () {
        return {
            // 添加用户表单
            visables:[this.$t('开启'),this.$t('关闭')],
            currencys:[],
            // 列表表头
            columns: [
                {
                    renderHeader: () => this.$t('交易对名称'),
                    align: 'center',
                    key: 'symbolName'
                },
                {
                    renderHeader: () => {
                        return this.$t('状态')
                    },
                    align: 'center',
                    render: (h, params) => <div>{this.visables[params.row.krwVisible]}</div>
                },
                {
                    renderHeader: () => this.$t('修改时间'),
                    align: 'center',
                    key: 'tradeEnableTimestamp',
                    render: (h, params) => {
                        return params.row.tradeEnableTimestamp ? this.$moment(params.row.tradeEnableTimestamp).format('YYYY-MM-DD HH:mm:ss') : ''
                    }
                },
                {
                    renderHeader: () => this.$t('排序权重'),
                    align: 'center',
                    key: 'weight'
                },
                {
                    renderHeader: () => this.$t('操作人'),
                    align: 'center',
                    key: 'operatorName'
                },
                {
                    renderHeader: () => {
                        return this.$t('操作')
                    },
                    align: 'center',
                    render: (h, params) => {
                      const type= params.row.krwVisible===1?"primary":"error"
                      const text = params.row.krwVisible===1?this.$t("开启"):this.$t("关闭")
                      if ( this.$store.state.user.checkPerm('job:hbprosymbols:update') ) {
                          return <Button type={type} size='small' onClick={()=>this.toggle(params.row)}> {text}</Button>

                      } else {
                          return ''
                      }
                    }

                }
            ],
            form:{

            },
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            data:[],
        }
    },
    mounted () {
        // this.init()
        if ( this.$store.state.user.checkPerm('job:hbprosymbols:list') ) {
            this.getList()
            this.getCurrencys()
        }
    },
    methods: {
        search(){
            this.page.currPage = 1
            this.getList()
        },
        async getCurrencys(){
          const res= await this.$axios(legalTender.currencyList)
          this.currencys = res.data
          // console.log(res)
        },
        async getList(page= this.page.currPage){
            const obj = {
                data:{
                  page: page,
                  "limit":10,
                  ...this.form
                },
                ...legalTender.proList
            }
            const { data={} } = await this.$axios(obj)

            this.data = data.list
            this.page.currPage = data.currPage
            this.page.total = data.totalCount
            // console.log(data)
        },
        async toggle(item){
          const self = this
          const status = item.krwVisible===1?0:1
          const title = item.krwVisible===1?this.$t('开启交易对'):this.$t('关闭交易对')
                this.$Modal.confirm({
                    title: title,
                    content: `
                      <p>${title}
                      <span class="text-primary">${item.symbolName}</span>
                      </p>`,
                    async onOk(){

                            const obj = {...legalTender.proUpdate,data:{id:item.id,krwVisible:status}}
                            const res = await self.$axios(obj)
                            if(res.success){
                                self.$Message.success(self.$t('修改成功'))
                                self.getList()
                            }


                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });



        }


    }
}

</script>
