import React, { useEffect, useState } from "react";
import { HiHeart, HiOutlinePause, HiOutlineVolumeUp } from "react-icons/hi";
import { useApp } from "../context/AppProvider";
import spotifyApi from "../lib/spotify";

const Footer = () => {
  const { currentTrackId, setCurrentTrackId, setIsPlaying } = useApp();
  const [songInfo, setSongInfo] =
    useState<SpotifyApi.SingleTrackResponse | null>(null);
  const [volume, setVolume] = useState(50);
  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentTrackId)
      spotifyApi
        .getTrack(currentTrackId)
        .then(song => setSongInfo(song.body))
        .catch(error => console.error(error));
  }, [currentTrackId, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId)
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then(song => {
          if (song?.body?.item) setCurrentTrackId(song.body.item?.id);
          setIsPlaying(song.body.is_playing);
        })
        .catch(error => console.error(error));
  }, [currentTrackId, spotifyApi]);

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-5 w-1/4 h-full">
        <img
          src={songInfo?.album.images[0].url}
          alt="album art"
          className="h-full"
        />
        <div>
          <p>{songInfo?.name}</p>
          <p className="text-xs text-[#b3b3b3]">
            {songInfo?.artists.map((artist, index) =>
              songInfo?.artists && index === songInfo?.artists?.length - 1
                ? artist.name
                : `${artist.name}, `
            )}
          </p>
        </div>
        <a>
          <HiHeart className="text-[#1ed760] h-5 w-5" />
        </a>
      </div>
      <div className="flex items-center w-2/4">
        <HiOutlinePause className="h-5 w-5" />
      </div>
      <div className="flex items-center justify-end w-1/4">
        <HiOutlineVolumeUp className="h-5 w-5" />
      </div>
    </div>
  );
};

export default Footer;
