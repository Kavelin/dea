<template>
  <grid></grid>
</template>
<script setup lang="ts">

interface Node {
    x:number;
    y:number;
    id:number;
}
let gainno: GainNode, oscillator, ctx: AudioContext;

onMounted(() => {
  ctx = new window.AudioContext();
});
function startAudio(e: Event) {
  oscillator = ctx.createOscillator();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(890, ctx.currentTime);
  gainno = ctx.createGain();
  gainno.gain.value = 0.1;
  oscillator.connect(gainno);
  gainno.connect(ctx.destination);
  oscillator.start();
}
</script>
