import { create } from "zustand";

type Store = {
  playlistId: string;
  setPlaylistId: (playlistId: string) => void;
  currentTrackId: string;
  setCurrentTrackId: (currentTrackId: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  sidebar: boolean;
  toggleSidebar: () => void;
};

const useStore = create<Store>(set => ({
  playlistId: "",
  setPlaylistId: playlistId => set({ playlistId }),
  currentTrackId: "",
  setCurrentTrackId: currentTrackId => set({ currentTrackId }),
  isPlaying: false,
  setIsPlaying: isPlaying => set({ isPlaying }),
  sidebar: false,
  toggleSidebar: () => set(state => ({ sidebar: !state.sidebar })),
}));

export default useStore;
