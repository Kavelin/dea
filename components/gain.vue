<template>
  <node name="Gain">
    
    <prop>
      <div>Gain: <input v-model="gain" type="number" max="1" min="0" step="0.01"></div>
    </prop>
    <prop left right>
       <div> Input Output </div>
    </prop>
  </node>
</template>
<script setup lang="ts">

let gain = ref(0);
</script>