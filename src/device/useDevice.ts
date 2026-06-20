// The simulator "brain". Holds the current menu position, runs demos frame by
// frame, and exposes the four-button API (up / down / select / back), like the
// real device's 4-button navigation.

import { useCallback, useEffect, useRef, useState } from "react";
import { MENU, type Demo, type Frame, type MenuNode, type Mood } from "./content";

export type View =
  | { kind: "menu"; nodes: MenuNode[]; index: number; trail: string[] }
  | { kind: "demo"; node: MenuNode; demo: Demo; frame: Frame; frameIndex: number; total: number };

function findNodes(path: number[]): MenuNode[] {
  let nodes = MENU;
  for (const i of path) {
    const child = nodes[i]?.children;
    if (!child) break;
    nodes = child;
  }
  return nodes;
}

export function useDevice() {
  const [path, setPath] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [demoNode, setDemoNode] = useState<MenuNode | null>(null);
  const [activeDemo, setActiveDemo] = useState<Demo | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const timer = useRef<number | null>(null);

  const nodes = findNodes(path);
  const trail = path.reduce<{ list: MenuNode[]; names: string[] }>(
    (acc, i) => {
      const n = acc.list[i];
      acc.names.push(n.label);
      acc.list = n.children ?? [];
      return acc;
    },
    { list: MENU, names: [] }
  ).names;

  const clearTimer = () => {
    if (timer.current) { window.clearTimeout(timer.current); timer.current = null; }
  };

  useEffect(() => {
    if (!activeDemo) return;
    clearTimer();
    const frames = activeDemo.frames;
    if (frameIndex >= frames.length - 1) return;
    timer.current = window.setTimeout(() => setFrameIndex((f) => f + 1), frames[frameIndex].ms);
    return clearTimer;
  }, [activeDemo, frameIndex]);

  const startDemo = useCallback((node: MenuNode, demo: Demo) => {
    clearTimer();
    setDemoNode(node);
    setActiveDemo(demo);
    setFrameIndex(0);
  }, []);

  const exitDemo = useCallback(() => {
    clearTimer();
    setDemoNode(null);
    setActiveDemo(null);
    setFrameIndex(0);
  }, []);

  const up = useCallback(() => {
    if (activeDemo) return;
    setIndex((i) => (i - 1 + nodes.length) % nodes.length);
  }, [activeDemo, nodes.length]);

  const down = useCallback(() => {
    if (activeDemo) return;
    setIndex((i) => (i + 1) % nodes.length);
  }, [activeDemo, nodes.length]);

  const select = useCallback(() => {
    if (activeDemo) return;
    const node = nodes[index];
    if (!node) return;
    if (node.children?.length) {
      setPath((p) => [...p, index]);
      setIndex(0);
    } else if (node.demo) {
      startDemo(node, node.demo);
    }
  }, [activeDemo, nodes, index, startDemo]);

  const back = useCallback(() => {
    if (activeDemo) { exitDemo(); return; }
    if (path.length === 0) return;
    const last = path[path.length - 1];
    setPath((p) => p.slice(0, -1));
    setIndex(last);
  }, [activeDemo, path, exitDemo]);

  const reset = useCallback(() => {
    clearTimer();
    setDemoNode(null);
    setActiveDemo(null);
    setFrameIndex(0);
    setPath([]);
    setIndex(0);
  }, []);

  let view: View;
  if (activeDemo && demoNode) {
    view = {
      kind: "demo",
      node: demoNode,
      demo: activeDemo,
      frame: activeDemo.frames[frameIndex],
      frameIndex,
      total: activeDemo.frames.length,
    };
  } else {
    view = { kind: "menu", nodes, index, trail };
  }

  const mood: Mood = view.kind === "demo" ? view.frame.mood : "idle";
  const demoDone = view.kind === "demo" && view.frameIndex >= view.total - 1;

  return { view, mood, demoDone, up, down, select, back, reset };
}
