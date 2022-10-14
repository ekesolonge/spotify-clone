import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface IAppContext {
  playlistId: string;
  setPlaylistId: React.Dispatch<React.SetStateAction<string>>;
  currentTrackId: string;
  setCurrentTrackId: React.Dispatch<React.SetStateAction<string>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [playlistId, setPlaylistId] = useState("");
  const [currentTrackId, setCurrentTrackId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AppContext.Provider
      value={{
        playlistId,
        setPlaylistId,
        currentTrackId,
        setCurrentTrackId,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

export default AppProvider;
