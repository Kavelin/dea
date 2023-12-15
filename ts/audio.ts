import { Node, type Output, type Input } from "./types";
export class Oscillator extends Node {
  public name = "Oscillator";
  public output: Output[] = [{ name: "Output", outs:[] }];
  public attribute = [
    { name: "Type", options:["sine", "sawtooth", "square", "triangle"], selected:"sine"}
  ];
  public input: Input[] = [
    { name: "Frequency", val:440, min:20, max:200000, node: null, index:0 },
  ];
  public auNode:OscillatorNode | undefined;
  public constructor(x: number, y: number) {
    super(x, y);
  }
  public create(ctx: AudioContext) {
    let oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    this.auNode = oscillator;
    return this.auNode;
  }
}
export class Midi extends Node {
  public name = "Midi";
  public output: Output[] = [{ name: "Pitch", outs:[] }, { name: "Velocity", outs:[] }];
  public input: Input[] = [];
  public constructor(x: number, y: number) {
    super(x, y);
  }
}
export class ADSR extends Node {
  public name = "ADSR";
  public output: Output[] = [{ name: "Pitch", outs:[] }, { name: "Velocity", outs:[] }];
  public input: Input[] = [];
  public constructor(x: number, y: number) {
    super(x, y);
  }
}


export class Value extends Node {
  public name = "Value";
  public attribute = [
    { name: "Value", min:0, max:100, val:50}
  ];
  public output: Output[] = [{ name: "Output", outs:[] }];
  public input: Input[] = [];
  public constructor(x: number, y: number) {
    super(x, y);
  }
}

export class Destination extends Node {
  public name = "Destination";
  public output: Output[] = [];
  public input: Input[] = [{ name: "Input", node: null, index:0 }];
  public constructor(x: number, y: number) {
    super(x, y);
  }
}
export class Gain extends Node {
  public name = "Gain";
  public output: Output[] = [{ name: "Output", outs:[] }];
  public input: Input[] = [{ name: "Value", min:0, max: 1, val: 0.5, node: null, index:0 }, { name: "Input", node: null, index:0 }];
  public auNode:GainNode | undefined;
  public constructor(x: number, y: number) {
    super(x, y);
  }
  public create(ctx: AudioContext) {
    let gain = ctx.createGain();
    this.auNode = gain;
    return gain;
  }
}
