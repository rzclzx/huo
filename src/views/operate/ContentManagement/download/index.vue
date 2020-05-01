<template>
    <Card>
        <div slot="title">
            <Radio-group v-if="langList.length>0" v-model="lang" type="button" @on-change="chooseLang">
                <Radio v-for="(lan,index) in langList" :key="index" :label="lan"></Radio>
            </Radio-group>
        </div>
        <div slot="extra" v-if="$store.state.user.checkPerm('content:download:add')">
            <Button style="margin: 0;" v-if="originLangList.length>0" type="primary" @click="addDownloadAddress">{{$t('添加下载地址')}}</Button>
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
               :width="550"
               :mask-closable="false"
               :title="modal.title"
               @on-visible-change="bannerModalVisible"
               v-model="modal.show">
            <Tabs v-model="modalTab" @on-click="tabsChange">
                <TabPane v-for="(formLan, index) in langList" :key="index" :label="formLan"
                         :name="originLangList[index] + ''">
                    <DownloadForm :lang="originLangList[index] + ''" :formParams="modalParams" v-on:commit="commitData" v-on:cancel="close"/>
                </TabPane>
            </Tabs>
            <div slot="footer"></div>
        </Modal>
    </Card>
</template>

<script>
    import DownloadForm from './form';
    import { operation } from '__util/api';

    export default {
        name: "download-manage",
        components:{
            DownloadForm
        },
        created(){
            document.getElementsByTagName('body')['0'].className = 'l-del';
            this.getLangList();
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
                if(!visible){
                    this.modalParams = null;
                    this.modalId = null;
                    this.setModalTabs()
                }
            },
            close(){
                this.modal.show = false;
                this.modalParams = null;
                this.modalId = null;
            },
            chooseLang(){
                this.page = 1;
                this.getDownloadList();
            },
            tabsChange(lang){
                if(this.modalId) {
                    this.getDownloadById(lang)
                }
            },
            getDownloadById(lang){
                const id = this.modalId;
                operation.getDownloadById.params = {id, lang};
                this.$axios(operation.getDownloadById).then((res)=>{
                    this.modalParams = res.data
                })
            },
            getLangList(){
                this.$axios(operation.getDownloadLangList).then((res)=>{
                    this.langList = res.data.map((item)=>{
                        return this.$t(`contentLang['${item}']`)
                    });
                    this.originLangList = [...res.data];
                    this.lang = this.langList[0];
                    this.modalTab = this.originLangList[0] + '';
                    this.getDownloadList();
                })
            },
            getLangValue(){
                const langValue = this.originLangList.filter((item)=>{
                    return this.$t(`contentLang['${item}']`) === this.lang;
                });
                return langValue.length > 0 ? langValue[0] : '';
            },
            getDownloadList(){
                operation.getDownloadList.params= {
                    lang: this.getLangValue(),
                    page: this.page
                };
                this.spinShow = true;
                this.$axios(operation.getDownloadList).then((res)=>{
                    this.dataList = res.data.list;
                    this.dataTotal = res.data.totalCount;
                    this.spinShow = false;
                }).catch((res)=>{
                    this.spinShow = false;
                })
            },
            edit(row) {
                this.modal.show = true;
                this.modalParams = row;
                this.modalId = row.id;
                this.setModalTabs()
            },
            del(row) {
                const config = {};
                config.title = this.$t('删除');
                config.content = this.$t('确认删除该下载地址')+'？';
                config.onOk = () => {
                    const id = row.id;
                    const lang = row.lang;
                    operation.delDownloadById.params = {id, lang};
                    this.$axios(operation.delDownloadById).then((res)=>{
                        this.getDownloadList();
                        setTimeout(()=> {
                            this.$Modal.success({title:this.$t('成功'),content:this.$t('删除成功')});
                        },500)
                    })
                };
                this.$Modal.confirm(config)

            },
            showImage(image){
                this.config.content = `<Image src=${image}></Image>`;
                this.$Modal.info(this.config)
            },
            commitData(params) {
                if (this.modalId && !this.$store.state.user.checkPerm('content:download:update')) {
                    this.$Modal.error(this.$t('无权限'))
                    return
                }
                if (!this.modalId && !this.$store.state.user.checkPerm('content:download:add')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }

                let axiosConfig = this.modalId ? {...operation.editDownload} : {...operation.addDownload};
                let modalText = '';
                if(this.modalId) {
                    modalText= this.$t('编辑成功');
                    params = {...params, id:this.modalId}
                }else{
                    modalText= this.$t('添加成功');
                }
                axiosConfig = {...axiosConfig, params};
                this.spinShow = true;
                this.$axios(axiosConfig).then((res) => {
                    this.$Modal.success({title:this.$t('成功'),content:modalText});
                    if (!this.modalId) {
                        this.modalParams = {...params};
                        this.modalParams.id = res.data.id;
                        this.modalId = res.data.id;
                    }
                    this.getDownloadList();
                    this.spinShow = false;
                }).catch((res)=>{
                    this.spinShow = false;
                })
            },
            handlePageChange(page){
                this.page = page;
                this.getDownloadList();
            },
            setModalTabs(){
                const index = this.langList.indexOf(this.lang);
                this.modalTab = this.originLangList[index]+ '';
            },
            addDownloadAddress(){
                this.modal.show = true;
                this.setModalTabs()
            },

            getLink(h, url){
                if(!url){
                    return this.$t('暂无链接跳转')
                } else {
                    const href = /^(https|http)?:\/\//.test(url)? url: `http://${url}`;
                    return h(
                        'div',
                        [
                            h('a', {
                                attrs: {
                                    target: '_blank',
                                    href
                                },
                            }, this.$t('链接跳转'))
                        ]
                    );
                }
            }
        },
        data() {
            return {
                spinShow: false,
                modal:{
                    title:'',
                    show:false
                },
                config:{
                    title:this.$t('图片详情')
                },
                dataList: [],
                lang: '',
                langList: [],
                originLangList: [],
                pageSize: 10,
                dataTotal: 0,
                page:1,
                modalId:null,
                modalParams:null,
                modalTab:null,
                columns: [
                    {
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        key: 'title',
                        renderHeader:() => {
                            return this.$t('下载标题')
                        }
                    },
                    {
                        key: 'intro',
                        renderHeader:() => {
                            return this.$t('下载简介')
                        }
                    },
                    {
                        title: this.$t('App Store地址'),
                        key: 'appStoreUrl',
                        renderHeader:() => {
                            return this.$t('App Store地址')
                        },
                        render: (h, {row}) => {
                            return this.getLink(h, row.appStoreUrl)
                        }
                    },
                    {
                        title: this.$t('Windows地址'),
                        key: 'windowUrl',
                        renderHeader:() => {
                            return this.$t('Windows地址')
                        },
                        render: (h, {row}) => {
                            return this.getLink(h, row.windowUrl)
                        }
                    },
                    {
                        key: 'androidUrl',
                        renderHeader:() => {
                            return this.$t('Android地址')
                        },
                        render: (h, {row}) => {
                            return this.getLink(h, row.androidUrl)
                        }
                    },
                    {
                        key: 'macUrl',
                        renderHeader:() => {
                            return this.$t('Mac地址')
                        },
                        render: (h, {row}) => {
                            return this.getLink(h, row.macUrl)
                        }
                    },
                    {
                        title: this.$t('操作'),
                        key: 'operation',
                        renderHeader:() => {
                            return this.$t('操作')
                        },
                        width: 150,
                        render: (h, {row}) => {
                            const doms = [];
                            if (this.$store.state.user.checkPerm('content:download:update')) {
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
                            if (this.$store.state.user.checkPerm('content:download:delete')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(row)
                                        }
                                    }
                                }, this.$t('删除')))
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
    .banner-container{
        background-color: #ffffff;
    }
</style>
