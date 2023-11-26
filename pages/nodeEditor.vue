<template>
  <button @click="startAudio">Start Audio</button>
  <!--<grid></grid>-->
  <div style="width: 90vw; height: 90vh">
    <baklava-editor :view-model="baklava" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { EditorComponent, useBaklava } from "@baklavajs/renderer-vue";
import { DependencyEngine, applyResult } from "@baklavajs/engine";
import "@baklavajs/themes/dist/syrup-dark.css";

import { DisplayNode } from "./DisplayNode";
import { MathNode } from "./MathNode";

export default defineComponent({
  components: {
    "baklava-editor": EditorComponent,
  },
  setup() {
    const baklava = useBaklava();
    const engine = new DependencyEngine(baklava.editor);

    baklava.editor.registerNodeType(MathNode);
    baklava.editor.registerNodeType(DisplayNode);

    const token = Symbol();
    engine.events.afterRun.subscribe(token, (result) => {
      engine.pause();
      applyResult(result, baklava.editor);
      engine.resume();
    });

    engine.start();

    // Add some nodes for demo purposes
    let gainno: GainNode, oscillator, ctx: AudioContext;

    onMounted(() => {
      ctx = new window.AudioContext();
    });
    function startAudio(e: Event) {
      oscillator = ctx.createOscillator();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(890, ctx.currentTime);
      gainno = ctx.createGain();
      gainno.gain.value = 0.1;
      oscillator.connect(gainno);
      gainno.connect(ctx.destination);
      oscillator.start();
    }
    return { baklava, startAudio };
  },
});
</script>
