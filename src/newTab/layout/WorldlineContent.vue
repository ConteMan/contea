<template>
  <div class="worldline-container w-full h-full flex flex-col">
    <div class="worldline-bar-container flex-shrink-0 flex-grow-0 w-full min-h-[64px] pl-12 pr-8 py-3 flex justify-start items-center">
      <slot name="bar" />
    </div>
    <div class="worldline-content-container w-full pl-12 h-0 flex-grow flex-shrink">
      <slot name="content" />
    </div>
  </div>
</template>
