import useSpotify from "@/hooks/useSpotify";
import useStore from "@/store";
import msToMinutesAndSeconds from "@/utils/msToMinutesAndSeconds";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlineClock } from "react-icons/hi";
import Loader from "./Loader";

interface Playlist extends SpotifyApi.SinglePlaylistResponse {
  primary_color?: string;
}

const COLORS = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-orange-500",
];

const Main = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("");
  const [alert, setAlert] = useState("");
  const playlistId = useStore(state => state.playlistId);
  const setCurrentTrackId = useStore(state => state.setCurrentTrackId);
  const currentTrackId = useStore(state => state.currentTrackId);
  const setIsPlaying = useStore(state => state.setIsPlaying);
  const sidebar = useStore(state => state.sidebar);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && playlistId) {
      spotifyApi
        .getPlaylist(playlistId)
        .then(data => {
          setPlaylist(data.body);
          setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [playlistId, spotifyApi, setLoading, session]);

  const playSong = async (track: SpotifyApi.TrackObjectFull | null) => {
    if (!track || !playlist) return;
    try {
      const { body: devices } = await spotifyApi.getMyDevices();
      const device_id = devices.devices?.[0]?.id;
      if (!device_id) {
        setAlert("No active devices");
        return;
      }
      spotifyApi
        .play({
          context_uri: playlist.uri,
          offset: { uri: track.uri },
          device_id,
        })
        .then(() => setAlert(""))
        .catch(() => setAlert("An error occurred"));
      setCurrentTrackId(track?.id);
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center flex-grow">
        <Loader />
      </div>
    );

  return (
    <main
      className={`flex-grow sm:p-4 text-sm bg-[#121212] rounded-md w-[220px] overflow-y-auto h-[calc(100vh-168px)] scrollbar-thin scrollbar-thumb-[hsla(0,0%,100%,.3)] hover:scrollbar-thumb-[hsla(0,0%,100%,.5)] ${
        sidebar ? "hidden" : "block"
      } md:block`}
    >
      {alert && <p className="p-4 bg-red-500 text-white">{alert}</p>}
      <section
        className={`flex p-4 gap-5 bg-gradient-to-b ${color} flex-col md:flex-row`}
      >
        {playlist?.images && (
          <div className="aspect-square">
            <Image
              src={playlist.images[0].url}
              alt="playlist-cover"
              className="w-full md:min-w-[230px] shadow-2xl bg-slate-600"
              width={230}
              height={230}
            />
          </div>
        )}
        <div className="flex items-end">
          <div className="font-semibold">
            <p className="mb-2 font-bold text-xs">
              {`${playlist?.public ? "PUBLIC" : "PRIVATE"} PLAYLIST`}
            </p>
            {playlist?.name &&
              (playlist.name.length > 20 ? (
                <h1 className="text-2xl md:text-4xl xl:text-4xl font-bold mb-8">
                  {playlist.name}
                </h1>
              ) : (
                <h1 className="text-2xl md:text-4xl xl:text-7xl font-bold mb-8">
                  {playlist.name}
                </h1>
              ))}
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
          <p className="col-span-3 md:col-auto">TITLE</p>
          <p className="hidden md:block">ALBUM</p>
          <p className="hidden md:block">DATE ADDED</p>
          <p className="flex justify-end w-[5ch]">
            <HiOutlineClock className="h-6 w-6" />
          </p>
        </div>
        {playlist?.tracks.items.map((track, index) => (
          <div
            key={track.track?.id}
            className="text-[#B3B3B3] p-3 items-center text-sm font-semibold grid grid-cols-track opacity-80 hover:bg-[#ffffff1a] hover:opacity-100"
          >
            <p>{index + 1}</p>
            <div className="flex gap-2 items-center col-span-3 md:col-auto">
              {track.track && (
                <Image
                  src={track.track.album.images[0].url}
                  alt="album art"
                  className="w-10 h-10"
                  width={40}
                  height={40}
                />
              )}
              <div>
                <a
                  onClick={() => playSong(track.track)}
                  className={`${
                    track.track?.id === currentTrackId
                      ? "text-primary"
                      : "text-white"
                  } cursor-pointer hover:underline`}
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
            <p className="hidden md:block">{track.track?.album.name}</p>
            <p className="hidden md:block">
              {Intl.DateTimeFormat("en-us", { dateStyle: "medium" }).format(
                new Date(track.added_at)
              )}
            </p>
            <div className="flex justify-end w-[5ch]">
              <p>{msToMinutesAndSeconds(track.track?.duration_ms)}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Main;
