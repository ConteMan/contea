<template>
  <div class="w-full flex flex-col">
    <div class="flex-shrink-0 flex-grow-0 w-full pl-12 pr-8 py-4 flex justify-start items-center">
      <slot name="bar" />
    </div>
    <div class="w-full h-full pl-12 flex-grow flex-shrink">
      <slot name="content" />
    </div>
  </div>
</template>
