<template>
  <div class="user-config">
    <Row :gutter="8" class="tile-row">
      <Col class="tile-col" span="12">
        <Card class="tile-card">
          <p slot="title">房管管理</p>
          <Input v-model="newAdmin" class="admin-input" placeholder="请填写用户名或UID" @on-enter="addNewAdmin">
            <Button slot="append" @click="addNewAdmin">任命房管</Button>
          </Input>
          <Table size="small" height="410" :columns="adminListConfig" :data="adminList"></Table>
        </Card>
      </Col>
      <Col class="tile-col" span="12">
        <Card class="tile-card">
          <p slot="title">禁言管理</p>
          <Input v-model="newBlock" class="admin-input" placeholder="请填写用户名或UID" @on-enter="addNewBlock">
            <Select v-model="blockTime" slot="prepend" placeholder="禁言时间" style="width: 96px">
              <Option :value="1">一小时</Option>
              <Option :value="24">一天</Option>
              <Option :value="168">一周</Option>
              <Option :value="720">一个月</Option>
            </Select>
            <Button slot="append" @click="addNewBlock">禁言用户</Button>
          </Input>
          <Table size="small" height="370" :columns="blockListConfig" :data="blockList"></Table>
          <Row class="pager-row">
            <Col span="12">
              <Button type="ghost" @click="previousBlockPage">上一页</Button>
            </Col>
            <Col span="12">
              <Button type="ghost" style="float: right;" @click="nextBlockPage">下一页</Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { Util } from 'bilibili-live'

export default {
  data () {
    return {
      newAdmin: '',
      adminList: [],
      adminListConfig: [
        {
          title: '房管名称',
          width: 160,
          key: 'name'
        },
        {
          title: '任命时间',
          key: 'ctime'
        },
        {
          title: '操作',
          width: 75,
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.removeAdmin(params.index)
                  }
                }
              }, '撤销')
            ])
          }
        }
      ],
      newBlock: '',
      blockTime: 720,
      blockListPage: 1,
      blockList: [],
      blockListConfig: [
        {
          title: '用户名称',
          width: 160,
          key: 'name'
        },
        {
          title: '解禁时间',
          key: 'etime'
        },
        {
          title: '操作',
          width: 75,
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.removeBlock(params.index)
                  }
                }
              }, '撤销')
            ])
          }
        }
      ]
    }
  },
  computed: {
    userRoomID () {
      return this.userService.getUserRoom().id
    },
    userService () {
      return this.$store.state.userService
    }
  },
  created () {
    this.getAdminList()
    this.getBlockList()
  },
  methods: {
    getAdminList () {
      Util.getRoomAdmin(this.userRoomID).then(res => {
        this.adminList = res.map(data => {
          return {
            id: data.admin.id,
            name: data.admin.name,
            ctime: data.ctime
          }
        })
      })
    },
    getBlockList () {
      Util.getRoomBlockList(this.userRoomID, this.blockListPage).then(res => {
        this.blockList = res.map(data => {
          return {
            id: data.id,
            name: data.user.name,
            etime: data.blockEndTime
          }
        })
      })
    },
    previousBlockPage () {
      if (this.blockListPage == 1) return
      this.blockListPage -= 1
      this.getBlockList()
    },
    nextBlockPage () {
      if (!this.blockList.length) return
      this.blockListPage += 1
      this.getBlockList()
    },
    addNewAdmin () {
      this.userService.addAdmin(this.newAdmin).then(res => {
        this.newAdmin = ''
        let data = JSON.parse(res)
        if (data.msg) {
          this.$Message.error(data.msg)
        } else {
          this.$Message.success('成功任命管理员')
        }
        this.getAdminList()
      })
    },
    addNewBlock () {
      this.userService.blockUser(this.newBlock, this.blockTime).then(res => {
        this.newBlock = ''
        let data = JSON.parse(res)
        if (data.msg) {
          this.$Message.error(data.msg)
        } else {
          this.$Message.success('成功禁言该用户')
        }
        this.getBlockList()
      })
    },
    removeAdmin (idx) {
      let adminID = this.adminList[idx].id
      this.userService.deleteAdmin(adminID).then(res => {
        let data = JSON.parse(res)
        if (data.msg) {
          this.$Message.error(data.msg)
        } else {
          this.$Message.success('成功撤销管理员')
        }
        this.getAdminList()
      })
    },
    removeBlock (idx) {
      let blockID = this.blockList[idx].id
      this.userService.deleteBlockUser(blockID).then(res => {
        let data = JSON.parse(res)
        if (data.msg) {
          this.$Message.error(data.msg)
        } else {
          this.$Message.success('成功撤销禁言')
        }
        this.getBlockList()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.user-config
  display flex
  .tile-row
    flex 1
  .tile-col
    height 100%
    display flex
    flex-direction column
  .tile-card
    flex 1
    display flex
    flex-direction column
  .config-menu
    height 100%
  .admin-input
    margin-bottom 8px
  .pager-row
    margin-top 8px

</style>
