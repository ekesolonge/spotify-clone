import React, { useEffect } from "react";
import { useApp } from "../context/AppProvider";
import spotifyApi from "../lib/spotify";

const useSongInfo = () => {
  const { currentTrackId } = useApp();
  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await spotifyApi.getTrack(currentTrackId);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return <div>useSongInfo</div>;
};

export default useSongInfo;
