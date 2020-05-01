<template lang="html">

    <Modal
        v-model="resultModal"
        title="结果反馈"
        :closable='false'
        :mask-closable='false'
        @on-cancel="cancel">
        
        <p class="text-center">共有
          <span class="text-primary">{{result.totalCount}}</span>  
          条UID，成功添加
          <span class="text-primary">{{result.successCount}}</span>  
          条，失败
          <span class="text-error">{{result.failureCount}}</span>  
          条
        </p>
        <Table  :columns="columns" :data="result.failureResults" style="width: 100%;margin:30px 0;"></Table>
        
        <div slot="footer">
            <Button v-if='showExcel' type="text" @click="outputFail"><span class='text-primary'>{{$t('导出失败Excel')}}</span> </Button>
            <Button style='marginRight:10px' type="primary" @click="cancelUpload">
              {{canceltext||$t('取消上传')}}
              
              </Button>
            <Button v-if='result.successCount>0' type="primary" @click="confirmUpload">{{$t('确定')}}</Button>
        </div>

        
    </Modal>
    
</template>

<style lang="css">
.text-center{
  text-align: center;
}
</style>

<script>

export default {
    // props:['show','total','success','fail','failList','key'],
    props:['show','result','operator','canceltext','noexcel'],
    computed:{
        resultModal:{
          get:function(){
            return this.show
          },
          set:function(val){
            this.$emit('update:show', val)
          }
        },
        showExcel(){
            // console.log(this.result.failureCount,this.noexcel)
            // failureCount是0 不显示
            // 如果failureCount不是0，并且noexcel是true 不显示
            // 否则就显示
            if(this.result.failureCount==0){
              return false
            }
            if(this.noexcel){
              return false
            }
            return true
        }

    },

    data () {
        return {
          columns:[
            {
              renderHeader: (h) => {
                  return this.$t('添加失败UID')
              },
              key: 'uid',
              render:(h,param)=>param.row.uid?param.row.uid:param.row.id
            },
            {
              renderHeader: (h) => {
                  return this.$t('失败原因')
              },
              key: 'reason'
            },
          ],
          uploadRes:{},
            format:['csv','xls','xlsx'],
        }
    },
    created(){

    },
    methods: {
      confirmUpload(){
        this.$emit('confirm',{key:this.result.key})
      },
      outputFail(){
        this.$emit('output',{key:this.result.key})
      },
      cancelUpload(){
        this.$emit('cancel',{key:this.result.key})
      },
      cancel () {
          this.$emit('cancel')
      },

    }
}
</script>


