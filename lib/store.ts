import { create } from "zustand";

interface WebGLState {
  intensity: number;
  setIntensity: (intensity: number) => void;
  hoverTarget: number;
  setHoverTarget: (hoverTarget: number) => void;
  activeOverlay: "none" | "palette" | "terminal";
  setActiveOverlay: (overlay: "none" | "palette" | "terminal") => void;
}

export const useWebGLStore = create<WebGLState>((set) => ({
  intensity: 0,
  setIntensity: (intensity) => set({ intensity }),
  hoverTarget: 0,
  setHoverTarget: (hoverTarget) => set({ hoverTarget }),
  activeOverlay: "none",
  setActiveOverlay: (activeOverlay) => set({ activeOverlay }),
}));
