<template lang="html">
    <div class="">
        <Radio-btn :text="radioText" :checked="radioText[0]" :value="radioValue" @change="changeRadio"></Radio-btn>
        <keep-alive>
            <component :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
import RadioBtn from '__components/radioBtn'
import dateCount from './dateCount'
import currencyCount from './currencyCount'
import income from './income'

export default {
    components: {
        RadioBtn,
        dateCount,
        currencyCount,
        income
    },
    data () {
        return {
            currentView: 'dateCount'
        }
    },
    mounted () {
        this.currentView = this.radioValue[0]
    },
    computed: {
        radioText () {
            let arr = []
            if ( this.$store.state.user.checkPerm('statistics:tabgetDate') ) {
                arr.push(this.$t('日期统计'))
            }
            // if ( this.$store.state.user.checkPerm('statistics:tabgetCurrency') ) {
            //     arr.push(this.$t('币种统计'))
            // }
            // if ( this.$store.state.user.checkPerm('statistics:tabgetIncome') ) {
            //     arr.push(this.$t('收入统计'))
            // }
            return arr
        },
        radioValue () {
            let arr = []
            if ( this.$store.state.user.checkPerm('statistics:tabgetDate') ) {
                arr.push('dateCount')
            }
            // if ( this.$store.state.user.checkPerm('statistics:tabgetCurrency') ) {
            //     arr.push('currencyCount')
            // }
            // if ( this.$store.state.user.checkPerm('statistics:tabgetIncome') ) {
            //     arr.push('income')
            // }
            return arr
        }
    },
    methods: {
        changeRadio (item) {
            this.currentView = item.value

        }
    }
}
</script>

<style lang="css">
</style>
