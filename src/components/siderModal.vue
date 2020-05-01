<template>
    <Modal
        class="sider-modal-box"
        :class-name="'sider-modal'"
        v-model="show"
        :width="'55%'"
        :title="title"
        @on-cancel="close"
    >
        <slot></slot>
        <div slot="footer"></div>
    </Modal>
</template>

<script>
    export default {
        name: "sider-modal",
        props:{
            modalShow:Boolean,
            close:Function,
            title:String
        },
        computed:{
            show(){
                return this.modalShow;
            }
        },
        data(){
            return {
            }
        }
    }
</script>

<style lang="less">
    .sider-modal-box{
        .ivu-modal-mask{display: none;}
    }
    .sider-modal{
        .ivu-modal{
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
            margin: 0;
            left: 200px;
            bottom: 0;
            top: 70px;
            position: fixed;
            .ivu-modal-content{
                height: 100%;
                border-radius: 0;
            }
        }
    }
</style>
