~~drug enforcement administration~~
(what plans to be) an intuitive daw based on the Ableton DAW and Blender's nodes

gonna try to use webassembly if that doesn't work i'll go back to nuxt
reason for using webassembly: can write my own audio engine because web audio isn't good for low level low latency dsp audio processing
i can use rust for webassembly for this



to-do list
- implement nodes with sound
    - create nodes that correlate with their webaudio counterparts
    - asdr trigger node, value node
    - make sound exponential ramp to value cause of clicking (or just use asdr all the time :p)
    - later: poly nodes that combine many of these into easier usable nodes
    - every part will have a channel node instead of a destination node
        - what if a channel node is just a gain node that connects to the destination...!!!!
- audio tracks
    - load audio clips
    - canvas draw waveform (or maybe svg)
- have the background image opacity pulse based on master audio
- piano roll
    - base off of fl studio? heard that was a really good piano roll
    - make it possible to speedrun magnolia
- write comments so my code is readable
- split index.vue into smaller files

future plans so i don't forget!
- figure out a way to do automation
- implement a good file type fast, using xml? https://stackoverflow.com/a/48789575
- maybe, video/mp4 support with recording video? would be pretty useful...
- 
- vst support with vstjs?? have some free vsts pre installed 
    - vital (may be too laggy), or helm (eh...) 
    - BassAmp (definitely) https://www.airwindows.com/bassamp/ 
    - w1 limiter http://www.yohng.com/software/w1limit.html
    - other free plugins i can't think of,,
- group nodes and save groups of nodes
    - would be useful to import into other projects
- backend
    - use mongodb for storing files
    - implement collaboration with socket.io
- use tauri to make an os app?
    - https://www.youtube.com/watch?v=MOnf_kGI6L0 
    - idk if this is even like gonna be useful
    - maybe if i add collaboration features, but this requires backend which isn't supported in tauri 
    - using electron is way too bulky for this project! or maybe not?
    

so many more plans than to-do lol
