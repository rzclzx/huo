<template lang="html">
    <div class="autoQuery" v-if="$store.state.user.checkPerm('tab:oper:hblegalswitch')">
        <Card>
            <p slot="title">
                {{ $t('APP法币功能总控') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="addVersion" v-if="$store.state.user.checkPerm('oper:hblegalswitch:save')">{{ $t('添加版本') }}</Button>
            <Row type="flex" justify="center" align="middle" class="autoQueryList">
                <Table :columns="columns" :data="apps" style="width: 100%;"></Table>
            </Row>
        </Card>
        <Modal v-model="modalAdd" width="400" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('添加版本')}}</span>
            </p>
            <div style="text-align:left">
              <!-- <p>{{currForm}}</p> -->
                <Form :model="currForm" :label-width="100" ref="versionForm" :rules="ruleItem">
                    <FormItem prop="versionId" :label="$t('版本号')">
                      <Select v-model="currForm.versionId" clearable :placeholder="$t('选择版本号')" v-autoLocale>
                        <Option v-for="item in versions" :value="item.id" :key="item.id">{{ item.version }} </Option>
                      </Select>
                    </FormItem>
                    <FormItem prop="system" :label="$t('版本号')">
                        <RadioGroup v-model="currForm.system">
                          <Radio label="1">
                              <Icon type="social-android"></Icon>
                              <span>{{$t('安卓')}}</span>
                          </Radio>
                          <Radio label="2">
                              <Icon type="social-apple"></Icon>
                              <span>IOS</span>
                          </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="confirmSave">{{$t('确定')}}</Button>
                <Button type="ghost" @click="modalAdd = false">{{$t('返回')}}</Button>
            </div>
        </Modal>

       <Modal v-model="modalEdit" width="400" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('APP法币功能总控编辑')}}</span>
            </p>
            <div style="text-align:left">
                <Form :model="editForm" :label-width="100" ref="editForm" :rules="editruleItem">
                    <FormItem :label="$t('系统类型')">
                        <p>{{systemObj[this.editForm.system]}}</p>
                    </FormItem>
                    <FormItem :label="$t('版本号')">
                        <p>{{this.editForm.version}}</p>
                    </FormItem>

                    
                    <FormItem prop='fromDate' :label="$t('开始时间')">
                      <DatePicker v-model='editForm.fromDate' type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem prop="state" :label="$t('状态')">
                        <RadioGroup v-model="editForm.state">
                          <Radio :label="1">
                              <span>{{$t('开启')}}</span>
                          </Radio>
                          <Radio :label="2">
                              <span>{{$t('关闭')}}</span>
                          </Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem :label="$t('状态')">
                        <div v-if='editForm.state=="1"' class='text-success'>{{this.$t('开启')}}</div>
                        <div v-if='editForm.state=="2"' class='text-error'>{{this.$t('关闭')}}</div>
                    </FormItem>
                    
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="confirmUpdate">{{$t('确定')}}</Button>
                <Button type="ghost" @click="modalEdit = false">{{$t('返回')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { legalTender } from '__util/api'
import {Button} from 'iview'
const query = {

  list:{method:'get',url:'v1/oper/hblegalswitch/list'},
  versions:{method:'post',url:'v1/oper/hbterminalversion/list'},
  save:{method:'post',url:'v1/oper/hblegalswitch/save'},
  update:{method:'post',url:'v1/oper/hblegalswitch/update'},
  remove:{method:'post',url:'v1/oper/hblegalswitch/delete'},

}
// import BankAccountAdd from './bankAccountAdd.vue'
export default {
    components:{
        // BankAccountAdd1
    },
    bankinfo:{},
    data () {
        return {
            stateObj:{'1':this.$t('开启'),'2':this.$t('关闭')},
            systemObj:{'1':this.$t('安卓'),'2':'IOS'}, 
            fromDate:'',
            startDate:'',
            // 1 开启 2关闭
            // 2 安卓 2ios
            formTitle:'',
            apps:[],
            versions:[],
            modalAdd:false,
            modalEdit:false,
            currForm:{},
            editForm:{},
            editruleItem:{
                fromDate: [
                    {
                      type:'date',
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                state: [
                    {
                      type:'number',
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],

            },
            ruleItem: {
                versionId: [
                    {
                      type:'number',
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                system: [
                    {

                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],

                // bankName: [
                //     {
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],

                // remark: [
                //     {
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],


            },

            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('系统类型')
                    },
                    key: 'system',
                    render:(h,param)=>this.systemObj[param.row.system]

                },
                {
                    renderHeader: (h) => {
                        return this.$t('版本号')
                    },
                    key: 'version'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('生效时间')
                    },
                    key: 'fromDate',
                    render:(h,param)=>param.row.fromDate?this.$moment(param.row.fromDate).format('YYYY-MM-DD hh:mm:ss'):this.$t("无")
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'state',
                    render:(h,param)=>{
                        return param.row.state=='1'?<div class='text-success'>{this.$t('开启')}</div>:<div class='text-error'>{this.$t('关闭')}</div>
                    }
                    
                        
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作时间')
                    },
                    key: 'updateTime',
                    render:(h,param)=>param.row.updateTime?this.$moment(param.row.updateTime).format('YYYY-MM-DD hh:mm:ss'):this.$t("无")

                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作人')
                    },
                    key: 'operatorName'
                },


                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width:"200px",
                    align:"center",
                    key: 'value',
                    render: (h, params) => {

                        return <div style="width:200px;text-align:left">
                            {this.$store.state.user.checkPerm('oper:hblegalswitch:update')?<Button type='primary' size='small' onClick={()=>this.edit(params.row)}>{this.$t('编辑')}</Button>:null}
                            {(this.$store.state.user.checkPerm('oper:hblegalswitch:delete')&&params.row.state=='2')?<Button style="margin-left:5px;" type="error" size='small' onClick={()=>this.remove(params.row)}> {this.$t('删除')}</Button>:null}
                        </div>
                    }
                }

                // {
                //     renderHeader: (h) => {
                //         return this.$t('最低限额')
                //     },
                //     key: 'threshold'
                // },
                // {
                //     renderHeader: (h) => {
                //         return this.$t('追加保证金数额')
                //     },
                //     key: 'customType',
                // },


            ]
        }
    },
    mounted () {
        if(this.$store.state.user.checkPerm('oper:hblegalswitch:list')){
            this.getList()
            this.getVersions()
            
        }

    },


    methods: {
      remove(item){
            let self = this
                this.$Modal.confirm({
                    title: this.$t('删除'),
                    content: this.$t('确认删除')+'?',
                    async onOk(){

                        const obj = {...query.remove,data:{id:item.id}}
                        const res = await self.$axios(obj)
                        if(res.success){
                            self.$Message.success(self.$t('删除成功'))
                            self.getList()
                        }

                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });


      },
      edit(item){
        this.editForm = {...item}
        console.log(this.editForm.fromDate )
        if(this.editForm.fromDate){
            
            this.editForm.fromDate  =  new Date(this.editForm.fromDate)
        }else{
            this.editForm.fromDate =  ''
            
        }
        this.modalEdit = true
      },
      confirmUpdate(){
            this.$refs['editForm'].validate((valid) => {
                if (valid) {

                    this.update()
                    // this.saveSub()
                } else {
                    // this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
      },
      async update(){
        //   console.log(this.fromDate)
        let self = this
        let data
        data = {...query.update,data:{id:this.editForm.id,state:this.editForm.state,fromDate:this.$moment(this.editForm.fromDate).unix()*1000}}

        const res = await this.$axios(data)
        if(res.success){
          self.modalEdit = false
          self.$Message.success(self.$t('修改成功'))
          self.getList()
  
        }

      },
      async save(){
        // let
        let data
          data = {...query.save,data:this.currForm}
        const res = await this.$axios({...query.save,data:this.currForm})
        if(res.success){
          this.modalAdd = false
          this.$Message.success(this.$t('添加成功'))

        this.getList()
        }
      },
      confirmSave(){
            this.$refs['versionForm'].validate((valid) => {
                if (valid) {

                    this.save()
                    // this.saveSub()
                } else {
                    // this.$Message.error(this.$t('表单验证不通过!'));
                }
            })

      },
        addVersion(){
          this.modalAdd = true
        },
        async getVersions(){
            let res = await this.$axios(query.versions)
            // console.log(123,res)
            this.versions = res.data.list||[]
        },
        async getList (page) {

            let res = await this.$axios(query.list)
            // console.log(123,res)
            this.apps = res.data||[]

            // this.banks = res.data.list

        }
    },
    watch:{
      modalAdd(val){
        if(!val){
          this.currForm = {}
        }
      }
    }
}


</script>

<style lang="less">
.ivu-form-item{
  margin-bottom:10px;
}








</style>
