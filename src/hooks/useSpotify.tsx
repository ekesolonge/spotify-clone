import React, { useEffect } from "react";
import spotifyApi from "../lib/spotify";

const useSpotify = () => {
  useEffect(() => {
    console.log(spotifyApi);
  }, [spotifyApi]);

  return spotifyApi;
};

export default useSpotify;
