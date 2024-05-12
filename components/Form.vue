<script setup>
import {ref} from 'vue'

const tokens = defineProps(['tokens'])
console.log(tokens.tokens)

let phone = ''

const onChange = (e) => {
    phone = e.target.value
    console.log(phone)
}
</script>
<template>
    <div style="padding-top: 50px;">
        <a-form>
            
        </a-form>
        <!-- <form class="m-auto w-1/4 bg-slate-700 border-2 p-5 rounded-lg">
            <label for="phone">Номер телефона</label><br>
            <input @input="onChange" style="margin-top: 10px; margin-bottom: 10px;" class="bg-slate-800 rounded-lg" id="phone" type="number"><br>
            <label for="phone">Адрес</label><br>
            <input style="margin-top: 10px; margin-bottom: 10px;" class="bg-slate-800 rounded-lg" id="phone" type="text">
        </form> -->
    </div>
</template>
<style scoped>
input {
  border: none;
  outline: none;
}
input:hover {
  border: none;
  outline: none;
}
input:focus {
  border: none;
  outline: none;
}
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>