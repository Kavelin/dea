<template>
  <div class="modify" :style="{ width: `${50}%` }">
    <div
      class="grid"
      @wheel="
        ($event) => {
          pageModify.pan.y -= $event.deltaY / 2;
          pageModify.pan.x -= $event.deltaX / 2;
        }
      "
      :style="{
        backgroundPosition: `top ${pageModify.pan.y}px left ${pageModify.pan.x}px`,
      }"
      @contextmenu.prevent="gridCtxMenu"
      @mousedown="drag.grid($event, 'down', pageModify, gridMenu)"
      @mousemove="drag.grid($event, 'move', pageModify)"
      @mouseup="
        () => {
          pageModify.pan.moving = false;
          pageModify.tempLine.out = null;
        }
      "
      @mouseout="
        () => {
          pageModify.pan.moving = false;
        }
      "
    >
      <div
        class="node-wrap"
        v-if="pageModify.cur"
        :style="{
          transform: `translate(${pageModify.pan.x}px, ${pageModify.pan.y}px)`,
        }"
      >
        <div class="node" v-for="(node, i) in pageModify.cur.nodes" :style="{ top: node.y + 'px', left: node.x + 'px' }" :key="i">
          <div
            class="node-title"
            @mousedown.stop="drag.node($event, 'down', node)"
            @mousemove.stop="drag.node($event, 'move', node)"
            @mouseup.stop="drag.node($event, 'up', node)"
            @mouseout.stop="drag.node($event, 'up', node)"
          >
            {{ node.name }}
          </div>
          <div v-for="(attr, a) in node.attribute" class="prop" :key="a">
            <div v-if="'options' in attr">
              <select v-model="node.attribute[a].selected">
                <option style="color: black" v-for="opt in attr.options" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>
            <div v-if="'val' in attr">
              {{ node.attribute[a].name }}: <div contenteditable @keydown.enter.prevent="input($event, node.attribute[a])" 
              @focusout="input($event, node.attribute[a])">{{ node.attribute[a].val }}</div>
            </div>
          </div>
          <div
            v-for="(inp, i) in node.input"
            :key="i"
            class="prop input"
            @mouseup="
              () => {
                console.log(pageModify.tempLine);
                if (pageModify.tempLine.out && !pageModify.tempLine.out.outs.some((x) => x.index == i) && !inp.node && node != pageModify.tempLine.out.node) {
                  pageModify.tempLine.out.outs.push({ node, index: i });
                  inp.node = pageModify.tempLine.out.node;
                  inp.index = pageModify.tempLine.index;
                  pageModify.tempLine.out = null;
                }
              }
            "
          >
            <div class="connector left"></div>
            <div>{{ inp.name + inp.index }}</div>
          </div>

          <div v-for="(out, o) in node.output" :key="o" class="prop output">
            <div>{{ out.name }}</div>
            <div
              class="connector right"
              @mousedown="
                ($event) => {
                  pageModify.tempLine.out = out;
                  pageModify.tempLine.out.node = node;
                  pageModify.tempLine.index = o;
                  pageModify.tempLine.el = $event.target;
                }
              "
            >
              <div
                class="line"
                v-for="(line, j) in out.outs"
                :key="j"
                :style="{
                  width: `${Math.sqrt(
                    (line.node.y + line.index * 30 + line.node.attribute.length * 30 - node.input.length * 30 - node.y - o * 30 - node.attribute.length * 30) ** 2 + (line.node.x - node.x - 100) ** 2
                  )}px`,
                  transform: `rotate(${
                    (Math.atan2(line.node.y + line.index * 30 + line.node.attribute.length * 30 - node.input.length * 30 - node.y - o * 30 - node.attribute.length * 30, line.node.x - node.x - 100) *
                      180) /
                    Math.PI
                  }deg)`,
                }"
              >
                {{ line.index }}
              </div>
              <div
                id="temp-line"
                class="line"
                v-if="pageModify.tempLine.out == out"
                :style="{
                  width: `${Math.sqrt(pageModify.tempLine.mouse.y ** 2 + pageModify.tempLine.mouse.x ** 2)}px`,
                  transform: `rotate(${(Math.atan2(pageModify.tempLine.mouse.y, pageModify.tempLine.mouse.x) * 180) / Math.PI}deg)`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="context-menu" ref="gridMenu">
        <ul>
          <li v-for="n in nodes" @mousedown.stop="ctxMenuClick($event, n, pageModify)" :key="n.name">
            {{ n.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  width: 100%;
  height: 100%;
  background-size: 30px 30px;
  background-image: linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px);
  overflow: hidden;
}

.node-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.node {
  position: absolute;
  background: black;
  border: 1px solid #d3d3d3;
  text-align: center;
  user-select: none;
  border-radius: 5px;
  width: 100px;
  color: white;
}

.node-title {
  padding: 10px;
  cursor: move;
  color: white;
  border: 1px solid #d3d3d3;
}

.connector {
  background: orange;
  width: 8px; 
  height: 8px;
  position: relative;
  border-radius: 50%;
}

.line {
  position: absolute;
  z-index: -1;
  height: 2px;
  background: rgb(96, 0, 128);
  transform: rotate(45deg);
  transform-origin: 0% 0%;
  width: 500px;
  top: 4px;
  left: 4px;
  pointer-events: none;
}

.prop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
}

.left {
  right: 5px;
}

.right {
  left: 5px;
}

select {
  display: inline-flex;
  border: none;
  outline: none;
  background: inherit;
  color: inherit;
}

.context-menu {
  position: absolute;
  display: none;
  background: black;
}

.context-menu ul {
  padding: 4px;
  list-style-type: none !important;
}

.context-menu li:hover {
  cursor: pointer;
  background-image: linear-gradient(#ffffffaa, #ffffffaa);
}


div[contenteditable] {
    width: min-content;
    outline: none;
    padding: 4px;
    display: inline;
}

div[contenteditable]:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    box-shadow: #e6794eee 0px 0px 5px 0px;
}

</style>
<script lang="ts" setup scoped>
const props = defineProps(["pageModify"]);
import * as drag from "../ts/drag";
import * as nodes from "../ts/audio";
import { type Attribute, type Modify } from "../ts/types";
let gridMenu = ref(null);
let gridCtxMenu = (e: MouseEvent) => {
  let ele = <HTMLDivElement>gridMenu.value!;
  ele.style.display = "block";
  ele.style.top = `${e.clientY}px`;
  ele.style.left = `${e.clientX}px`;
};

let ctxMenuClick = (e: MouseEvent, node: new (x: number, y: number) => any, mod: Modify) => {
  (<HTMLDivElement>gridMenu.value!).style.display = "none";
  mod.cur!.nodes.push(new node(e.clientX - document.querySelector(".grid")!.getBoundingClientRect().y - mod.pan.x, e.clientY - document.querySelector(".grid")!.getBoundingClientRect().y - mod.pan.y));
};

let input = (e: Event, attr: Attribute) => {
  let el = <HTMLDivElement>e.target!;
  let val: any = el.innerText;
  val = Number(val);
  if (!isNaN(val)) attr.val = val > attr.max ? attr.max : val < attr.min ? attr.min : val;
  el.innerText = attr.val!.toFixed(0).toString();
};
</script>
