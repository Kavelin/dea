import { Node, type Output, type Input } from "./types";
export class Oscillator extends Node {
  public name = "Oscillator";
  public output: Output[] = [{ name: "Output", node: null }];
  public input: Input[] = [
    { name: "Type", options:["Sine", "Sawtooth", "Square"], node: null },
    { name: "Frequency", val:440, min:20, max:200000, node: null },
  ];
  public auNode:OscillatorNode | undefined;
  public constructor(x: number, y: number) {
    super(x, y);
  }
  public audioCreate(ctx: AudioContext) {
    let oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    this.auNode = oscillator;
    return this.auNode;
  }
}
export class Midi extends Node {
  public name = "Midi";
  public output: Output[] = [{ name: "Midi", node: null }];
  public input: Input[] = [];
  public constructor(x: number, y: number) {
    super(x, y);
  }
}

export class Gain extends Node {
  public name = "Gain";
  public output: Output[] = [{ name: "Output", node: null }];
  public input: Input[] = [{ name: "Value", min:0, max: 1, val: 0.5, node: null }, { name: "Input", node: null }];
  public auNode:GainNode | undefined;
  public constructor(x: number, y: number) {
    super(x, y);
  }
  public audioCreate(ctx: AudioContext) {
    let gain = ctx.createGain();
    this.auNode = gain;
    return gain;
  }
}
