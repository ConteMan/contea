<template>
  <div>
    <p>{{ defaultText }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: browser.i18n.getMessage('extName'),
    },
  },
  mounted () {
    browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return this.msg
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
