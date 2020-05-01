<template lang="html">
    <Row type="flex" justify="start" class="radio-btn-row">
        <div class="radio-btn" :class="{'active': checkedBtn === item || item === defaultText}" v-for="item,index in text" @click="clickItem(item,index)">{{ item }}</div>
    </Row>
</template>

<script>
export default {
    data () {
        return {
            // 选中的btn
            checkedBtn: '',
            // 默认选中
            defaultText: ''
        }
    },
    mounted () {
        this.defaultText = this.checked
    },
    props: {
        // 按钮显示的内容
        text: Array,
        // 对应的选中值
        value: Array,
        // 默认选中
        checked: String
    },
    methods: {
        clickItem (item, i) {
            this.defaultText = ''
            this.checkedBtn = item
            let index = this.text.indexOf(item)
            if ( index > -1 ) {
                if ( this.value && this.value[index] ) {
                    this.$emit('change', {text: item, value: this.value[index]})
                } else {
                    this.$emit('change', item, i)
                }
            }
        }
    },
    watch: {
        checked (val) {
            this.checkedBtn = val
        }
    }
}
</script>

<style lang="less">
.radio-btn-row {
    .radio-btn {
        min-width: 120px;
        height: 40px;
        padding: 0 10px;
        line-height: 40px;
        margin-right: 30px;
        background: #FFF;
        border: 1px solid #CED5E0;
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        transition: color .2s linear,background-color .2s;
        &:last-child {
            margin-right: 0;
        }
        &.active {
            background: #CED5E0;
        }
    }
}
</style>
