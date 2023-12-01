import { Node, type Output, type Input } from "./types";
export class Oscillator extends Node {
  public name = "Oscillator";
  public auNode: OscillatorNode;
  public output: Output[] = [{ name: "Output", node: null }];
  public input: Input[] = [
    { name: "Type", options:["Sine", "Sawtooth", "Square"], node: null },
    { name: "Frequency", val:440, min:20, max:200000, node: null },
  ];
  constructor(x: number, y: number, ctx: AudioContext) {
    super(x, y);
    this.auNode = new OscillatorNode(ctx);
  }
}

export class Gain extends Node {
  public name = "Gain";
  public auNode: OscillatorNode;
  public output: Output[] = [{ name: "Output", node: null }];
  public input: Input[] = [{ name: "Input", node: null }];
  constructor(x: number, y: number, ctx: AudioContext) {
    super(x, y);
    this.auNode = new OscillatorNode(ctx);
  }
}
