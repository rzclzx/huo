<template lang="html">
    <div>
        <Row type="flex" class="l-search" style="margin-bottom: 20px">
            <Input v-model="activityName" placeholder="活动名称" style="width: 200px; margin-right: 10px" class="l-grouping-input"></Input>
            <Button type="primary" v-on:click="filter" v-if="$store.state.user.checkPerm('dawn:operate:activity:list')">查询</Button>
        </Row>
        <Card>
            <p slot="title">
                活动批量转账待审核列表
            </p>
            <Button slot="extra" type="primary" v-on:click="show">添加批量转账</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="toExamineTable" :data="batchList" disabled-hover :no-data-text="$t('暂无数据')"></Table>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="page.totalCount" :page-size="page.pageSize" :current="page.currPage" @on-change="page" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.totalCount + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            page: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            batchList: [],
            totalCount: '',
            toExamineTable: [
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
                                account = this.$t('活动账户');
                                break;
                            case 6:
                                account = this.$t('返佣账户');
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
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.toExaminePop = true;

                                        this.auditID      = params.row.id;
                                        this.auditAdminId = params.row.auditAdminId;
                                        this.captcha      = '';
                                    }
                                }
                            }, '审核')
                        ]);
                    }
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
        }
    },
    methods: {
        page () {

        }
    }
}
</script>

<style lang="css">
</style>
