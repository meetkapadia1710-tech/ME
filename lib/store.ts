import { create } from "zustand";

interface WebGLState {
  intensity: number;
  setIntensity: (intensity: number) => void;
  hoverTarget: number;
  setHoverTarget: (hoverTarget: number) => void;
}

export const useWebGLStore = create<WebGLState>((set) => ({
  intensity: 0,
  setIntensity: (intensity) => set({ intensity }),
  hoverTarget: 0,
  setHoverTarget: (hoverTarget) => set({ hoverTarget }),
}));
