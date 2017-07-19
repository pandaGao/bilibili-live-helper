<template>
  <div class="help-container">
    <Row :gutter="8" class="tile-row">
      <Col span="4" class="tile-col">
        <Card class="tile-card" :padding="0">
          <Menu :active-name="currentPage" width="auto">
            <div class="menu-group">
              <Menu-item name="/about" @click.native="to('/help/about')">关于</Menu-item>
              <Menu-item name="/privacy" @click.native="to('/help/privacy')">隐私声明</Menu-item>
            </div>
          </Menu>
        </Card>
      </Col>
      <Col span="20" class="tile-col">
        <Card class="tile-card">
          <router-view></router-view>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  computed: {
    currentPage () {
      return this.$route.path.match(/\/\w*$/)[0]
    }
  },
  methods: {
    to (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="stylus" scoped>
.help-container
  display flex
  flex-direction column
  padding 10px
  height 100%
.tile-row
  flex 1
.tile-col
  display flex
  flex-direction column
  height 100%
.tile-card
  flex 1
</style>
