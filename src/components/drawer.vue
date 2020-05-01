<template lang="html">
    <div class="drawer" :class="{'show': isShow}" ref="drawer">
        <div class="drawer-pane" :class="['slide-' + placement, {'show': isShow}]" :style="{width: width}">
            <div class="drawer-header">
                <slot name="header"></slot>
                <span @click="close"><Icon type="ios-close-empty"></Icon></span>
            </div>
            <div class="drawer-body">
                <slot></slot>
            </div>
        </div>
        <div class="drawer-bg" @click="close"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 控制显示
            isShow: false
        }
    },
    props: {
        // 滑出方向
        placement: {
            type: String,
            default: 'left',
            validator: function (value) {
                let val = ['left', 'right', 'top', 'bottom']
                return val.indexOf(value) > -1
            }
        },
        // 是否显示
        show: {
            type: Boolean,
            default: false
        },
        value: Boolean,
        // 宽度
        width: {
            type: String,
            default: '500px'
        }
    },
    mounted () {
        document.body.appendChild(this.$refs['drawer'])
    },
    methods: {
        // 关闭抽屉
        close () {
            this.isShow = false
            this.$emit('close')
            this.$emit('input', false)
        }
    },
    watch: {
        // 兼容改进前的写法，保留
        show (val) {
            this.isShow = val
        },
        // v-model模式
        value (val) {
            this.isShow = val
        }
    }
}
</script>

<style lang="less" scoped>
    .drawer {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        &.show {
            .drawer-bg {
                display: block;
            }
        }
        .drawer-bg {
            position: absolute;
            display: none;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,.0);
            z-index: 30;
        }
        .drawer-pane {
            position: absolute;
            display: flex;
            flex-direction: column;
            width: 500px;
            height: 100%;
            background-color: #fff;
            z-index: 31;
            transition: all .2s linear;
            box-shadow: 1px 4px 5px #aaa;
            &.slide-left {
                left: 0;
                border-right: 1px solid #ddd;
                transform: translateX(-100%);
            }
            &.slide-right {
                right: 0;
                border-left: 1px solid #ddd;
                transform: translateX(100%);
            }
            &.show {
                transform: translateX(0);
            }
            .drawer-header {
                position: relative;
                border-bottom: 1px solid #e9eaec;
                padding: 14px 16px;
                line-height: 1;
                font-size: 16px;
                i {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    margin-top: -15px;
                    font-size: 30px;
                    cursor: pointer;
                }
            }
            .drawer-body {
                padding: 20px;
                flex: 1;
                overflow-y: auto;
            }
        }
    }
</style>
