<template>
    <Card>
        <div slot="title">
            <Radio-group v-if="langList.length>0" v-model="lang" type="button" @on-change="chooseLang">
                <Radio v-for="(lan,index) in langList" :key="index" :label="lan"></Radio>
            </Radio-group>
        </div>
        <div slot="extra" v-if="$store.state.user.checkPerm('content:banner:add')">
            <Button style="margin: 0;" v-if="originLangList.length>0" type="primary" @click="addBanner">{{$t('添加Banner')}}</Button>
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
                    <ContentForm :show="modal.show"
                                 :lang="originLangList[index] + ''"
                                 :formParams="modalParams"
                                 v-on:commit="commitData"
                                 v-on:cancel="close"/>
                </TabPane>
            </Tabs>
            <div slot="footer"></div>
        </Modal>
    </Card>
</template>

<script>
    import ContentForm from './form';
    import { operation } from '__util/api';
    // import { select } from '__components/select/select';

    export default {
        name: "banner_index",
        components:{
            ContentForm
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
                this.getBannerList();
            },
            tabsChange(lang){
                if(this.modalId) {
                    this.getContentById(lang)
                }
            },
            getContentById(lang){
                const id = this.modalId;
                operation.getContentById.params = {id, lang};
                this.$axios(operation.getContentById).then((res)=>{
                    this.modalParams = res.data
                })
            },
            getLangList(){
                this.$axios(operation.getLangList).then((res)=>{
                    this.langList = res.data.map((item)=>{
                        return this.$t(`contentLang['${item}']`)
                    });
                    this.originLangList = [...res.data];
                    this.lang = this.langList[0];
                    this.modalTab = this.originLangList[0] + '';
                    this.getBannerList();
                })
            },
            getLangValue(){
                const langValue = this.originLangList.filter((item)=>{
                    return this.$t(`contentLang['${item}']`) === this.lang;
                });
                return langValue.length > 0 ? langValue[0] : '';
            },
            getBannerList(){
                if (!this.$store.state.user.checkPerm('content:banner:list')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                operation.getBannerList.params= {
                    lang: this.getLangValue(),
                    page: this.page
                };
                this.spinShow = true;
                this.$axios(operation.getBannerList).then((res)=>{
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
                if (!this.$store.state.user.checkPerm('content:banner:delete')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                const config = {};
                config.title = this.$t('删除');
                config.content = this.$t('确认删除该Banner')+'？';
                config.onOk = () => {
                    const id = row.id;
                    const lang = row.lang;
                    operation.delContentById.params = {id, lang};
                    this.$axios(operation.delContentById).then((res)=>{
                        this.getBannerList();
                        this.$Message.success(this.$t('删除成功'));
                    })
                };
                this.$Modal.confirm(config)

            },
            showImage(image){
                this.config.content = `<Image width="100%" src=${image}></Image>`;
                this.config.okText = this.$t('关闭')
                this.$Modal.info(this.config)
            },
            commitData(params) {
                if (this.modalId && !this.$store.state.user.checkPerm('content:banner:update')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                if (!this.modalId && !this.$store.state.user.checkPerm('content:banner:add')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }

                let axiosConfig = this.modalId ? {...operation.editBanner} : {...operation.addBanner};
                let modalText = '';
                if(this.modalId) {
                    modalText= this.$t('编辑成功');
                    params = {...params, id:this.modalId}
                }else{
                    modalText= this.$t('添加成功');
                }
                axiosConfig = {...axiosConfig};
                axiosConfig.data = {...params}
                this.spinShow = true;
                this.$axios(axiosConfig).then((res) => {
                    this.$Modal.success({title:this.$t('成功'),content:modalText});
                    if (!this.modalId) {
                        this.modalParams = {...params};
                        this.modalParams.id = res.data.id;
                        this.modalId = res.data.id;
                    }
                    this.getBannerList();
                    this.spinShow = false;
                }).catch((res)=>{
                    this.spinShow = false;
                })
            },
            handlePageChange(page){
                this.page = page;
                this.getBannerList();
            },
            setModalTabs(){
                const index = this.langList.indexOf(this.lang);
                this.modalTab = this.originLangList[index]+ '';
            },
            addBanner(){
                this.modal.show = true;
                this.setModalTabs()

            }
        },
        data() {
            return {
                spinShow : false,
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
                        key: 'adName',
                        renderHeader:() => {
                            return this.$t('广告名称')
                        }
                    },
                    {
                        key: 'img',
                        renderHeader:() => {
                            return this.$t('缩略图')
                        },
                        render: (h, {row}) => {
                            if(row.img===''){
                                return this.$t('暂无缩略图')
                            }else{
                                return h(
                                    'div',
                                    [
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    this.showImage(row.img)
                                                }
                                            }
                                        }, this.$t('查看图片'))
                                    ]
                                );
                            }
                        }
                    },
                    {
                        key: 'url',
                        renderHeader:() => {
                            return this.$t('跳转链接')
                        },
                        render: (h, {row}) => {
                            if(row.url===''){
                                return this.$t('暂无链接跳转')
                            } else {
                                const href = /^(https|http)?:\/\//.test(row.url)? row.url: `http://${row.url}`;
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
                    {
                        key: 'isShow',
                        renderHeader:() => {
                            return this.$t('是否显示')
                        },
                        render: (h, {row}) => {
                            return row.isShow === 1 ? this.$t('显示'): this.$t('不显示');
                        }
                    },
                    {
                        key: 'isClosable',
                        renderHeader:() => {
                            return this.$t('是否可关闭')
                        },
                        render: (h, {row}) => {
                            return row.isClosable === 1 ? this.$t('可以'): this.$t('不可以');;
                        }
                    },
                    {
                        key: 'beginTime',
                        renderHeader:() => {
                            return this.$t('开始时间')
                        },
                        width: 100
                    },
                    {
                        key: 'endTime',
                        renderHeader:() => {
                            return this.$t('结束时间')
                        },
                        width: 100
                    },
                    {
                        key: 'updateTime',
                        renderHeader:() => {
                            return this.$t('更新时间')
                        },
                        width: 100
                    },
                    {
                        key: 'order',
                        renderHeader:() => {
                            return this.$t('排序')
                        }
                    },
                    {
                        key: 'operation',
                        renderHeader:() => {
                            return this.$t('操作')
                        },
                        width: 150,
                        render: (h, {row}) => {
                            const doms = [];
                            if (this.$store.state.user.checkPerm('content:banner:update')) {
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
                            if (this.$store.state.user.checkPerm('content:banner:delete')) {
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
