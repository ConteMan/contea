<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.title = 'Contea'
  },
}
</script>

<style>
html,body {
  scroll-behavior: smooth;
}
html {
  width: 100%;
  height: 100%;
}
</style>
