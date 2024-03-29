import type { Node, Modify } from "./types";
export let grid = (e: MouseEvent, t: string, mod: Modify, gridMenu?: HTMLDivElement | null) => {
  if (t == "down" && !mod.pan.moving) {
    mod.pan.moving = true;
    mod.pan.offset.x =
      e.clientX - (<HTMLDivElement>e.target).clientLeft - mod.pan.x;
    mod.pan.offset.y =
      e.clientY - (<HTMLDivElement>e.target).clientTop - mod.pan.y;
    if (gridMenu) gridMenu.style.display = 'none';
  }
  if (t == "move" && mod.pan.moving) {
    mod.pan.x = e.clientX - mod.pan.offset.x;
    mod.pan.y = e.clientY - mod.pan.offset.y;
  }
  if (mod.tempLine.out) {
    mod.tempLine.mouse.x = e.clientX - mod.tempLine.el!.getBoundingClientRect().x + (<HTMLDivElement>e.target).clientLeft;
    mod.tempLine.mouse.y = e.clientY - mod.tempLine.el!.getBoundingClientRect().y + (<HTMLDivElement>e.target).clientTop;
  }
};

export let node = (e: MouseEvent, t: string, node: Node) => {
  if (t == "down" && !node.moving) {
    node.moving = true;
    node.mOffset.x =
      e.clientX -
      (<HTMLDivElement>e.target).parentElement!.parentElement!.clientLeft -
      node.x;
    node.mOffset.y =
      e.clientY -
      (<HTMLDivElement>e.target).parentElement!.parentElement!.clientTop -
      node.y;
  }
  if (node.moving) {
    if (t == "move" && node.moving) {
      node.x = e.clientX - node.mOffset.x;
      node.y = e.clientY - node.mOffset.y;
    } else if (t == "up" && node.moving) {
      node.moving = false;
      node.mOffset = { x: 0, y: 0 };
    }
  }
};
