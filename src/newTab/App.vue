<template>
  <Layout />
</template>

<script setup lang="ts">
import Layout from '~/newTab/layout/Index.vue'

const router = useRouter()
const route = useRoute()

browser.runtime.onMessage.addListener(async(message, sender) => {
  // eslint-disable-next-line no-console
  console.log({ message, sender })
  if (message.data === 'change-mode')
    router.push({ path: route.path === '/simple' ? '/home' : '/simple' })

  return 'success'
})
</script>
