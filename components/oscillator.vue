<template>
    <node name="Oscillator">
      
      <prop>
        <div>Frequency: <input v-model="freq" type="number" max="20000" min="20" step="0.01"></div>
      </prop>
      <prop right>
         <div> Output </div>
      </prop>
    </node>
  </template>
  <script setup lang="ts">
   
  let freq = ref(20);
  </script>