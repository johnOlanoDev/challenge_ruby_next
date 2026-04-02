import { create } from "zustand";

export const useStore = create((set) => ({
  tasks: [],
  setTasks: (tasks: any) => set({ tasks }),
}));
