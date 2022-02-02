<template>
  <div class="container flex justify-center">
    <div>
      <input id="inputRef" class="w-full h-4 bg-gray-500" />
    </div>
    <div class="text-2xl text-blue-500">
      This is Temp
    </div>
  </div>
</template>

<script setup lang="ts">

onMounted(() => {
  const inputRef = document.getElementById('inputRef')

  const notification = useNotification()
  const notice = (msg: any) => {
    notification.create({
      content: msg,
      duration: 10000,
    })
  }
  const focus = () => {
    inputRef?.focus()
    notice('focus exec！')
  }
  focus()
})
</script>
