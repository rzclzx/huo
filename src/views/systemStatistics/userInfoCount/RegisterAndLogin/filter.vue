<template>
    <div>
        <ul class="search-filter">
            <li>
                <Radio-btn :text="radioText" :value="radioValue" :checked="radioText[0]" @change="changeSearchBtn"/>
            </li>
            <li>
                <DatePicker format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            placement="right-start"
                            :placeholder="$t('申请时间-起 -- 申请时间-止')"
                            @on-change="dateChange"
                            style="width: 300px"></DatePicker>
            </li>
        </ul>
        <div class="submit-btn">
            <Button type="primary" size="large" @click="searchData">查询</Button>
        </div>
    </div>
</template>

<script>
    import {recharge, finance} from '__util/api';

    import RadioBtn from '__components/radioBtn'
    export default {
        name: "count-filter",
        components:{
            RadioBtn
        },
        methods: {
            changeSearchBtn(radio){
                console.log(radio.value)
                this.formData.type = radio.value;
            },
            dateChange(date){
                this.formData.startTime = date[0];
                this.formData.endTime = date[1];
            },
            searchData(){
                this.$emit('search', this.formData);
            }
        },
        data() {
            return {
                radioText: [ '注册/认证统计', '每日注册登录'],
                radioValue:[1,2],
                formData:{
                    beginRealAmount:0,
                    endRealAmount:0,
                }
            }
        }
    }
</script>

<style lang="less">
    .filter-group {
        margin-bottom: 15px;
    }
    .search-filter > li{
        margin-bottom: 15px;
    }
    .error{
        input {
            color:#f00
        }
    }
    .submit-btn{
        clear: both;
    }
</style>
