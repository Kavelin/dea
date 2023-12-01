type NumberInput = {
  node: Node | null;
  name: string;
  val: number;
  min: number;
  max: number;
}
type OptionInput = {
  node: Node | null;
  name: string;
  options: Array<any>;
}
type AudioInput = {
  node: Node | null;
  name: string;
}

export type Input = NumberInput | AudioInput | OptionInput;

export interface Output {
  node: Node | null;
  name: string;
}

export abstract class Node {
  public x: number = 0;
  public y: number = 0;
  public moving: boolean = false;
  public mOffset: { x: number; y: number } = {x: 0, y:0};
  public name: string = '';
  public auNode?: any;
  public output: Output[] = [];
  public input: Input[] = [];
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

export interface Part {
  type: string;
  name: string;
  content: MidiClip[] | AudioClip[];
  nodes: Node[];
  noteRange: { min: number; max: number };
}

export interface MidiClip {
  location: number; //in measures
  duration: number; //in measures
  notes: Array<Note>; //would a map be better
}

export interface AudioClip {
  //still not implemented...
  location: number; //in measures
  duration: number; //in measures?
  src: string;
}

export interface Note {
  location: number; // in measures relative to beginning of clip
  duration: number; //in measures
  pitch: number; // 0 - 127
}

export interface Modify {
  pan: {
    x: number;
    y: number;
    moving: boolean;
    offset: { x: number; y: number };
  }; //moves the background and nodes
  cur: Part | null; // if cur is null (no part is selected),
  master: Node[]; //   master is shown to send all parts to output
}
