<template>
  <div id="container">
    <div id="top-bar">
      <div id="left">
        <div
          contenteditable
          id="tempo"
          title="tempo"
          size="1"
          type="number"
          @keydown.enter="tempoInput"
          @focusout="tempoInput"
        >
          120
        </div>
        <div>{{ timeSig.top }} / {{ timeSig.bottom }}</div>
      </div>
      <div id="mid">
        <button title="play" @click="playBtn">⏯</button>
        <button title="stop" @click="stopBtn">🟦</button>
        <button title="warp to play line" @click="warpBtn">⚓</button>
        <button title="record">🔴</button>
      </div>
      <div id="right"></div>
    </div>
    <div id="not-top-bar">
      <div id="modify">
        <div
          class="grid"
          :style="{
            backgroundPosition: `top ${pageModify.pan.y}px left ${pageModify.pan.x}px`,
          }"
        >
          <div
            class="node-wrap"
            v-if="pageModify.cur"
            :style="{
              transform: `translate(${pageModify.pan.x}px, ${pageModify.pan.x})`,
            }"
          >
            <div
              class="node"
              v-for="(node, i) in pageModify.cur.nodes"
              :key="i"
            ></div>
          </div>
        </div>
      </div>
      <div id="editor">
        <div
          class="sheet"
          @click="pageModify.cur = null"
          :style="{ gridAutoRows: '24px ' + '150px '.repeat(parts.length) }"
        >
          <div class="measures">
            <div class="bef-space">Measures</div>
            <div
              id="position"
              :style="{
                height: positionDomHeight + 'px',
                display: 'block',
                left: position * 150 * zoom.x + 'px',
              }"
            ></div>
            <div
              class="measure-c"
              :style="{ width: 150 * zoom.x + 'px ' }"
              :key="i"
              v-for="i in 50"
            >
              {{ i }}
            </div>
          </div>
          <div
            class="part"
            :class="{ selected: pageModify.cur == part }"
            v-for="(part, i) in parts"
            :key="i"
            :style="{}"
            @click.stop="pageModify.cur = part"
          >
            <div
              class="part-name"
              :class="{ selected: pageModify.cur == part }"
            >
              {{ part.name }}
            </div>
            <div
              class="edit"
              :class="{
                midi: part.type == 'midi',
                audio: part.type == 'audio',
              }"
            >
              <div
                class="clip"
                v-for="(clip, i) in part.content"
                :key="i"
                :style="{
                  width: 150 * zoom.x * clip.duration + 'px ',
                  left: clip.location * 150 * zoom.x + 'px',
                }"
              >
                <div class="clip-grap"></div>
                <div
                  class="midi-content"
                  v-if="part.type == 'midi' && 'notes' in clip"
                >
                  <div
                    v-for="(note, j) in clip.notes"
                    :key="j"
                    class="note"
                    :style="{
                      width: note.duration * 150 * zoom.x + 'px',
                      left: note.location * 150 * zoom.x + 'px',
                    }"
                  ></div>
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
interface Node {
  x: number;
  y: number;
  auNode?: AudioNode;
  output?: Node;
  input?: Node;
}

interface Part {
  type: string;
  name: string;
  content: MidiClip[] | AudioClip[];
  nodes: Node[];
  noteRange?: { min: number; max: number };
}

interface MidiClip {
  location: number;
  duration: number;
  notes: Array<Note>;
}
interface AudioClip {
  location: number;
  duration: number;
  src: string;
}

interface Note {
  location: number;
  duration: number;
  pitch: number; // 0 - 127
}

interface Modify {
  pan: { x: number; y: number };
  cur: Part | null;
  master: Node[];
}

let zoom = ref({ x: 1 });
let position = ref(0); //in measures
let positionDomHeight = ref(0);
let lastTime = 0;
let stopped = true;
let playing = () => {
  if (!stopped) {
    let timeEla = Date.now() - lastTime;
    position.value +=
      timeEla / ((240000 / timeSig.bottom / tempo) * timeSig.top);
    //60000 miliseconds in a minute * 4
    lastTime = Date.now();
    requestAnimationFrame(playing);
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

let tempo = 120;
let timeSig = {
  top: 4,
  bottom: 4,
};
let tempoInput = (e: Event) => {
  e.preventDefault();
  let val = Number((<HTMLDivElement>e.target!).innerText);
  if (!isNaN(val)) tempo = val > 999 ? 999 : val < 10 ? 10 : val;
  (<HTMLDivElement>e.target!).innerText = tempo.toFixed(0).toString();
};

let parts = ref(<Part[]>[
  {
    name: "piano",
    type: "midi",
    content: [
      <MidiClip>{
        location: 1,
        duration: 2,
        notes: [
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
    nodes: [],
  },
  {
    name: "piano2",
    type: "midi",
    content: [
      <MidiClip>{
        location: 1,
        duration: 2,
        notes: [
          { pitch: 60, location: 0, duration: 0.2 },
          { pitch: 62, location: 0.2, duration: 0.2 },
          { pitch: 63, location: 0.4, duration: 0.2 },
        ],
      },
    ],
    nodes: [],
  },
]);

let pageModify = ref(<Modify>{ pan: { x: 0, y: 0 }, cur: null });

parts.value.forEach((p) => {
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
