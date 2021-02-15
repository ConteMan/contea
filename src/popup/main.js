import Vue from 'vue'
import App from './App.vue'

import Clipboard from 'clipboard'
Vue.directive('clipboard', {
  bind(el, bingind, vnode) {
    const clip = new Clipboard(el)
    el.dataset.clipboardText = bingind.value
    clip.on('success', e => {
      console.info('Action:', e.action)
      console.info('Text:', e.text)
      console.info('Trigger:', e.trigger)
      clip.destroy()
    })
    clip.on('error', e => {
      console.error('Action:', e.action)
      console.error('Trigger:', e.trigger)
      clip.destroy()
    })
  },
  update(el, bingind) {
    const clip = new Clipboard(el)
    el.dataset.clipboardText = bingind.value
    clip.on('success', e => {
      console.info('update Action:', e.action)
      console.info('update Text:', e.text)
      console.info('update Trigger:', e.trigger)
      clip.destroy()
    })
    clip.on('error', e => {
      console.error('update Action:', e.action)
      console.error('update Trigger:', e.trigger)
      clip.destroy()
    })
    console.log('update')
    console.log(bingind)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
