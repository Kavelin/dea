<template>
    <div class="editor" :style="{ width: `${50}%` }">
        <div class="sheet" @mouseup="pageModify.cur = null"
            :style="{ gridAutoRows: '24px ' + '150px '.repeat(parts.length + 1) }">
            <div class="measures">
                <div class="bef-space">Measures</div>
                <div id="position" :style="{
                    height: position.domHeight + 'px',
                    display: 'block',
                    left: position.val * 150 * zoom.x + 'px',
                }"></div>
                <div class="measure-c" :key="i" v-for="i in 50"
                    @mousedown.stop="($event) => position.val = ($event.offsetX - 150 * zoom.x) / (150 * zoom.x) + i"
                    @mouseup.stop :style="{ width: 150 * zoom.x + 'px ' }">{{ i }}</div>
            </div>
            <div class="part" :class="{ selected: pageModify.cur == part }" v-for="(part, i) in parts" :key="i"
                @mouseup.stop="pageModify.cur = part">
                <div class="part-name" :class="{ selected: pageModify.cur == part }">
                    {{ ((part.type == 'midi') ? '🎹' : '🔊') }} <br>
                    <div size="1" contenteditable @keypress.stop @keydown.enter.prevent.stop="partInput($event, part)" @focusout="partInput($event, part)">{{ part.name }}</div>
                </div>
                <div class="edit" :class="{
                    midi: part.type == 'midi',
                    audio: part.type == 'audio',
                }">
                    <div class="clip" v-for="(clip, i) in part.content" :key="i" :style="{
                        width: clip.duration * 150 * zoom.x + 'px ',
                        left: clip.location * 150 * zoom.x + 'px',
                    }">
                        <div class="clip-grap"></div>
                        <div class="midi-content" v-if="part.type == 'midi' && 'notes' in clip">
                            <div v-for="(note, j) in clip.notes" :key="j" class="note" :style="{
                                width: note.duration * 150 * zoom.x + 'px',
                                left: note.location * 150 * zoom.x + 'px',
                                top: ((note.pitch - part.noteRange.max) * 107.5) / (part.noteRange.min - part.noteRange.max) + 10 + 'px',
                            }"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="part">
                <div class="add-btn" @click="parts.push({
                    name: 'track' + parts.length,
                    type: 'midi',
                    content: [],
                    nodes: [],
                })">+🎹</div>
                <div class="add-btn" @click="parts.push({
                    name: 'track' + parts.length,
                    type: 'audio',
                    content: [],
                    nodes: [],
                })">+🔊</div>
            </div>
        </div>
    </div>
</template>
<style scoped>


#editor {
    width: 50%;
    background: black;
    padding: 2px;
    overflow: hidden;
}

.sheet {
    background: black;
    height: 100%;
    width: 100%;
    display: grid;
    overflow: auto;
}

.measures {
    padding: 4px;
    display: flex;
}

#position {
    width: 2px;
    background: fixed linear-gradient(90deg, orange, violet);
    position: relative;
    z-index: 400;
}

.bef-space {
    margin: 0 32px 0 0;
    width: 36px;
    height: 100%;
}

.measure-c {
    width: 150px;
    margin: 0;
    padding: 0 2px;
    user-select:none;
    box-sizing: border-box;
    height: 16px;
    border: white 1px solid;
}

.part-name {
    margin: 0 32px 0 0;
    height: 100%;
    min-width: 36px;
    max-width: 36px;
    display: flex;
    align-items: center;
}

.part.selected {
    background: #ffa50073;
}

.part {
    padding: 0 4px;
    border: white solid 1px;
    box-sizing: border-box;
    display: flex;
    transition: 100ms;
}

.edit {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    background: black;
    border-left: 1px solid white;
}

.clip {
    background: orange;
    height: 150px;
    position: relative;
}

.clip-grap {
    height: 15%;
    width: 100%;
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    box-sizing: border-box;
    cursor: grab;
}

.midi-content {
    height: 85%;
    width: 100%;
    position: relative;
}

.note {
    position: absolute;
    height: 4px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
}

div[contenteditable] {
    width: min-content;
    outline: none;
    padding: 4px;
}

div[contenteditable]:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    box-shadow: #000000ee 0px 0px 5px 0px;
}
</style>
<script setup lang="ts">
import { type Part } from "~/ts/types";
const props = defineProps(['zoom', 'pageModify', 'position', 'parts']);
let partInput = (e: Event, p: Part) => {
    let el = <HTMLDivElement>e.target!; 
    let val: any = el.innerText;
    if (val.length < 50 && val.length >= 1) p.name = val;
    el.innerText = p.name;
    el.blur();
}
</script>