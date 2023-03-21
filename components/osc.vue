<template>

    <p>Gain: {{ gainSlide }}</p>
    <input type="range" min="0" max="1" step="0.01" v-model="gainSlide" >
  </template>
  <script setup lang="ts">
  let gainSlide = ref(0);
  let gain:GainNode, oscillator;
  onMounted(() => {
    const ctx = new window.AudioContext();
  
    const oscillator = ctx.createOscillator();
  
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, ctx.currentTime);
    gain = ctx.createGain();
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
  
    document.addEventListener("click", e=> ctx.resume());
  });
  
  onUpdated(() => {
      gain.gain.value = gainSlide.value;
  })
  </script>
  