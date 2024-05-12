<script setup>
import saveTokens from './helpers/saveTokens';
import {ref, onMounted} from 'vue'
let tokens = await saveTokens()
const state = ref(true)

const changeState = () => {
  state.value = !state.value
}

const x = ref(0)
const y = ref(0)
onMounted(() => {
  console.log('Write me in telegram - @todverse😉')
  document.body.addEventListener('mousemove', (e) => {
    x.value = e.pageX
    y.value = e.pageY
  })
})
</script>
<template>
  <div 
    class="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute" 
    :style="{
      background: `radial-gradient(600px at ${x}px ${y}px, rgba(118 255 119 / 10%), transparent 80%)`
    }">
  </div>
  <div class="bg-slate-800 min-h-screen text-gray-50  font-sans" style="padding:30px;">
    <div class="shake" style="position: absolute; display: flex;">
      <a href="https://dev-todverse.vercel.app/" target="blank"><img style="width: 50px; height: 50px;" src="/icon.png"></a>
      <a href="https://dev-todverse.vercel.app/" target="blank"><h1 style="line-height: 50px; font-size: 30px; padding-left: 10px;">OneClickDeal</h1></a>
    </div>
    <div v-if="state" style="text-align: center; padding: 40px;">
      <h1 style="padding-bottom: 20px; font-size: 20px;">Вы можете создать сделку за пару кликов</h1>
      <a-button @click="changeState">Создать сделку</a-button>
    </div>
    <Form v-else :tokens="tokens" :chst="changeState"></Form>
  </div>
</template>

<style>
@keyframes tilt-shaking {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0eg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}
.shake:hover {
  cursor: pointer;
  animation: tilt-shaking .5s;
}
</style>