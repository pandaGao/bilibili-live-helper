<template>
  <div class="number-input">
    <div class="input-label">{{label}}</div>
    <div class="input-box">
      <input ref="input" type="number" class="input" :value="value" @input="updateValue($event.target.value)">
      <div class="input-unit">{{unit}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: NaN
    },
    max: {
      type: Number,
      default: NaN
    }
  },
  methods: {
    updateValue (val) {
      let newVal = val
      if (newVal !== val) {
        this.$refs.input.value = newVal
      }
      this.$emit('input', Number(newVal))
    }
  }
}
</script>

<style lang="stylus">
.number-input
  display flex
  width 100%
  .input-label
    flex 1
    padding 2px 4px
    font-size 14px
    line-height 16px
  .input-box
    flex 1
    .input
      width 4em
      border 1px solid #66ccff
      border-radius 4px
      padding 2px 6px
      font-size 14px
      line-height 16px
      outline 0
      color #66ccff
      background-color transparent
    .input-unit
      display inline-block
      padding 2px
      font-size 14px
      line-height 16px
</style>
