<template>
    <div>
        <div class="flex-start-center">
            <div style="width: 260px;margin-right: 10px">
                <Input v-model="name" placeholder="UID" number></Input>
            </div>
            <Button type="primary" v-if="$store.state.user.checkPerm('risk:management:blacklistinfo')" @click="search">{{$t('查询')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('查询名单')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('用户黑名单列表')}}
                    </p>
                    <Table  refs="table1"
                            :no-data-text="$t('暂无数据')"
                            :data="table1Date"
                            :columns="table1Column"
                    ></Table>
                    <Row>
                        <Col span="24">
                            <div style="margin-top: 10px" class="flex-end-center">
                                <Page show-elevator @on-change="onChange" :total="totalCount" size="small" show-total>
                                    <slot>
                                        {{ $t('共') + ' ' + totalCount + ' ' + $t('条') }}
                                    </slot>
                                </Page>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal ref="modal" v-model="showLog" width="600" :loading="loading">
            <h3 class="modal-title">{{$t('黑名单用户描述')}}</h3>
            <Form :model="info" :rules="ruleItem" class="modal-form" ref="rule" :label-width="100">
                <FormItem :label="$t('用户状态')">
                    <RadioGroup v-model="info.userState"  @on-change='changeState'>
                        <Radio :label="0">
                            <span>{{$t('正常')}}</span>
                        </Radio>
                        <Radio :label="1">
                            <span>{{$t('限制')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="$t('限制项')">
                    <CheckboxGroup v-model="strict" @on-change="change">
                        <Checkbox :disabled="disableStrict" :label="$t('提币')"></Checkbox>
                        <Checkbox :disabled="disableStrict" :label="$t('提现')"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem :label="$t('黑名单备注')" prop="reason">
                    <Input type="textarea" :rows='10' v-model="info.reason"></Input>
                </FormItem>
            </Form>
            <Table  style="margin-top: 30px" refs="table0"
                    :no-data-text="$t('暂无数据')"
                    :data="table2Date"
                    :columns="table2Column"
            ></Table>
            <div slot="footer" class="flex-center-center">
                <div class="flex-start-center">
                    <Button style="margin-rightL 10px" @click="remove">{{$t('取消')}}</Button>
                    <Button :disabled="!$store.state.user.checkPerm('risk:management:updateBlack')" type="primary" @click="submit">{{$t('确定')}}</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import { limit } from '__util/api';
import handler from '__util/publicMethod';


const black = {
  list: {method: 'post', url: 'v1/black/management/get/blacklist'},
  info: {method: 'post', url: 'v1/black/management/get/userBlackInfo'},
  update: {method: 'post', url: 'v1/black/management/update/state'},

}


export default {
    data () {
        const remarkCheck = (rule, value, callback) => {
            if ( maxL(value) ) {
                callback()
            } else {
                callback(new Error(this.$t('最多40个字符')))
            }
        }
        const maxL = (str) => {
            if (!str) return true
            str = handler.removeBlank(str)
            let num = 0
            let arr = str.split('')
            for (let i of arr) {
                if (/[^\u0000-\u00FF]/.test(i)) {
                    num += 2
                } else {
                    num += 1
                }
            }
            if (num > 40) {
                return false
            } else {
                return true
            }
        }
        return {
            disableStrict:false,
            table0Date: [],
            table1Date: [],
            table2Date: [],
            table0Column: [],
            table1Column: [],
            table2Column: [],
            showLog: false,
            name: '',
            info: new Info(),
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
            ruleItem: {
                reason: [
                    { validator: remarkCheck, trigger: 'blur' }
                ]
            },
            loading: true,
            strict:[]
        }
    },
    created () {
        // this.getList()
        this.init()
    },
    watch:{
        showLog:function(v){
            if(!v){
                this.info = new Info()
                this.strict = []
            }
        }
    },
    methods: {
        change(v){
            if(v.length == 0){
                this.info.userState = 0;
                this.disableStrict=true
                this.strict = []
            }
        },
        changeState(v){
            if(v === 1){
                this.disableStrict=false
                this.strict = ['提币', '提现']
            }else{
                this.disableStrict=true
                this.strict = []
            }
        },
        // async getList(){
        //     this.table0Column = columns0(this)
        //     this.table1Column = columns1(this)
        //     this.table2Column = columns2(this)
        //     const res = await this.$axios(black.list)
        //     console.log(res)
        //     this.table1Date = res.pageInfo.list
        // },
        init () {
            this.table0Column = columns0(this)
            this.table1Column = columns1(this)
            this.table2Column = columns2(this)
            if (this.$store.state.user.checkPerm('risk:management:blacklistinfo')) {
                this.rend()
            }
        },
        refresh (req) {
            return new Promise((resolve, reject) => {
                // req.uid = handler.removeBlank(req.uid) // 这代码直接把数字给整没了，要转成字符串
                for (let i in req) {
                    if (!req[i] && req[i] !== 0) {
                        delete req[i]
                    }
                }
                let obj = handler.clone(black.list)
                obj.data = req
                this.$axios(obj).then(res => {
                    resolve(res)
                })
            })
        },
        search () {
            this.refresh({uid: this.name}).then((res) => {
                let obj = res.data.userInfo
                if (obj) {
                    this.table0Date = []
                    this.table0Date.push(obj)
                } else {
                    this.table0Date = []
                }
            })
        },
        rend () {
            this.refresh({
                limit: this.pageSize,
                page: this.currPage
            }).then((res) => {
                this.table1Date = res.data.pageInfo.list || []
                this.totalCount = res.data.pageInfo.totalCount
            })
        },
        onChange (code) {
            this.currPage = code
            this.rend()
        },
        getModal (item) {
            const uid =item.uid
            let obj = handler.clone(black.info)
            this.info.uid = uid
            obj.data = {
                uid: this.info.uid
            }
            this.$axios(obj).then(res => {
                let data = res.data || {}
                this.table2Date = data.recordList
                this.table2Date = this.table2Date.slice(0, 5)
                this.info.userState = (data.userBlackInfo.cashStatus == 0 && data.userBlackInfo.coinStatus == 0) ? 0 : 1
                this.changeState(this.info.userState)
            })
        },
        async submit () {
            this.$refs['rule'].validate((valid) => {
                if (valid) {

                    let message = '设置成功'
                    if(this.strict.indexOf('提币')>-1){
                        this.info.coinStatus = 1
                    }else{
                        this.info.coinStatus = 0
                    }
                    if(this.strict.indexOf('提现')>-1){
                        this.info.cashStatus = 1
                    }else{
                        this.info.cashStatus = 0
                    }

                    const obj = {...black.update,data:this.info}
                    // const res = this.axios(obj)
                    // if(res.success){

                    // }

                    this.$axios(obj).then(res => {
                        this.rend()
                        this.search()
                        this.remove()
                        this.$Message.success(message)
                        this.showLog = false
                    }).catch(() => {
                        this.loading = false
                        setTimeout(() => {
                            this.loading = true
                        }, 0)
                    })
                } else {
                    this.loading = false
                    setTimeout(() => {
                        this.loading = true
                    }, 0)
                }
            });

        },
        remove () {
            this.info = new Info()
            this.table2Date = []
            this.$refs['rule'].resetFields()
            this.showLog = false
        }
    }
}

class Info {
    constructor() {
        this.userState = null
        this.reason = ''
        this.uid = ''
    }
}

const columns0 = (vm) => {
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
            key: 'email'
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
                return vm.$t('状态')
            },
            align: 'left',
            render: (h, params) => {
                return h('span', params.row.cashStatus == 0 && params.row.coinStatus == 0 ? vm.$t('正常') : vm.$t('限制'))
            }
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作')
            },
            align: 'left',
            render: (h, params) => {
                return h('Button', {
                    props: {
                        type: 'primary'
                    },
                    on: {
                        click: () => {
                            vm.strict = []
                            if(params.row.cashStatus){
                                vm.strict.push('提现')
                            }
                            if(params.row.coinStatus){
                                vm.strict.push('提币')
                            }
                            vm.showLog = true
                            vm.getModal(params.row)
                        }
                    }
                }, vm.$t('管理'))
            }
        }
    ]
}
const columns1 = (vm) => {
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
            key: 'email'
        },
        {
            renderHeader: (h) => {
                return vm.$t('手机')
            },
            align: 'left',
            key: 'phone'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作人')
            },
            align: 'left',
            key: 'adminName'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作时间')
            },
            align: 'left',
            key: 'createTime'
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
                        disabled: !vm.$store.state.user.checkPerm('risk:management:userBlackInfo')
                    },
                    on: {
                        click: () => {
                            vm.strict = []
                            if(params.row.cashStatus){
                                vm.strict.push('提现')
                            }
                            if(params.row.coinStatus){
                                vm.strict.push('提币')
                            }
                            vm.showLog = true
                            vm.getModal(params.row)
                        }
                    }
                }, vm.$t('更多'))
            }
        }
    ]
}
const columns2 = (vm) => {
    return [
        {
            renderHeader: (h) => {
                return vm.$t('冻结时间')
            },
            align: 'left',
            key: 'created'
        },
        {
            renderHeader: (h) => {
                return vm.$t('操作人')
            },
            align: 'left',
            key: 'adminName'
        },
        {
            renderHeader: (h) => {
                return vm.$t('备注')
            },
            align: 'left',
            key: 'reason'
        }
    ]
}
</script>
