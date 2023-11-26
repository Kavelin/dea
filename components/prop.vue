<template>
  <div class="prop">
    <div class="connector left" v-if="left != undefined"></div>
    <slot></slot>
    <div class="connector right" v-if="right != undefined">
      <div class="line"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps(["left", "right"]);
</script>
<style scoped>
.connector {
  background: orange;
  width: 8px;
  height: 8px;
  position: relative;
  border-radius: 50%;
}
.line {
  position: absolute;
  height: 2px;
  background: rgb(105, 128, 0);
  transform: rotate(0deg);
  transform-origin: 0% 0%;
  pointer-events: none;
}
.prop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left {
  right: 5px;
}
.right {
  left: 5px;
}
</style>
