<template>
    <div id="container">
        <div id="top-bar">
            <div id="left">
                <div contenteditable id="tempo" title="tempo" size="1" type="number" @keydown.enter="tempoInput"
                    @focusout="tempoInput"> 120 </div>

            </div>
            <div id="mid">
                <button title="play">⏯</button>
                <button title="stop">🟦</button>
                <button title="record">🔴</button>
            </div>
            <div id="right">
            </div>
        </div>
        <div id="not-top-bar">
            <div id="palette">
                <h3>Palette</h3>
                <div>

                </div>
            </div>
            <div id="editor">
                <div class="sheet" :style="{ gridAutoRows: '24px ' + ('150px ').repeat(parts.length) }">
                    <div class="measures">
                        <div class="bef-space">
                            Measures
                        </div>
                        <div id="position" :style="{height:positionDomHeight + 'px', display:'block'}"></div>
                        <div class="measure-c" :style="{ width: (150 * zoom.x + 'px ') }" :key="i" v-for="i in 1000">
                            {{ i }}
                        </div>
                    </div>
                    <div class="part" v-for="part, i in parts" :key="i" :style="{}">

                        <div class="part-name">
                            {{ part.name }}
                        </div>
                        <div class="edit" :class="{ 'midi': part.type == 'midi', 'audio': part.type == 'audio' }">
                        </div>
                    </div>
                </div>
            </div>
            <div id="modify">
                <h3>Modify</h3>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

interface Part {
    type: string;
    name: string;
    content: object;
}

let zoom = ref({ x: 1 });
let position = ref(0); //in measures
let tempo = 120;
let tempoInput = (e: Event) => {
    e.preventDefault();
    let val = Number((<HTMLDivElement>e.target!).innerText);
    if (!isNaN(val)) tempo = (val > 999) ? 999 : (val < 10) ? 10 : val;
    (<HTMLDivElement>e.target!).innerText = tempo.toFixed(0).toString();
}

let positionDomHeight = ref(0);


let parts = ref(<Part[]>[{ name: "piano", type: "midi", content: {} }]);
let keys = ref(<{ [key: string]: any }>{});
onMounted(() => {
    document.addEventListener("keydown", e => {
        keys.value[e.key] = true;
        if (e.key == "=") zoom.value.x -= 0.1;
        if (e.key == "-") zoom.value.x += 0.1;
        if (zoom.value.x >= 3) zoom.value.x = 3;
        if (zoom.value.x <= 0.1) zoom.value.x = 0.1;
    });
    document.addEventListener("keyup", e => keys.value[e.key] = false);
    positionDomHeight.value = document.querySelector('.sheet')?.clientHeight!;
})
</script>