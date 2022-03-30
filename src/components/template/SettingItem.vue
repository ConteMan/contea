<template>
  <div class="flex border-l-2 border-l-gray-300 hover:(border-l-red-600)">
    <div class="flex-grow-1 flex flex-col justify-center">
      <slot name="left"></slot>
    </div>
    <div class="flex-grow flex flex-row justify-end items-center">
      <slot name="right"></slot>
    </div>
  </div>
</template>
