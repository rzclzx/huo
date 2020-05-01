<template>
    <Card>
        <div slot="title">
            <Radio-group v-if="langList.length>0" v-model="lang" type="button" @on-change="chooseLang">
                <Radio v-for="(lan,index) in langList" :key="index" :label="lan"></Radio>
            </Radio-group>
        </div>
        <div slot="extra" v-if="$store.state.user.checkPerm('pro:content:notice:add')">
            <Button style="margin: 0;" v-if="originLangList.length>0" type="primary" @click="addNotice">{{$t('添加公告')}}
            </Button>
        </div>
        <div style="position: relative;">
            <Table :no-data-text="$t('暂无数据')" :columns="columns" :data="dataList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
        <Page show-elevator v-if="Math.floor(dataTotal/pageSize) > 0"
              :total="dataTotal"
              :page-size="pageSize"
              size="small"
              show-total
              @on-change="handlePageChange"
              class="trial-pagition">
                    <slot>
                        {{ $t('共') + ' ' + dataTotal + ' ' + $t('条') }}
                    </slot>
              </Page>
        <Modal scrollable
               closable
               :width="700"
               :mask-closable="false"
               :title="modal.title"
               @on-visible-change="bannerModalVisible"
               v-model="modal.show">
            <Tabs v-model="modalTab" @on-click="tabsChange">
                <TabPane v-for="(formLan, index) in langList" :key="index" :label="formLan"
                         :name="originLangList[index] + ''">
                    <ContentForm :show="modal.show"
                                 :lang="originLangList[index] + ''"
                                 :formParams="modalParams"
                                 v-on:commit="commitData"
                                 v-on:cancel="close" />
                </TabPane>
            </Tabs>
            <div slot="footer"></div>
        </Modal>
    </Card>
</template>

<script>
    import ContentForm from './form';
    import {operation} from '__util/api';

    export default {
        name: "notice",
        components: {
            ContentForm
        },
        created() {
            document.getElementsByTagName('body')['0'].className = 'l-del';
            if ( this.$store.state.user.checkPerm('pro:content:notice:list') ) {
                this.getLangList();
            }
            document.getElementsByTagName('body')['0'].className = 'l-del';
        },

        watch: {
            '$store.state.app.lang': {
                handler: function (val, oldVal) {
                    this.langList = this.originLangList.map((item) => {
                        return this.$t(`contentLang['${item}']`);
                    });
                },
                deep: true
            }
        },
        methods: {
            bannerModalVisible(visible) {
                if (!visible) {
                    this.modalParams = null;
                    this.modalId = null;
                    this.setModalTabs()
                }
            },
            close() {
                this.modal.show = false;
                this.modalParams = null;
                this.modalId = null;
            },
            chooseLang() {
                this.page = 1;
                this.getNoticeList();
            },
            tabsChange(lang) {
                if (this.modalId) {
                    this.getNoticeById(lang)
                }
            },
            getNoticeById(lang) {
                const id = this.modalId;
                operation.getNoticeById.path = {id}
                operation.getNoticeById.params = {lang};
                this.$axios(operation.getNoticeById).then((res) => {
                    this.modalParams = res.data
                })
            },
            getLangList() {

                this.$axios(operation.getLangList).then((res) => {
                    this.langList = res.data.map((item) => {
                        return this.$t(`contentLang['${item}']`)
                    });
                    this.originLangList = [...res.data];
                    this.lang = this.langList[0];
                    this.modalTab = this.originLangList[0] + '';
                    this.getNoticeList();
                })
            },
            getLangValue() {
                const langValue = this.originLangList.filter((item) => {
                    return this.$t(`contentLang['${item}']`) === this.lang;
                });
                return langValue.length > 0 ? langValue[0] : '';
            },
            getNoticeList() {
                operation.getNoticeList.params = {
                    lang: this.getLangValue(),
                    page: this.page
                };
                if (this.$store.state.user.checkPerm('pro:content:notice:list')) {

                    this.spinShow = true;
                    this.$axios(operation.getNoticeList).then((res) => {
                        this.dataList = res.data.list;
                        this.dataTotal = res.data.totalCount;
                        this.dataTopList = this.dataList.filter((item) => {
                            return item.isTop === 1;
                        }).map((item) => {
                            return item.id
                        })
                        this.spinShow = false;
                    }).catch((res)=>{
                        this.spinShow = false;
                    })
                }
            },
            edit(row) {
                this.modal.show = true;
                this.modalParams = row;
                this.modalId = row.id;
                this.setModalTabs()
            },
            del(row) {
                if (!this.$store.state.user.checkPerm('pro:content:notice:delete')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                const config = {};
                config.title = this.$t('删除');
                config.content = this.$t('确认删除该公告') + '？';
                config.onOk = () => {
                    const id = row.id;
                    const lang = row.lang;
                    operation.delNoticeById.params = {id, lang};
                    this.$axios(operation.delNoticeById).then((res) => {
                        this.getNoticeList();
                        this.$Message.success(this.$t('删除成功'));
                    })
                };
                this.$Modal.confirm(config)

            },
            setToTop(row) {
                if (!this.$store.state.user.checkPerm('pro:content:notice:top')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                const params = {
                    id: row.id,
                    lang: row.lang,
                    isTop: row.isTop === 0 ? 1 : 0
                };
                operation.setNoticeTop.params = {...params};
                this.$axios(operation.setNoticeTop).then((res) => {
                    this.$Modal.success({title: this.$t('成功'), content: this.$t('操作成功')});
                    this.getNoticeList();
                })

            },
            showImage(image) {
                this.config.content = `<Image src=${image}></Image>`;
                this.$Modal.info(this.config)
            },
            commitData(data) {
                let axiosConfig = this.modalId ? {...operation.editNotice} : {...operation.addNotice};
                if (this.modalId && !this.$store.state.user.checkPerm('pro:content:notice:update')) {
                    this.$Modal.error(this.$t('无权限'))
                    return
                }
                if (!this.modalId && !this.$store.state.user.checkPerm('pro:content:notice:add')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                let modalText = '';
                if (this.modalId) {
                    modalText = this.$t('编辑成功');
                    data = {...data, id: this.modalId}
                } else {
                    modalText = this.$t('添加成功');
                }
                axiosConfig = {...axiosConfig, data};
                this.spinShow = true;
                this.$axios(axiosConfig).then((res) => {
                    this.$Modal.success({title: this.$t('成功'), content: modalText});
                    if (!this.modalId) {
                        this.modalParams = {...data};
                        this.modalParams.id = res.data.id;
                        this.modalId = res.data.id;
                    }
                    this.getNoticeList();
                    this.spinShow = false;
                }).catch((res)=>{
                    this.spinShow = false;
                })
            },
            handlePageChange(page) {
                this.page = page;
                this.getNoticeList();
            },
            setModalTabs() {
                const index = this.langList.indexOf(this.lang);
                this.modalTab = this.originLangList[index] + '';
            },
            addNotice() {
                this.modal.show = true;
                this.modalParams = null;
                this.modalId = null;
                this.setModalTabs()
            }
        },

        data() {
            return {
                modal: {
                    title: '',
                    show: false
                },
                config: {
                    title: this.$t('图片详情')
                },
                spinShow:false,
                dataList: [],
                lang: '',
                locale:this.$store.state.app.lang,
                langList: [],
                originLangList: [],
                dataTopList: [],
                pageSize: 10,
                dataTotal: 0,
                page: 1,
                modalId: null,
                modalParams: null,
                modalTab: null,
                columns: [
                    {
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        key: 'title',
                        renderHeader:() => {
                            return this.$t('标题')
                        }
                    },
                    {
                        key: 'created',
                        renderHeader:() => {
                            return this.$t('发布时间')
                        }
                    },
                    {
                        key: 'isShow',
                        renderHeader:() => {
                            return this.$t('是否显示')
                        },
                        render: (h, {row}) => {
                            return row.isShow === 1 ? this.$t('显示') : this.$t('不显示');
                        }
                    },
                    {
                        key: 'source',
                        renderHeader:() => {
                            return this.$t('来源名称')
                        },
                        render: (h, {row}) => {
                            if (row.sourceHref) {
                                const href = /^(https|http)?:\/\//.test(row.sourceHref) ? row.sourceHref : `http://${row.sourceHref}`;
                                return h('a', {
                                    attrs: {
                                        target: '_blank',
                                        href
                                    },
                                }, row.source);
                            } else {
                                return row.source
                            }
                        }
                    },
                    {
                        key: 'pv',
                        renderHeader:() => {
                            return this.$t('点击量')
                        }
                    },
                    {
                        key: 'operation',
                        renderHeader:() => {
                            return this.$t('操作')
                        },
                        width: 300,
                        render: (h, {row}) => {
                            let doms = [];
                            if (this.$store.state.user.checkPerm('pro:content:notice:top')) {
                                const index = this.dataTopList.indexOf(row.id) + 1;
                                doms.push(h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '15px'
                                        },
                                        on: {
                                            click: () => {
                                                this.setToTop(row)
                                            }
                                        }
                                    }, this.$t('取消置顶')),
                                    h('span', null, this.$t('置顶排位') + index))
                            }
                            if (row.isTop === 1) {
                                return h(
                                    'div',
                                    doms
                                )
                            }
                            doms = [];
                            if (this.$store.state.user.checkPerm('pro:content:notice:update')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(row)
                                        }
                                    }
                                }, this.$t('编辑')))
                            }
                            if (this.$store.state.user.checkPerm('pro:content:notice:delete')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(row)
                                        }
                                    }
                                }, this.$t('删除')))
                            }

                            if (this.$store.state.user.checkPerm('pro:content:notice:top')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.setToTop(row)
                                        }
                                    }
                                }, this.$t('置顶')))
                            }

                            return h(
                                'div',
                                doms
                            );
                        }
                    },
                ]
            }
        }
    }
</script>

<style lang="less">
    .banner-container {
        background-color: #ffffff;
    }
</style>
