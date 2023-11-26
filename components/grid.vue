<template>
  <div class="grid">
    <oscillator></oscillator>
    <gain></gain>
    <destination></destination>
  </div>
</template>
<style scoped>
.grid {
  width: 70vw;
  height: 70vh;
  overflow: scroll;
  background-size: 20px 20px;
  background-image: radial-gradient(circle, white 1px, black 1px);
}
</style>
<script setup lang="ts">
let gridEl: HTMLDivElement;
let mouseX: number, mouseY: number;
onMounted(() => {
  gridEl = document.querySelector(".grid")!;

  document.querySelectorAll(".node-wrapper").forEach((i) => {
    let pos1: number, pos2: number;
    i.firstChild!.addEventListener("mousedown", (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gridEl.onmouseup = function () {
        gridEl.onmouseup = null;
        gridEl.onmousemove = null;
      };
      gridEl.onmousemove = (e: MouseEvent) => {
        pos1 = mouseX - e.clientX;
        pos2 = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        i.style.top = i.offsetTop - pos2 + "px";
        i.style.left = i.offsetLeft - pos1 + "px";
      };
    });
  });
  gridEl.oncontextmenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  document.querySelectorAll(".connector").forEach((i) => {
    i.addEventListener("mousedown", (e: MouseEvent) => {
      console.log("hi", i);
        /*let line = document.createElement("div");

      adjustLine(
        i,
        document.getElementById("div2"),
        line
      );*/
    });
  });
});
</script>
