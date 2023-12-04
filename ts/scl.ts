// Influenced by Scala.lua
// http://forum.renoise.com/index.php/topic/28495-snippet-load-scala-scl-tuning-file/
// Scala Format: http://www.huygens-fokker.org/scala/scl_format.html

// I DID NOT WRITE THIS https://github.com/jcpst/scl-to-frequency
// ALL CREDIT GOES TO jcpst ON GITHUB
// tysm for writing this

import * as fs from 'fs';
import * as path from 'path';

let description = '';   

let readFile = (filepath: string) => {
    try {
        return fs.readFileSync(path.join(__dirname, '../scl/12tet.scl'), { "encoding": "utf-8" });
    } catch (e) { 
        return ''; 
    }
    /*return `! 12 equal divisions of 2_1.scl
    ! Created using Scale Workshop 2.1.0
    !
    ! https://sevish.com/scaleworkshop/?n=12%20equal%20divisions%20of%202%2F1&l=1Bc_2Bc_3Bc_4Bc_5Bc_6Bc_7Bc_8Bc_9Bc_aBc_bBc_cBc&c=~-~-~~-~-~-~&k=p&p=1&w=h&a=1s&y=c4&s=69&r=6g&version=2.1.0
    !
    12 equal divisions of 2/1
     12
    !
     100.000000
     200.000000
     300.000000
     400.000000
     500.000000
     600.000000
     700.000000
     800.000000
     900.000000
     1000.000000
     1100.000000
     2/1
    `;*/
}

let sclTuning = (fileName:string, baseNote?:number, baseFrequency?:number) => {
    baseNote = baseNote || 48;
    baseFrequency = baseFrequency || 261.625565300598623;
    let tunings = [];
    let counter = 0;
    let file = readFile(fileName);
    let lines = file.split('\n');
    if (file) {
        for (let i = 0, ln = lines.length; i < ln; i++) {
            if (lines[i].substring(0,1) !== '!' && lines[i].replace(/\s/g, '')) {
                counter++;
                if (counter === 1) description = lines[i];
                if (counter > 2) {
                    if (lines[i].match(/^.*\./)) {
                        let cents = Number(lines[i].replace(/\s/g, ''));
                        tunings.push(Math.pow(2, cents / 1200));
                    } else if (lines[i].match(/[0-9]\/[0-9]/)) {
                        let ratio = lines[i].split('/');
                        tunings.push(Number(ratio[0]) / Number(ratio[1]));
                    } else {
                        tunings.push(Number(lines[i]));
                    }
                }
            }
        }
    }
    return tuningToFrequencies(tunings, baseNote, baseFrequency);
}

let tuningToFrequencies = (tunings:number[], baseNote:number, baseFrequency:number) => {
    let notesPerOctave = Object.keys(tunings).length;
    let frequencies = [];
    for (let i = 0; i < 128; i++) {
        let note = i - baseNote;
        let degree = Math.abs(note % notesPerOctave);
        let octave = Math.floor(note / notesPerOctave);
        let frequency = baseFrequency * Math.pow(tunings[notesPerOctave - 1], 
                (octave * notesPerOctave) / notesPerOctave);
        if (degree > 0) frequency *= tunings[degree - 1];
        frequency = Math.max(0.0, Math.min(22050.0, frequency));
        frequencies.push(frequency);
    }
    return frequencies.sort((a, b) => a - b);
}

export {sclTuning};