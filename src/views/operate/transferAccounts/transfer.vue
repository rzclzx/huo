<template lang="html">
    <Row>
        <Row type="flex" class="l-search" style="margin-bottom: 20px">
            <Input v-model="activityName" placeholder="活动名称" class="m-search" style="width: 360px; margin-right: 10px">
                <Select v-model="stateType" slot="prepend" class="l-select-input" placeholder="活动状态" v-autoLocale>
                    <Option v-for="item in state" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Input>
            <Button type="primary" v-on:click="batchFilter">查询</Button>
        </Row>
        <Card>
            <p slot="title">
                活动批量转账列表
            </p>
            <Button slot="extra" type="primary" v-on:click="show">添加批量转账</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="batchListTable" :data="batchList" style="width: 100%" :no-data-text="$t('暂无数据')"></Table>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="page.totalCount" :page-size="page.pageSize" :current="page.currPage" @on-change="page" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.totalCount + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Modal
            v-model="detailed"
            title="批量转账明细"
            width="800"
            >
            <div class="l-pop-table">
                <h2>转账明细</h2>
                <Table :columns="transferAccountTable" :data="transferAccount"></Table>
                <h2 class="pt20">活动清单</h2>
                <Table :columns="detailedListTable" :data="detailedList"></Table>
            </div>
        </Modal>
        <Modal
            v-model="modal1"
            title="添加批量转账"
            @on-ok="ok"
            @on-cancel="cancel">
            <Form :label-width="100" enctype="multipart/form-data" ref="formDetailEdit" :rules="rules">
                <FormItem prop="activityName" label="活动名称">
                    <Input v-model="addForm.activityName" placeholder="填写活动名称，5-30字，无特殊字符"></Input>
                </FormItem>
                <FormItem prop="activityDetails" label="活动细则">
                    <Input v-model="addForm.activityDetails" type="textarea" placeholder="填写活动细则"></Input>
                </FormItem>
                <FormItem prop="transferOutUserId" label="选择转出账户">
                    <Input v-model="addForm.transferOutUserId" placeholder="活动账户"></Input>
                </FormItem>
                <FormItem prop="transferOutCurrency" label="转出币种">
                    <RadioGroup v-model="addForm.transferOutUserId">
                        <Radio label="BTC">
                            <span>BTC</span>
                        </Radio>
                        <Radio label="ETH">
                            <span>ETH</span>
                        </Radio>
                        <Radio label="ETC">
                            <span>ETC</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="transferUserCount" label="转账人数">
                    <Input v-model="addForm.transferUserCount" placeholder="请与上传清单人数保持一致"></Input>
                </FormItem>
                <FormItem prop="transferCurrencyCount" label="转账总额">
                    <Input v-model="addForm.transferCurrencyCount" placeholder="请与上传清单总金额保持一致"></Input>
                </FormItem>
                <FormItem prop="transferCurrencyCount" label="运营账户资产">
                    <input type="file" ref="file" />
                </FormItem>
                <FormItem prop="noticeType" label="到账通知形式">
                    <RadioGroup v-model="addForm.noticeType">
                        <Radio label="PM">
                            <span>站内信</span>
                        </Radio>
                        <Radio label="SMS">
                            <span>短信</span>
                        </Radio>
                        <Radio label="EMAIL">
                            <span>邮件</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="notificationTemplate" label="到账通知模板">
                    <Input v-model="addForm.notificationTemplate" type="textarea" placeholder="自动以文字通知，变量金额以%s代替，连接以<a href='http://example.cn/example"></Input>
                </FormItem>
            </Form>
        </Modal>
    </Row>
</template>

<script>
import { operation } from '__util/api'
import Cookies from 'js-cookie'
export default {
    data () {
        return {
            stateType: '',
            state: [],
            activityName: '',
            batchList: [],
            totalCount: '',
            page: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            transferAccount: [],
            detailedList: [],
            //查看明细
            detailed: false,
            id:0,
            modal1: false,
            transferAccount: [],
            // 添加form
            addForm: {},
            batchListTable: [
                {
                    title: '申请时间',
                    width: 200,
                    key: 'applyDatetime'
                },
                {
                    title: '活动名称',
                    key: 'activityName'
                },
                {
                    title: '转出账户',
                    key: 'transferOutUserId',
                    render: (h, params) => {
                        let account;
                        switch (params.row.transferOutUserId) {
                            case 4:
                                account = '活动账户';
                                break;
                            case 6:
                                account = '返佣账户';
                                break;
                            default:

                        }
                        return account;
                    }
                },
                {
                    title: '转出币种',
                    key: 'transferOutCurrency',
                    render: (h, params) => {
                        return params.row.transferOutCurrency.toUpperCase();
                    }
                },
                {
                    title: '转出总额',
                    key: 'transferCurrencyCount'
                },
                {
                    title: '转出用户数',
                    key: 'transferUserCount'
                },
                {
                    title: '状态',
                    key: 'transferStatusDesc',
                    render:(h,param)=>this.$t(param.row.transferStatusDesc)+'x'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.detailed = true;
                                        this.id = params.row.id;
                                        this.activityDetail();
                                    }
                                }
                            }, '查看明细')
                        ]);
                    }
                }
            ],
            transferAccountTable: [
                {
                    title: '申请时间',
                    key: 'applyDatetime'
                },
                {
                    title: '活动名称',
                    key: 'activityName'
                },
                {
                    title: '转出账户',
                    key: 'transferOutUserId',
                    render: (h, params) => {
                        let account;
                        switch (params.row.transferOutUserId) {
                            case 4:
                                account = '活动账户';
                                break;
                            case 6:
                                account = '返佣账户';
                                break;
                            default:

                        }
                        return account;
                    }
                },
                {
                    title: '转出币种',
                    key: 'transferOutCurrency'
                },
                {
                    title: '转出总额',
                    key: 'transferCurrencyCount'
                },
                {
                    title: '转出人数',
                    key: 'transferUserCount'
                },
                {
                    title: '当前状态',
                    key: 'transferStatusDesc'
                }
            ],
            detailedListTable: [
                {
                    title: '用户UID',
                    key: 'uid'
                },
                {
                    title: '转账金额',
                    key: 'transferAmount'
                },
                {
                    title: '到账时间',
                    key: 'transferDatetime'
                },
                {
                    title: '订单ID',
                    key: 'id'
                }
            ],
            // 表单验证
            rules: {
                value: [
                    { required: true, message: '币种标识(对内)不能为空', trigger: 'blur' }
                ],
                currencyCode: [
                    { required: true, message: '币种code(对外)不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        batchFilter () {

        },
        show () {
            this.modal1 = true
        },
        page () {

        },
        //运营批量转账列表
        getData () {
            let request = {...operation.activityList}
            request.params = {
                page: this.page.currPage,
                pageSize: this.page.pageSize,
                activityName: this.activityName,
                transferStatus: this.stateType
            }
            this.$axios(request).then((res)=>{
                if(res.success){
                    this.batchList  = res.data.list
                    this.page.currPage = res.data.currPage - 1
                    this.page.pageSize = res.data.pageSize
                    this.page.totalCount = res.data.totalCount
                }
            })
            .catch((error) => {
                this.$Message.error( this.$t(error) )
            })
        },
        //查看详情
        activityDetail (){
            let request   = operation.activityDetail
            request.params = {
                id : this.id
            }
            this.$axios(request).then((res)=>{
                if(res.success){
                    this.transferAccount  = res.data.transferInfo
                    this.detailedList     = res.data.transferDetail.list
                }
            })
            .catch((error) => {
                this.$Message.error( this.$t(error) )
            })
        },
        ok () {
            const data = new FormData();
            data.append('file', this.$refs.file.files[0]);
            let obj = operation.activityAdd;
            obj.params = {...this.formItem}
            // obj.params = {
            //     activityName: this.activityName,
            //     activityDetail: this.activityDetails,
            //     transferOutUserId: this.transferOutUserId,
            //     transferOutCurrency: this.transferOutCurrency,
            //     transferUserCount: this.transferUserCount,
            //     transferCurrencyCount: this.transferCurrencyCount,
            //     notificationTemplate: this.notificationTemplate,
            //     noticeType: this.noticeType,
            // }
            obj.data = data
            obj.headers.token = Cookies.get('token')
            this.$axios(obj).then((res)=>{
            })
        },
        cancel () {
            this.$Message.info('Clicked cancel');
        },
    }
}
</script>

<style lang="css">
</style>
