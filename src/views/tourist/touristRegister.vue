<template>
  <div>
      <h3>watch 用法5：监听对象属性</h3>
      <input v-model="deepMessage.a.b">
      <span>{{copymessage}}</span>
  </div>
</template>

<script>
export default {
  watch: {
    'deepMessage.a.b': 'handleMessage'
  },
  data() {
    return {
      deepMessage: {
        a: {
          b: 'deep message'
        }
      },
      copymessage: ''
    }
  },
  methods: {
    handleMessage(value) {
      this.copymessage = value
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
