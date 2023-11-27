<template>
  <div class="grid">
    <div class="trans-wrap">
      <div id="temp-line"></div>
      <div id="context-menu">
        <ul>
          <li>oscillator</li>
          <li>gain</li>
          <li>destination</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
.grid {
  width: 70vw;
  height: 70vh;
  overflow: hidden;
  background-size: 20px 20px;
  background-image: radial-gradient(circle, #aaa 1px, black 0.5px);
  color: black;
}
#context-menu {
  position:absolute;
  display:none;
  background:white;
  
}
#context-menu ul {
  padding:4px;
  list-style-type:none!important;
}
.trans-wrap {
  transform: translate(50px, 50px);
}
#context-menu li:hover {
  cursor: pointer;
  background-image:linear-gradient(#000000aa, #000000aa)
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
let nodes: NodeListOf<HTMLDivElement>;
let menu:HTMLDivElement;
let mouse = { x: 0, y: 0 };
let translate = { x: 50, y: 50 };

let dragMouse = { x: 0, y: 0 };
let draggingEl: HTMLDivElement;
let dragging: boolean;

let connecting: boolean;
let connectingEl: HTMLDivElement;
let lineStart = { x: 0, y: 0 };

onMounted(() => {
  gridEl = document.querySelector(".grid")!;
  tempLine = document.querySelector("#temp-line")!;
  nodes = document.querySelectorAll(".node-wrapper")!;
  menu = document.querySelector("#context-menu")!;
  nodes.forEach((i) => {
    (<HTMLDivElement>i.firstChild!).addEventListener(
      "mousedown",
      (e: MouseEvent) => {
        dragMouse.x = e.clientX;
        dragMouse.y = e.clientY;
        draggingEl = <HTMLDivElement>i;
        dragging = true;
      }
    );
  });
  gridEl.oncontextmenu = (e: MouseEvent) => {
    menu.style.display = "block";
    menu.style.top = `${e.clientY - translate.y}px`;
    menu.style.left = `${e.clientX  - translate.x}px`;
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
  gridEl.addEventListener("mousedown", e=> { 
    menu.style.display = "none";
  })
  gridEl.addEventListener("mousemove", (e: MouseEvent) => {
    if (connecting) {
      mouse.x = e.clientX - translate.x;
      mouse.y = e.clientY - translate.y;
      tempLine.style.transform = `rotate(${
        (Math.atan2(
          mouse.y - lineStart.y,
          mouse.x - lineStart.x
        ) *
          180) /
        Math.PI
      }deg)`;
      tempLine.style.width = `${Math.sqrt(
        (mouse.y - lineStart.y) ** 2 +
          (mouse.x - lineStart.x) ** 2
      )}px`;
    } else if (dragging) {
      draggingEl.style.top =
        draggingEl.offsetTop - (dragMouse.y - e.clientY) + "px";
      draggingEl.style.left =
        draggingEl.offsetLeft - (dragMouse.x - e.clientX) + "px";
      dragMouse.x = e.clientX;
      dragMouse.y = e.clientY;
    } else {
      console.log(e.clientX - mouse.x);
      (<HTMLDivElement>(
        document.querySelector(".trans-wrap")
      )).style.transform = `translate(${translate.x}px, ${translate.y}px)`;

      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  });
  document.querySelectorAll(".connector").forEach((i) => {
    (<HTMLDivElement>i).addEventListener("mousedown", (e: MouseEvent) => {
      //console.log((<HTMLDivElement>i).clientTop, e);
      connectingEl = <HTMLDivElement>i;
      lineStart.y = e.clientY - translate.y;
      lineStart.x = e.clientX - translate.x;
      tempLine.style.top = `${lineStart.y}px`;
      tempLine.style.left = `${lineStart.x}px`;
      connecting = true;
    });
    (<HTMLDivElement>i).addEventListener("mouseup", (e: MouseEvent) => {
      if (
        connecting &&
        connectingEl.parentElement?.parentElement !=
          (<HTMLDivElement>i).parentElement?.parentElement &&
        connectingEl.classList.contains("right") &&
        (<HTMLDivElement>i).classList.contains("left")
      ) {
        let lineEl: HTMLDivElement;
        let cr: DOMRect = connectingEl.getBoundingClientRect();
        let cri: DOMRect = (<HTMLDivElement>i).getBoundingClientRect();
        lineEl = <HTMLDivElement>connectingEl.firstChild;
        lineEl.style.transform = `rotate(${
          (Math.atan2(cri.y - cr.y, cri.x - cr.x) * 180) / Math.PI
        }deg)`;
        lineEl.style.width = `${Math.sqrt(
          (cri.y - cr.y) ** 2 + (cri.x - cr.x) ** 2
        )}px`;
      }
    });
  });
});
function addElement(s:string) {
  
  gridEl.firstChild?.appendChild
}
</script>
