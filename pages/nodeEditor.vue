<template>
    <div @click="startAudio">Start Audio</div>
    <grid></grid>
  
  </template>
  <script setup lang="ts">
  let gainno: GainNode, oscillator, ctx:AudioContext;
  
  onMounted(() =>{
    
    ctx = new window.AudioContext();
    
  })
  function startAudio(e:Event) {
    console.log(e.target!.parentElement.removeChild(e.target));
    oscillator = ctx.createOscillator();
  
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    gainno = ctx.createGain();
    gainno.gain.value = 1;
    oscillator.connect(gainno);
    gainno.connect(ctx.destination);
    oscillator.start();
  
  }
  
  </script>
  
  