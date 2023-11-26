<template>
  <div class="grid">
    <oscillator></oscillator>
    <gain></gain>
    <destination></destination>
    <div id="temp-line"></div>
  </div>
</template>
<style scoped>
.grid {
  width: 70vw;
  height: 70vh;
  overflow: scroll;
  background-size: 20px 20px;
  background-image: radial-gradient(circle, #aaa 1px, black 0.5px);
  color: black;
}
#temp-line {
  position: absolute;
  height: 2px;
  background: rgb(105, 128, 0);
  transform: rotate(0deg);
  transform-origin: 0% 0%;
  pointer-events: none;
}
</style>
<script setup lang="ts">
let gridEl: HTMLDivElement;
let tempLine: HTMLDivElement;
let mouse = { x: 0, y: 0 };

let dragMouse = { x: 0, y: 0 };
let draggingEl: HTMLDivElement;
let dragging: boolean;

let connecting: boolean;
let connectingEl: HTMLDivElement;
let lineStart = { x: 0, y: 0 };

onMounted(() => {
  gridEl = document.querySelector(".grid")!;
  tempLine = document.querySelector("#temp-line")!;
  document.querySelectorAll(".node-wrapper").forEach((i) => {
    (<HTMLDivElement>i).firstChild!.addEventListener("mousedown", (e) => {
      dragMouse.x = (<MouseEvent>e).clientX;
      dragMouse.y = (<MouseEvent>e).clientY;
      draggingEl = <HTMLDivElement>i;
      dragging = true;
    });
  });
  gridEl.oncontextmenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  gridEl.addEventListener("mouseup", (e: MouseEvent) => {
    if (connecting) {
      //console.log(e)
      connecting = false;
      tempLine.style.width = 0 + "px";
    }
    dragging = false;
  });
  gridEl.addEventListener("mousemove", (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (connecting) {
      tempLine.style.transform = `rotate(${
        (Math.atan2(mouse.y - lineStart.y, mouse.x - lineStart.x) * 180) /
        Math.PI
      }deg)`;
      tempLine.style.width = `${Math.sqrt(
        (mouse.y - lineStart.y) ** 2 + (mouse.x - lineStart.x) ** 2
      )}px`;
    }
    if (dragging) {
      draggingEl.style.top =
        draggingEl.offsetTop - (dragMouse.y - e.clientY) + "px";
      draggingEl.style.left =
        draggingEl.offsetLeft - (dragMouse.x - e.clientX) + "px";
      dragMouse.x = e.clientX;
      dragMouse.y = e.clientY;
    }
  });
  document.querySelectorAll(".connector").forEach((i) => {
    (<HTMLDivElement>i).addEventListener("mousedown", (e: MouseEvent) => {
      //console.log((<HTMLDivElement>i).clientTop, e);
      connectingEl = <HTMLDivElement>i;
      lineStart.y = e.clientY;
      lineStart.x = e.clientX;
      tempLine.style.top = `${e.clientY}px`;
      tempLine.style.left = `${e.clientX}px`;
      connecting = true;
    });
    (<HTMLDivElement>i).addEventListener("mouseup", (e: MouseEvent) => {
      if (
        connecting &&
        connectingEl.parentElement?.parentElement !=
          (<HTMLDivElement>i).parentElement?.parentElement
      ) {
        let lineEl: HTMLDivElement;
        let cr: DOMRect = connectingEl.getBoundingClientRect();
        let cri: DOMRect = (<HTMLDivElement>i).getBoundingClientRect();
        if (
          connectingEl.classList.contains("right") &&
          (<HTMLDivElement>i).classList.contains("left")
        ) {
          lineEl = <HTMLDivElement>connectingEl.firstChild;
          lineEl.style.top = `${cr.width / 2}px`;
          lineEl.style.left = `${cr.width / 2}px`;
          lineEl.style.transform = `rotate(${
            (Math.atan2(cri.y - cr.y, cri.x - cr.x) * 180) / Math.PI
          }deg)`;
          lineEl.style.width = `${Math.sqrt(
            (cri.y - cr.y) ** 2 + (cri.x - cr.x) ** 2
          )}px`;
        }
        if (
          connectingEl.classList.contains("left") &&
          (<HTMLDivElement>i).classList.contains("right")
        ) {
          lineEl = <HTMLDivElement>i.parentElement?.querySelector(".line");
        }
      }
    });
  });
});
</script>
