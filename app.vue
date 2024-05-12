<script setup>
import saveTokens from './helpers/saveTokens';
let tokens = await saveTokens()
</script>
<template>
  <div class="bg-slate-800 min-h-screen text-gray-300 font-sans">
    <Form :tokens="tokens"></Form>
  </div>
</template>