<template>
  <div id="container">
    <div id="top-bar">
      <div id="left">
        <div contenteditable id="tempo" title="tempo" size="1" type="number" @keydown.enter.prevent="inputs"
          @focusout="inputs">120</div>
        <div>
          <div title="time signature top" size="1" contenteditable @keydown.enter.prevent="inputs" @focusout="inputs">{{
            timeSig.top }}</div>/<div title="time signature bottom" @keydown.enter.prevent="inputs" @focusout="inputs"
            contenteditable>{{ timeSig.bottom }}</div>
        </div>
      </div>
      <div id="mid">
        <button title="go back" @click="position.val = 0">⏪</button>
        <button title="play" @click="playBtn">⏯</button>
        <button title="stop" @click="stopBtn">🟦</button>
        <button title="go to playhead" @click="warpBtn">⚓</button>
        <button title="record">🔴</button>
      </div>
      <div id="right"></div>
    </div>
    <div id="not-top-bar">
      <modify :pageModify="pageModify" />
      <editor :pageModify="pageModify" :parts="parts" :zoom="zoom" :position="position" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Node, type Part, type MidiClip, type AudioClip, type Note, type Modify, type Output, type Input } from "../ts/types";
import * as nodes from "../ts/audio";
import { sclTuning } from "../ts/scl";

let zoom = ref({ x: 1 });
let position = ref({
  val: 0, // playhead position in measures
  domHeight: 0
}); //  calculate how tall the playhead is
let lastTime = 0;
let stopped = true;
let playing = () => {
  if (!stopped) {
    let timeEla = Date.now() - lastTime; //time elapsed since last update
    position.value.val += timeEla / ((240000 / timeSig.bottom / tempo) * timeSig.top);
    //(60000 ms per minute * 4 beats per whole note / bottom / beats per minute) gives the ms ber beat
    // ms / beat * beats / measure gives ms per measure
    // ms passed / ms / measure gives measures passed
    //console.log(ctx.currentTime);
    lastTime = Date.now();
    requestAnimationFrame(playing); //this could get a bit laggy? may have to change
  }
};
let oscillatorNodes: OscillatorNode[] = [];
let playBtn = () => {
  if (ctx.state != "running") initSound();
  else stopSound();
  lastTime = Date.now();
  stopped = !stopped;
  playing();
};

let initSound = () => {
  ctx.suspend();
  ctx = new window.AudioContext();
  ctx.resume();
  oscillatorNodes = [];
  parts.value.map((p) => {
    let curNode;
    for (let nodeI = 0; nodeI < p.nodes.length; nodeI++) if (p.nodes[nodeI] instanceof nodes.Destination) {
      curNode = p.nodes[nodeI];
      calcIns(curNode.input[0], p, { dest: ctx.destination });
      /*p.nodes.map((n) => {
        if (n instanceof nodes.Oscillator) {
          n.create(ctx);
          n.auNode!.start();
          n.auNode!.type = <OscillatorType>n.attribute[0].selected;
          p.content.map((c) => {
          let clipLoc = (240 / timeSig.bottom / tempo) * timeSig.top * c.location;
          if ("notes" in c) c.notes.map((note) => n.auNode!.frequency.setValueAtTime(
            440 * 2 ** ((note.pitch - 69) / 12), 
            clipLoc + note.location * (240 / timeSig.bottom / tempo) * timeSig.top
          ));
          });
          if (n.output[0].outs?.some((i) => i.node instanceof nodes.Destination)) n.auNode!.connect(ctx.destination);
        }
      }); */

      break; // there cannot be any other destination!
    }
  });
  oscillatorNodes.forEach((x) => x.start());
};
function calcIns(input: Input, part: Part, pass: any) { //recursive function
  //have to start consider to not use the built in nodes
  let inNode = input.node;
  if (inNode instanceof nodes.Oscillator) {
    let oscillator = ctx.createOscillator();
    oscillator.type = <OscillatorType>inNode.attribute[0].selected;
    calcIns(inNode.input[0], part, oscillator.frequency);
    oscillator.start();
    if (pass) oscillator.connect(pass.dest);
  }
  if (inNode instanceof nodes.Gain) {
    let gain = ctx.createGain();
    gain.gain.setValueAtTime(1, ctx.currentTime);
    calcIns(inNode.input[0], part, gain.gain);
    calcIns(inNode.input[1], part, { dest: gain });
    if (pass) gain.connect(pass.dest);
  }
  if (inNode instanceof nodes.Value) {
    pass.setValueAtTime(100, ctx.currentTime)
  }
  if (inNode instanceof nodes.Midi) {
    if (input.index == 0) { // pitch
      pass.setValueAtTime(100, ctx.currentTime)
      part.content.map((c) => {
        let clipLoc = (240 / timeSig.bottom / tempo) * timeSig.top * c.location;
        if ("notes" in c) c.notes.map((note) => pass.setValueAtTime(
          440 * 2 ** ((note.pitch - 69) / 12), // do midi-frequency node conversion later (but thats annoying??)
          clipLoc + note.location * (240 / timeSig.bottom / tempo) * timeSig.top
        ));
      });
    }
    if (input.index == 1) { // velocity
      pass.setValueAtTime(0, ctx.currentTime);
      part.content.map((c) => {
        let clipLoc = (240 / timeSig.bottom / tempo) * timeSig.top * c.location;
        if ("notes" in c) c.notes.map((note) => {
          pass.setValueAtTime(
            (note.velocity) / 127, // do midi-frequency node conversion later (but thats annoying??)
            clipLoc + note.location * (240 / timeSig.bottom / tempo) * timeSig.top
          )
          pass.setValueAtTime(
            0, // do midi-frequency node conversion later (but thats annoying??)
            clipLoc + note.location * (240 / timeSig.bottom / tempo) * timeSig.top + note.duration * (240 / timeSig.bottom / tempo) * timeSig.top
          )
        }
        );
      });
    }
  }
}

let stopSound = () => {
  ctx.suspend();
  ctx = new window.AudioContext();
  ctx.suspend();
  parts.value.map((x) => {
    x.nodes.map((x) => {
      if (x instanceof nodes.Oscillator) {
        x.auNode?.stop();
      }
    });
  });
};

let stopBtn = () => {
  position.value.val = 0;
  stopped = true;
  ctx.suspend();
  ctx = new window.AudioContext();
  ctx.suspend();
};

let warpBtn = () => {
  document.querySelector(".sheet")!.scrollLeft = position.value.val * zoom.value.x * 150;
};

//don't let this project die like your other projects

let tempo = 120; // beats per minute
let timeSig = {
  top: 4, // how many beats in a measure
  bottom: 4, // the length of a beat, eg 4 is quarter note (1/4) for one beat
};
let inputs = (e: Event) => {
  //div contenteditable inputs can't have a v-model!
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

// mock data

let parts = ref(<Part[]>[
  {
    name: "synth",
    type: "midi",
    content: [
      <MidiClip>{
        location: 1,
        duration: 2,
        notes: <Note[]>[
          { pitch: 60, location: 0, duration: 0.2, velocity: 60 },
          { pitch: 62, location: 0.2, duration: 0.2, velocity: 40 },
          { pitch: 63, location: 0.4, duration: 0.2, velocity: 69 },
          { pitch: 65, location: 0.6, duration: 0.2, velocity: 69 },
          { pitch: 62, location: 0.8, duration: 0.05, velocity: 30 },
          { pitch: 58, location: 1.2, duration: 0.2, velocity: 69 },
          { pitch: 60, location: 1.4, duration: 0.4, velocity: 69 },
        ],
      },
    ],
    nodes: <Node[]>[new nodes.Midi(0, 0), new nodes.Oscillator(30, 60)],
  },
  {
    name: "bass synth",
    type: "midi",
    content: [
      <MidiClip>{
        location: 1,
        duration: 2,
        notes: <Note[]>[
          { pitch: 48, location: 0, duration: 0.2, velocity: 42 },
          { pitch: 46, location: 0.2, duration: 0.2, velocity: 42 },
          { pitch: 45, location: 0.4, duration: 0.2, velocity: 42 },
          { pitch: 43, location: 0.6, duration: 0.2, velocity: 42 },
          { pitch: 41, location: 0.8, duration: 0.4, velocity: 42 },
          { pitch: 38, location: 1.2, duration: 0.2, velocity: 42 },
          { pitch: 36, location: 1.4, duration: 0.4, velocity: 42 },
        ],
      },
    ],
    nodes: <Node[]>[],
  },
]);

let pageModify = ref(<Modify>{
  pan: { x: 0, y: 0, moving: false, offset: { x: 0, y: 0 } },
  cur: null,
  tempLine: { el: null, mouse: { x: 0, y: 0 }, out: null, index: 0 },
  master: [],
});

let rangeMidiPart = (p: Part) => {
  // generating midi clip ranges for each part
  if (p.type == "midi") {
    let pitches = p.content.flatMap((c) => (<MidiClip>c).notes.map((n) => n.pitch));
    let min = pitches[0],
      max = pitches[0];
    for (let i = 1; i < pitches.length; ++i) {
      if (pitches[i] > max) max = pitches[i];
      if (pitches[i] < min) min = pitches[i];
    }
    p.noteRange = { min, max };
  }
};
parts.value.map(rangeMidiPart); // for mock data

let keys = <{ [key: string]: any }>{};
let ctx: AudioContext;

onMounted(() => {
  ctx = new window.AudioContext();
  ctx.suspend();
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
      position.value.val = 0;
    }
  });
  document.addEventListener("keyup", (e) => (keys[e.key] = false));

  position.value.domHeight = document.querySelector(".sheet")!.clientHeight!;
  lastTime = Date.now();
  playing();
});
</script>
