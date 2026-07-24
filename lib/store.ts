import { create } from "zustand";

export type WebGLSceneType = "none" | "hero" | "approach-cta";

interface WebGLState {
  activeScene: WebGLSceneType;
  setActiveScene: (scene: WebGLSceneType) => void;
}

export const useWebGLStore = create<WebGLState>((set) => ({
  activeScene: "none",
  setActiveScene: (scene) => set({ activeScene: scene }),
}));
