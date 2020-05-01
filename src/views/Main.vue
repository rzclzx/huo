<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'240px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                v-if="menuList.length>0"
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  :src="require('__images/huobi.svg')" key="max-logo"/>
                    <img v-show="shrink" :src="require('__images/logo-min.png')" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'240px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con" style="margin-right: 20px">
                    <!--<full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>-->
                    <!--<lock-screen></lock-screen>-->
                    <!--<message-tip v-model="mesCount"></message-tip>-->
                    <!--<theme-switch></theme-switch>-->

                    <div class="user-dropdown-menu-con flex-end-center">
                        <select class="selectLang" style="width:100px;" id="" :value="lang"  v-on:change="chooseLang" v-autoLocale>
                            <option v-for="item in langList" :value="item.value" :key="item.value">{{ item.label}}</option>
                        </select>
                        <a style="max-width: 120px" @click="changepass">{{$t('修改密码')}}</a>
                        <!-- <a style="max-width: 120px" @click="resetPerm">{{$t('刷新权限')}}</a> -->
                        <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown" placement="bottom-end">
                            <a href="javascript:void(0)">
                                <span class="main-user-name">{{ userName }}</span>
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                <DropdownItem name="loginout" divided>{{$t('退出登录')}}</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <!--<Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>-->
                    </div>
                </div>
            </div>
            <!--<div class="tags-con">-->
                <!--<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>-->
            <!--</div>-->
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'240px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view :key="key"></router-view>
                </keep-alive>
            </div>
        </div>
        <Modal v-model="show" width="600" @on-ok="submit" @on-cancel="cancel" :loading="loading">
            <h3 v-if="$store.state.user.checkPerm('sys:user:password')" class="modal-title" style="margin-bottom: 30px">{{$t('修改密码')}}</h3>
            <Form :model="obj" :rules="ruleItem" class="modal-form" ref="rule" :label-width="100">
                <FormItem :label="$t('旧密码')" prop="password">
                    <Input type="password" v-model="obj.password"></Input>
                </FormItem>
                <FormItem :label="$t('新密码')" prop="newPassword">
                    <Input type="password" v-model="obj.newPassword" :placeholder="$t('请输入8-15位的密码组合，必须包含大小写字母及数字。')"></Input>
                </FormItem>
                <FormItem :label="$t('新密码确认')" prop="reNewPassword">
                    <Input type="password" v-model="obj.reNewPassword"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import shrinkableMenu from './index/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './index/tags-page-opened.vue';
    import breadcrumbNav from './index/breadcrumb-nav.vue';
    // import fullScreen from './index/fullscreen.vue';
    // import lockScreen from './index/lockscreen/lockscreen.vue';
    // import messageTip from './index/message-tip.vue';
    // import themeSwitch from './index/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '../assets/util/util';
    import { login, sys } from '__util/api';
    import handler from '__util/publicMethod'

    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            // fullScreen,
            // lockScreen,
            // messageTip,
            // themeSwitch,
        },
        data () {
            return {
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                show: false,
                obj: {},
                loading: true,
                // 保存lang的原始值
                backLang: {},
                // 选中语言
                checkedLang: '',
                langList:[
                    {
                        label:'中文',
                        value:'zh-CN'
                    },
                    {
                        label:'日本語',
                        value:'jp-JA'
                    },
                    {
                        label:'한국어',
                        value:'ko-KR'
                    }
                    /*{
                        label:'英文',
                        value:'en-US'
                    }*/
                ],
                ruleItem: {
                    password: [
                        { required: true, message: this.$t('账号不能为空'), trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true,pattern:/^(?![^a-z]+$)(?![^A-Z]+$)(?!\\D+$).{8,15}$/, message: this.$t('密码不能为空，且包括大小写，8-15位'), trigger: 'blur' }
                    ],
                    reNewPassword: [
                        { required: true,pattern:/^(?![^a-z]+$)(?![^A-Z]+$)(?!\\D+$).{8,15}$/, message: this.$t('密码不能为空，且包括大小写，8-15位'), trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
            key() {
                return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
            },
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            chooseLang(e) {
                const lang = e.target.value;
                localStorage.lang = lang;
                this.$store.commit('switchLang', lang);
                util.title(this.$t(this.$route.meta.title));
                location.reload()
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    let obj = handler.clone(login.logout)
                    this.$axios(obj).then(res => {
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                    })
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            changepass () {
                this.show = true
            },
            submit () {
                this.$refs.rule.validate((valid) => {
                    if (valid) {
                        // 首次登陆弹出框修改密码确定
                        let obj = handler.clone(login.init)
                        obj.data = {...this.obj}
                        obj.data.password = util.md5(obj.data.password);
                        obj.data.newPassword = util.md5(obj.data.newPassword);
                        obj.data.reNewPassword = util.md5(obj.data.reNewPassword);
                        this.$axios(obj).then(res => {
                            this.loading = false;
                            this.$Modal.info({
                                content: this.$t('修改成功'),
                                onOk:()=>{
                                    this.show = false
                                }
                            })
                        }).catch((res) => {
                            this.loading = false
                            setTimeout(() => {
                                this.loading = true
                            }, 0)
                            if ( res === 'MGT00007' ) {
                                this.$store.commit('logout', this);
                                this.$router.push({
                                    name: 'login'
                                });
                            }
                        })
                    } else {
                        this.loading = false
                        setTimeout(() => {
                            this.loading = true
                        }, 0)
                    }
                });
            },
            cancel () {
                this.$refs.rule.resetFields()
            },
            // 刷新权限  测试用
            resetPerm () {
                this.$axios(sys.menu.menuUser).then(res => {
                    localStorage.userData = JSON.stringify(res.data)
                    this.$router.replace('/home')
                })
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                // window.location.reload();
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            show (val) {
                if ( !val ) {
                    this.obj = {}
                }
            }
        },
        mounted () {
            this.init();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        }
    };
</script>

<style lang="less">
.selectLang {
    display: block;
    height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dddee1;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s
}
</style>
