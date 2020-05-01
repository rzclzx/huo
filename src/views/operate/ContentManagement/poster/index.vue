<template>
    <Card>
        <div slot="title">
            <Radio-group v-if="langList.length>0" v-model="lang" type="button" @on-change="chooseLang">
                <Radio v-for="(lan,index) in langList" :key="index" :label="lan"></Radio>
            </Radio-group>
        </div>
        <div slot="extra" v-if="$store.state.user.checkPerm('content:poster:add')">
            <Button style="margin: 0;" v-if="originLangList.length>0" type="primary" @click="addBanner">{{$t('添加海报')}}</Button>
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
               class-name="modal-clear-line"
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
            <div slot="footer" style="border-top: 0"></div>
        </Modal>
    </Card>
</template>

<script>
    import ContentForm from './form';
    import { operation } from '__util/api';

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
                this.getPosterList();
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
                    this.getPosterList();
                })
            },
            getLangValue(){
                if (!this.$store.state.user.checkPerm('content:poster:lang:list')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                const langValue = this.originLangList.filter((item)=>{
                    return this.$t(`contentLang['${item}']`) === this.lang;
                });
                return langValue.length > 0 ? langValue[0] : '';
            },
            getPosterList(){
                if (!this.$store.state.user.checkPerm('content:poster:list')) {
                    this.$Modal.error(this.$t('无权限'));
                    return
                }
                let request = {...operation.posterList}
                request.params= {
                    lang: this.getLangValue(),
                    page: this.page
                };
                this.spinShow = true;
                this.$axios(request).then((res)=>{
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
                config.content = this.$t('确认删除')+'？';
                config.onOk = () => {
                    const id = row.id;
                    const lang = row.lang;
                    let request = operation.posterDelete
                    request.params = {id, lang};
                    this.$axios(request).then((res)=>{
                        this.getPosterList();
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

                let axiosConfig = this.modalId ? {...operation.posterUpdate} : {...operation.posterAdd};
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
                        this.modal.show = false
                    }
                    this.getPosterList();
                    this.spinShow = false;
                }).catch((res)=>{
                    this.spinShow = false;
                })
            },
            handlePageChange(page){
                this.page = page;
                this.getPosterList();
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
                            return this.$t('海报名称')
                        }
                    },
                    {
                        key: 'beginTime',
                        renderHeader:() => {
                            return this.$t('发布时间')
                        },
                        render: (h, params) => {
                            return this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')
                        }
                    },
                    {
                        key: 'type',
                        renderHeader:() => {
                            return this.$t('类型')
                        },
                        render: (h, params) => {
                            return this.$t('图片')
                            // return this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')
                        }
                    },
                    {
                        key: 'status',
                        renderHeader:() => {
                            return this.$t('状态')
                        },
                        render: (h, params) => {
                            let status = {
                                1: this.$t('上线'),
                                0: this.$t('poster["下线"]')
                            }
                            return status[params.row.status]
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
                        key: 'order',
                        renderHeader:() => {
                            return this.$t('排序(数字越大越靠前)')
                        }
                    },
                    {
                        key: 'operation',
                        renderHeader:() => {
                            return this.$t('操作')
                        },
                        render: (h, {row}) => {
                            const doms = [];
                            if (this.$store.state.user.checkPerm('content:poster:update')) {
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
                            if (this.$store.state.user.checkPerm('content:poster:delete')) {
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
