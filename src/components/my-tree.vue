<template>
  <div>
    <Modal
      v-bind:title="title"
      v-model="mShow"
      width="350"
      @on-ok="ok"
      @on-cancel="cancel">
      <Tree ref="tree" :data="mList" :render="renderContent"></Tree>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'myTree',
  data () {
    return {
      mShow: false,
      mList: [],
      mCurrent: undefined,
      mCurrentData: undefined
    }
  },
  created () {
      this.init()
  },
  watch: {
    show: function (val) {
      this.mShow = val
    },
    list: function (val) {
      this.mList = this.trans(0, this.id, val)
    },
    mShow (val) {
        if ( !val ) {
            this.$emit('onClose')
        }
    }
  },
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '请添加标题'
    },
    list: Array,
    id: String
  },
  methods: {
    ok () {
      this.$emit('message',{
        isShow: false,
        data: this.mCurrentData || {}
      })
    },
    cancel () {
      this.$emit('message',{
        isShow: false
      })
    },
    init () {
      this.mList = this.trans(0, this.id, this.list)
    },
    trans (id, key, list) {
        let arr = []
        for (let i = 0;i < list.length;i++) {
            if (id === list[i].parentId) {
                let obj = {
                    title: list[i].name,
                    expand: false,
                    children: this.trans(list[i][key], key, list)
                }
                obj[key] = list[i][key]
                arr.push(obj)
            }
        }
        return arr
    },
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          fontSize: '16px'
        },
        on: {
          click: () => {
            this.mCurrent = data.nodeKey
            this.mCurrentData = data
          }
        }
      }, [
        h('Icon', {
          props: {
            type: data.children.length !== 0 ? (data.expand ? 'ios-folder-outline' : 'ios-folder') : 'ios-paper-outline'
          },
          style: {
            marginRight: '8px'
          }
        }),
        h('span', {
          class: ['hover',data.nodeKey === this.mCurrent && 'current']
        }, data.title)
      ])
    }
  }
}
</script>
<style>
.hover:hover{
  background-color: #d5e8fc!important;
  cursor: pointer;
}
.ivu-tree ul li{
    overflow: hidden;
    text-overflow: ellipsis;
}
.current{
  background-color: #d5e8fc;
}
</style>
