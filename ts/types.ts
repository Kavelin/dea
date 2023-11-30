

export interface Node {
    x: number;
    y: number;
    name: string;
    auNode?: AudioNode;
    output?: Node;
    input?: Node;
    moving: boolean;
    mOffset: {x: number, y:number};
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
  
  export interface AudioClip { //still not implemented...
    location: number; //in measures
    duration: number; //in measures?
    src: string;
  }
  
  export interface Note {
    location: number; // in measures relative to beginning of clip
    duration: number;  //in measures
    pitch: number; // 0 - 127
  }
  
  export interface Modify {
    pan: {
      x: number; y: number,
      moving: boolean,
      offset: { x: number, y: number }
    };  //moves the background and nodes
    cur: Part | null; // if cur is null (no part is selected), 
    master: Node[]; //   master is shown to send all parts to output
  }
