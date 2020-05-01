<template lang="html">
<div>

        <Modal
            v-model="groupModal"
            :title="form.id?$t('修改额度组'):$t('添加额度组')"
            class-name="modal-clear-line"
            width="800px"
            @on-cancel='cancel'
            >

<!-- <pre>{{form}}</pre> -->
    <Form :model="form" :rules="ruleItem" :label-width="100" ref="groupForm" >
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="groupName" :label="$t('额度组名称')">
                    <Input v-model="form.groupName" ></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem prop="dailyAmount" :label="$t('1日累计限额')">
                    <Input v-model="form.dailyAmount"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="30">
            <Col span="12">
                <FormItem prop="monthlyAmount" :label="$t('1月累计限额')">
                    <Input v-model="form.monthlyAmount" ></Input>
                </FormItem>
            </Col>

        </Row>
          <FormItem prop="remark" :label="$t('备注')">
              <Input type="textarea" v-model="form.remark" :rows="4"></Input>
          </FormItem>
          <FormItem prop="uploadfile" :label="$t('UID')">
            <FileUpload ref="uploadfile" v-on:success="uploadSuccess" action="/v1/legal/withdrawlegalgroup/batchUpload" name='uploadfile' :format="format">
            </FileUpload>
              <p>{{ $t('请将用户UID在CSV表格中按行输入并上传，此操作是新增用户，不改变已存在的记录') }}</p>

            <!-- {{uploadfile}} -->
          </FormItem>
          <div style='text-align:center'>
                <Button type="primary" @click="save">{{$t('保存')}}</Button>

          </div>
    </Form>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>

<!-- :result="" :operator="" -->
        <UploadResult :show.sync='resultModal' @output="outputFail" :result="uploadRes" @cancel="cancelUpload" @confirm='confirmUpload' ></UploadResult>

    </div>
</template>

<style lang="css">
.text-center{
  text-align: center;
}
</style>

<script>
import { legalTender } from '__util/api'
import FileUpload from '@/components/fileUpload'
import UploadResult from '@/components/uploadResult'
import util from '__util/util.js'
// console.log(123,download)
export default {
    components:{
      FileUpload,
      UploadResult
    },
    props:['form','show'],
    computed:{
        groupModal:{
          get:function(){
            return this.show
          },
          set:function(val){
            this.$emit('update:show', val)
          }
        }
    },
    data () {
        return {
          resultModal:false,
          uploadfile:null,
          uploadModal:false,
            ruleItem: {
                groupName: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    }
                ],
                // dailyAmount: [
                //     {
                //         required: false,
                //         // message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],
                // monthlyAmount: [
                //     {
                //         required: false,
                //         // message: this.$t('不能为空'),
                //         trigger: 'blur'
                //     }
                // ],
                remark: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'blur'
                    }
                ]
            },



          columns:[
            {
              renderHeader: (h) => {
                  return this.$t('添加失败UID')
              },
              key: 'uid'
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
    watch:{
      groupModal:function(val){
          if(!val){
            this.$refs.uploadfile.clearFiles()
        
          }

      }
    },
    methods: {
      confirmUpload({key}){
        this.form.key=key
        this.resultModal=false
      },
      async outputFail(){
        const key = this.uploadRes.key
        const obj = {...legalTender.exportFailureUid,url:legalTender.exportFailureUid.url+'?key='+key}
        const res = await this.$axios(obj)
        util.download(res.data)
        console.log(res)
      },
      async cancelUpload(){
        const key = this.uploadRes.key
        const obj = {...legalTender.cancelUpload, data:{key}}
        const res = await this.$axios(obj)
        if(res.success){
          this.resultModal=false
          this.uploadRes = {}
          this.$refs.uploadfile.clearFiles()
        }
      },
        uploadSuccess(res,file){
          if(res.key){
            this.uploadRes = res
            // this.uploadModal = true
            this.resultModal = true
          }
          // console.log(res)
        },
        cancel () {
          this.$emit('update:show', false)
        },
        async save () {
            if(this.form.dailyAmount){
              this.form.dailyAmount = Number(this.form.dailyAmount)
            }
            if(this.form.monthlyAmount){
              this.form.monthlyAmount = Number(this.form.monthlyAmount)
            }

            if(this.form.monthlyAmount<this.form.dailyAmount){
              this.$Message.error('1月累计限额应大于1日累计限额')
              return false
            }
            
            const self = this
          this.$refs['groupForm'].validate(async function(valid){
                if (valid) {



                    if(self.form.id){
                      // 修改

                      const obj = {...legalTender.groupupdate,data:self.form}
                      const res = await self.$axios(obj)
                      if(res.success){
                        self.$emit('success')
                        self.$Message.success(self.$t('修改成功'))
                        
                      }
                    }else{
                      // 添加
                      const obj = {...legalTender.groupsave,data:self.form}
                      const res = await self.$axios(obj)
                      if(res.success){
                        self.$emit('success')
                        self.$Message.success(self.$t('添加成功'))
                        
                      }
                    }



                }
            });



          // console.log()
          // console.log(this.uploadRes.key)

            // this.add()
        }
    }
}
</script>
