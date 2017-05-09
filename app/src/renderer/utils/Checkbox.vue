<template>
  <div class="check-box" @click="toggleValue">
    <div class="check-item">
      <div class="checked" v-if="!!value"></div>
    </div>
    <div class="check-label">{{label}}</div>
  </div>
</template>

<script>
export default {
  props: ['value', 'label'],
  methods: {
    toggleValue () {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style lang="stylus">
.check-box
  padding 2px
  cursor pointer
  .check-item
    display inline-block
    width 16px
    height 16px
    border 1px solid #66ccff
    border-radius 8px
    padding 2px
    vertical-align middle
  .checked
    width 100%
    height 100%
    border-radius 6px
    background-color #66ccff
  .check-label
    display inline-block
    margin-left 2px
    font-size 14px
    line-height 16px
    vertical-align middle
</style>
