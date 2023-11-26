<template>
    
    <div class="prop">
        
        <div class="connector left" v-if="left != undefined"></div>
         <slot></slot>
        <div class="connector right" v-if="right != undefined"></div>
      </div>
</template>
<script setup lang="ts">
defineProps(['left', 'right'])
</script>
<style scoped>

.connector {
  background: blue;
  width: 8px;
  height: 8px;
  position: relative;
  border-radius: 50%;
}
.prop {
    display:flex;
    align-items: center;
    justify-content: space-between;
}
.left {
    right:5px;
}
.right {
    left:5px;
}
</style>