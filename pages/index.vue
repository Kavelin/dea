<template>
  <div id="container">
    <div id="top-bar">
      <div id="left">
        <div contenteditable id="tempo" title="tempo" size="1" type="number" @keydown.enter.prevent="inputs"
          @focusout="inputs">120</div>
        <div>
          <div title="time signature top" size="1" contenteditable @keydown.enter.prevent="inputs" @focusout="inputs">{{
            timeSig.top }}</div> / <div title="time signature bottom" @keydown.enter.prevent="inputs" @focusout="inputs"
            contenteditable>{{
              timeSig.bottom }}</div>
        </div>
      </div>
      <div id="mid">
        <button title="play" @click="position = 0">⏪</button>
        <button title="play" @click="playBtn">⏯</button>
        <button title="stop" @click="stopBtn">🟦</button>
        <button title="warp to play line" @click="warpBtn">⚓</button>
        <button title="record">🔴</button>
      </div>
      <div id="right"></div>
    </div>
    <div id="not-top-bar">
      <div id="modify">
        <div class="grid" :style="{
          backgroundPosition: `top ${pageModify.pan.y}px left ${pageModify.pan.x}px`,
        }" @contextmenu.prevent="gridCtxMenu" @mousedown="($event)=> {
            drag.grid($event, 'down', pageModify);
            (<HTMLDivElement>gridMenu!).style.display = 'none';
          }" @mousemove="drag.grid($event, 'move', pageModify)"
          @mouseup="pageModify.pan.moving = false;" @mouseout="pageModify.pan.moving = false;">
          <div class="node-wrap" v-if="pageModify.cur" :style="{
            transform: `translate(${pageModify.pan.x}px, ${pageModify.pan.y}px)`,
          }">
            <div class="node" v-for="(node, i) in pageModify.cur.nodes"
              :style="{ top: node.y + 'px', left: node.x + 'px' }" :key="i">

              <div class="node-title" @mousedown.stop="drag.node($event, 'down', node)" @mousemove.stop="drag.node($event, 'move', node)"
          @mouseup.stop="drag.node($event, 'up', node)" @mouseout.stop="drag.node($event, 'up', node)">{{ node.name }}</div>

              <prop v-for="inp, i in node.input" :key="i" left>
                <div> {{ inp.name }}  </div>
              </prop>
              <prop v-for="out, o in node.output" :key="o" right>
                <div> {{ out.name }} </div>
              </prop>
            </div>
          </div>

          <div class="context-menu" ref="gridMenu">
            <ul>
              <li v-for="n in nodes" @mousedown.stop="ctxMenuClick($event, n)">{{n.name}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="editor">
        <div class="sheet" @mouseup="pageModify.cur = null"
          :style="{ gridAutoRows: '24px ' + '150px '.repeat(parts.length) }">
          <div class="measures">
            <div class="bef-space">Measures</div>
            <div id="position" :style="{
              height: positionDomHeight + 'px',
              display: 'block',
              left: position * 150 * zoom.x + 'px',
            }"></div>
            <div class="measure-c" :style="{ width: 150 * zoom.x + 'px ' }" :key="i" v-for="i in 50">
              {{ i }}
            </div>
          </div>
          <div class="part" :class="{ selected: pageModify.cur == part }" v-for="(part, i) in parts" :key="i"
            @mouseup.stop="pageModify.cur = part">
            <div class="part-name" :class="{ selected: pageModify.cur == part }">
              {{ part.name }}
            </div>
            <div class="edit" :class="{
              midi: part.type == 'midi',
              audio: part.type == 'audio',
            }">
              <div class="clip" v-for="(clip, i) in part.content" :key="i" :style="{
                width: 150 * zoom.x * clip.duration + 'px ',
                left: clip.location * 150 * zoom.x + 'px',
              }">
                <div class="clip-grap"></div>
                <div class="midi-content" v-if="part.type == 'midi' && 'notes' in clip">
                  <div v-for="(note, j) in clip.notes" :key="j" class="note" :style="{
                    width: note.duration * 150 * zoom.x + 'px',
                    left: note.location * 150 * zoom.x + 'px',
                    top: ((note.pitch - part.noteRange.max) * 107.5) / (part.noteRange.min - part.noteRange.max) + 10 + 'px'
                  }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Node, type Part, type MidiClip, type AudioClip, type Note, type Modify, type Output, type Input} from "../ts/types"; 
import * as drag from "../ts/drag";
import * as nodes from "../ts/audio";

let c = ref(console);
let zoom = ref({ x: 1 });
let position = ref(0); // playhead position in measures
let positionDomHeight = ref(0);  //  calculate how tall the playhead is
let lastTime = 0;
let stopped = true;
let playing = () => {
  if (!stopped) {
    let timeEla = Date.now() - lastTime;  //time elapsed since last update
    position.value +=  
      timeEla / ((240000 / timeSig.bottom / tempo) * timeSig.top);
    //60000 miliseconds in a minute * 4 / bottom
    //

    c.value.log('node.mOffset.x')
    lastTime = Date.now();
    requestAnimationFrame(playing); //this could get a bit laggy? may have to change
  }
};

let playBtn = () => {
  ctx.resume();
  lastTime = Date.now();
  stopped = !stopped;
  playing();
};

let stopBtn = () => {
  position.value = 0;
  stopped = true;
  ctx.close();
};
let warpBtn = () => {
  document.querySelector(".sheet")!.scrollLeft =
    position.value * zoom.value.x * 150;
};

//don't let this project die like your other projects


let tempo = 120; // beats per minute
let timeSig = {
  top: 4,  // how many beats in a measure
  bottom: 4, // the length of a beat, eg 4 is quarter note (1/4) for one beat
};
let inputs = (e: Event) => {  //div contenteditable inputs can't have v-model :)
  let el = <HTMLDivElement>e.target!; // convert EventTarget to the Div element, also it must exist
  let val: any = el.innerText;
  if (el.id == "tempo") {
    val = Number(val);
    if (!isNaN(val)) tempo = val > 999 ? 999 : val < 10 ? 10 : val; // check if it is within bounds and a number
    el.innerText = tempo.toFixed(0).toString(); // rounding
  }
  if (el.title == "time signature top") {
    val = Number(val);
    if (!isNaN(val)) timeSig.top = val > 40 ? 40 : val < 1 ? 1 : val;
    el.innerText = timeSig.top.toFixed(0).toString();
  }
  if (el.title == "time signature bottom") {
    val = Number(val);
    if (!isNaN(val)) timeSig.bottom = Math.log2(val) % 1 == 0 ? val : timeSig.bottom;
    el.innerText = timeSig.bottom.toFixed(0).toString();
  }
};

let gridMenu = ref(null);
let gridCtxMenu = (e:MouseEvent) => {
  let ele = <HTMLDivElement>gridMenu.value!;
  ele.style.display = 'block';
  ele.style.top = `${e.clientY}px`;
  ele.style.left = `${e.clientX}px`;
}

let ctxMenuClick = (e:MouseEvent, n:new (x:number, y:number, ctx: AudioContext) => any) => {
  (<HTMLDivElement>gridMenu.value!).style.display = 'none';
  pageModify.value.cur?.nodes.push(new n(
    e.clientX - document.querySelector('.grid')!.getBoundingClientRect().y - pageModify.value.pan.x, 
    e.clientY - document.querySelector('.grid')!.getBoundingClientRect().y - pageModify.value.pan.y, 
    ctx));

}

let parts = ref(<Part[]>[
  {
    name: "piano",
    type: "midi",
    content: [
      <MidiClip>{
        location: 1,
        duration: 2,
        notes: <Note[]>[
          { pitch: 60, location: 0, duration: 0.2 },
          { pitch: 62, location: 0.2, duration: 0.2 },
          { pitch: 63, location: 0.4, duration: 0.2 },
          { pitch: 65, location: 0.6, duration: 0.2 },
          { pitch: 63, location: 0.8, duration: 0.4 },
          { pitch: 58, location: 1.2, duration: 0.2 },
          { pitch: 60, location: 1.4, duration: 0.4 },
        ],
      },
    ],
    nodes: <Node[]>[],
  },
  {
    name: "piano2",
    type: "midi",
    content: [
      <MidiClip>{
        location: 1,
        duration: 2,
        notes: <Note[]>[
          { pitch: 60, location: 0, duration: 0.2 },
          { pitch: 62, location: 0.2, duration: 0.2 },
          { pitch: 63, location: 0.4, duration: 0.2 },
        ],
      },
    ],
    nodes: <Node[]>[],
  },
]);

let pageModify = ref(<Modify>{ pan: { x: 0, y: 0, moving: false, offset: { x: 0, y: 0 } }, cur: null, master: [] });

parts.value.map((p) => { // generating midi clip ranges for each part
  if (p.type == "midi") {
    let pitches = p.content.flatMap((c) =>
      (<MidiClip>c).notes.map((n) => n.pitch)
    );
    let min = pitches[0],
      max = pitches[0];
    for (let i = 1; i < pitches.length; ++i) {
      if (pitches[i] > max) max = pitches[i];
      if (pitches[i] < min) min = pitches[i];
    }
    p.noteRange = { min, max };
  }
});

let keys = <{ [key: string]: any }>{};
let ctx: AudioContext;

onMounted(() => {
  ctx = new window.AudioContext();
  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key == "-") zoom.value.x -= 0.1;
    if (e.key == "=") zoom.value.x += 0.1;
    if (zoom.value.x >= 10) zoom.value.x = 10;
    if (zoom.value.x <= 0.1) zoom.value.x = 0.1;
    if (e.key == " ") {
      e.preventDefault();
      playBtn();
    }
    if (e.key == "Home") {
      position.value = 0;
    }
  });
  document.addEventListener("keyup", (e) => (keys[e.key] = false));

  positionDomHeight.value = document.querySelector(".sheet")!.clientHeight!;
  lastTime = Date.now();
  playing();
});
</script>
