<script setup lang="ts">
import { useDraggable, watchDebounced } from '@vueuse/core'
import { useNewTabState } from '@newTab/store/index'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  x: {
    type: Number,
    default: 200,
  },
  y: {
    type: Number,
    default: 200,
  },
  w: {
    type: Number,
    default: 200,
  },
  h: {
    type: Number,
    default: 200,
  },
  showScroll: {
    type: Boolean,
    default: false,
  },
})

const data = reactive({
  name: props.name,
  x: props.x,
  y: props.y,
  width: props.w,
  height: props.h,
  lock: false,

  clientXStart: 0,
  clientYStart: 0,
})

const key = props?.name

const newTabStore = useNewTabState()

const getData = async () => {
  const res = newTabStore.getWorldlineDashboardLayoutItem(key)
  if (res) {
    const { x, y, width, height, lock = false } = res
    data.x = x
    data.y = y
    data.width = width
    data.height = height
    data.lock = lock
  }
}
getData()

const el = ref<HTMLElement | null>(null)
const resizeEl = ref<HTMLElement | null>(null)

const { x, y } = useDraggable(el, {
  initialValue: { x: data.x, y: data.y },
  preventDefault: true,
})
watch([x, y], (newValue) => {
  if (!data.lock) {
    data.x = newValue[0]
    data.y = newValue[1]
  }
})

const dealStyle = computed(() => {
  return {
    left: `${data.x > 0 ? data.x - 8 : 0}px`,
    top: `${data.y > 0 ? data.y - 8 : 0}px`,
    width: `${data.width}px`,
    height: `${data.height}px`,
  }
})

const resize = (x: number, y: number) => {
  const computedX = x - data.clientXStart
  data.width += computedX
  data.clientXStart = x

  const computedY = y - data.clientYStart
  data.height += computedY
  data.clientYStart = y
}

onMounted(() => {
  resizeEl.value?.addEventListener('mousedown', (e) => {
    if (data.lock)
      return

    data.clientXStart = e.clientX
    data.clientYStart = e.clientY
    e.preventDefault()

    document.onmousemove = (e) => {
      resize(e.clientX, e.clientY)
    }

    document.onmouseup = (_e) => {
      document.onmouseup = null
      document.onmousemove = null
    }
  })
})

const saveData = async (data: any) => {
  newTabStore.setWorldlineDashboardLayoutItem(key, data)
}

const storageObj = computed(() => {
  return {
    x: data.x,
    y: data.y,
    width: data.width,
    height: data.height,
    lock: data.lock,
  }
})

watchDebounced(storageObj,
  () => {
    saveData(storageObj.value)
  },
  { debounce: 500 })

const dealClass = computed(() => {
  return [
    props.showScroll ? 'overflow-auto' : 'overflow-auto hover-scroll',
  ]
})

const toggleLock = () => {
  data.lock = !data.lock
}
</script>

<template>
  <div
    class="drag-container flex flex-col fixed z-auto"
    :class="[!data.lock ? 'hover:(shadow shadow-sm shadow-gray-400)' : '']"
    :style="dealStyle"
  >
    <div class="action-bar opacity-0 h-[24px] w-full px-[8px] pt-[8px] flex-grow-0 flex justify-start items-center gap-2">
      <span ref="el" class="cursor-move flex justify-center items-center">
        <mdi-cursor-move :class="[data.lock ? 'text-light-600 w-0' : '']" />
      </span>
      <span class="cursor-pointer flex justify-center items-center" @click="toggleLock">
        <mdi-lock-off v-if="data.lock" />
        <mdi-lock v-else />
      </span>
    </div>
    <div
      class="flex-grow overflow-auto hover-scroll"
      :class="dealClass"
    >
      <slot />
    </div>
    <div
      ref="resizeEl"
      class="resize-btn absolute flex bottom-0 right-0 cursor-pointer opacity-0"
      :class="[data.lock ? '!opacity-0 cursor-default' : '']"
    >
      <mdi-arrow-bottom-right-thick />
    </div>
  </div>
</template>

<style lang="less">
.drag-container {
  &:hover {
    .resize-btn, .action-bar {
      opacity: 100;
    }
  }
}
</style>
