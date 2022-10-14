import React, { useEffect, useState } from "react";
import { HiHeart, HiOutlineClock, HiOutlineHeart } from "react-icons/hi";
import { useApp } from "../context/AppProvider";
import { useAuth } from "../context/AuthProvider";
import spotifyApi from "../lib/spotify";
import msToMinutesAndSeconds from "../utils/msToMinutesAndSeconds";

interface Playlist extends SpotifyApi.SinglePlaylistResponse {
  primary_color?: string;
}

const Main = () => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { playlistId, setCurrentTrackId } = useApp();
  useEffect(() => {
    if (spotifyApi.getAccessToken() && playlistId)
      spotifyApi
        .getPlaylist(playlistId)
        .then(data => setPlaylist(data.body))
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
  }, [spotifyApi, token, playlistId]);

  const colors = [
    "indingo-500",
    "blue-500",
    "green-500",
    "red-500",
    "yellow-500",
    "pink-500",
    "purple-500",
    "orange-500",
  ];
  const gradient = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="flex-grow p-4 text-sm bg-[#121212] rounded-md w-[220px] overflow-y-auto h-[calc(100vh-168px)] scrollbar-thin scrollbar-thumb-[hsla(0,0%,100%,.3)] hover:scrollbar-thumb-[hsla(0,0%,100%,.5)]">
      <section
        className={`p-4 gap-5 bg-gradient-to-b from-${
          playlist?.primary_color ? `[${playlist?.primary_color}]` : gradient
        } to-[#121212] flex`}
      >
        <img
          src={playlist?.images?.[0].url}
          alt="playlist-cover"
          className="h-[230px] w-[230px] shadow-2xl bg-slate-600"
        />
        <div className="flex items-end">
          <div className="font-semibold">
            <p className="mb-2 font-bold text-xs">
              {`${playlist?.public ? "PUBLIC" : "PRIVATE"} PLAYLIST`}
            </p>
            <h1 className="text-2xl md:text-4xl xl:text-8xl font-bold mb-8">
              {playlist?.name}
            </h1>
            <p className="mb-2 text-[#B3B3B3]">{playlist?.description}</p>
            <p className="font-bold">
              {`${playlist?.owner.display_name} • ${playlist?.tracks.total} songs, `}
              <span className="opacity-[0.8]">1 hr 12 min</span>
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="text-[#B3B3B3] p-3 items-center text-sm my-5 grid grid-cols-track border-b-[1px] border-[hsla(0,0%,100%,.1)]">
          <p>#</p>
          <p>TITLE</p>
          <p>ALBUM</p>
          <p>DATE ADDED</p>
          <p className="flex justify-end">
            <HiOutlineClock className="h-6 w-6" />
          </p>
        </div>
        {playlist?.tracks.items.map((track, index) => (
          <div
            key={track.track?.id}
            className="text-[#B3B3B3] p-3 items-center text-sm font-semibold grid grid-cols-track hover:bg-[#ffffff1a]"
          >
            <p>{index + 1}</p>
            <div className="flex gap-2 items-center">
              <img
                src={track.track?.album.images[0].url}
                alt="album art"
                className="w-10 h-10"
              />
              <div>
                <a
                  onClick={() =>
                    track.track && setCurrentTrackId(track.track?.id)
                  }
                  className="text-white cursor-pointer hover:underline"
                >
                  {track.track?.name}
                </a>
                <p>
                  {track.track?.artists.map((artist, index) =>
                    track.track?.artists &&
                    index === track.track?.artists?.length - 1
                      ? artist.name
                      : `${artist.name}, `
                  )}
                </p>
              </div>
            </div>
            <p>{track.track?.album.name}</p>
            <p>
              {Intl.DateTimeFormat("en-us", { dateStyle: "medium" }).format(
                new Date(track.added_at)
              )}
            </p>
            <div className="flex justify-end">
              <div className="flex gap-6">
                <HiHeart className="h-6 w-6 text-[#1ed760]" />
                <p>{msToMinutesAndSeconds(track.track?.duration_ms)}</p>
                {/* <HiOutlineHeart className="h-6 w-6" /> */}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Main;
