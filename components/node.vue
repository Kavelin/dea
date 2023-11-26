<template>
  <div class="node-wrapper">
    <div class="node-wrapper-title">{{ name }}</div>
    <slot></slot>
  </div>
</template>
<style>
.node-wrapper {
  position: absolute;
  background: white;
  border: 1px solid #d3d3d3;
  text-align: center;
  user-select: none;
  border-radius: 5px;
  width:100px;
}

.node-wrapper-title {
  padding: 10px;
  cursor: move;
  background: white;
  border: 1px solid #d3d3d3;
}
.node-wrapper input[type=number] {
    background-color:white;
    min-width: 0;
}
</style>
<script setup lang="ts">
defineProps(["name", "x", "y"]);
</script>
