import useSpotify from "@/hooks/useSpotify";
import useStore from "@/store";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineStepBackward, AiOutlineStepForward } from "react-icons/ai";
import { BiVolumeFull, BiVolumeLow } from "react-icons/bi";
import { BsShuffle } from "react-icons/bs";
import { HiPause, HiPlay } from "react-icons/hi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";

const Footer = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const isPlaying = useStore(state => state.isPlaying);
  const setCurrentTrackId = useStore(state => state.setCurrentTrackId);
  const currentTrackId = useStore(state => state.currentTrackId);
  const setIsPlaying = useStore(state => state.setIsPlaying);
  const playlistId = useStore(state => state.playlistId);
  const [songInfo, setSongInfo] =
    useState<SpotifyApi.SingleTrackResponse | null>(null);
  const [volume, setVolume] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "track" | "context">("off");

  useEffect(() => {
    if (spotifyApi.getAccessToken())
      spotifyApi
        .getMyCurrentPlaybackState()
        .then(res => {
          if (!res.body) return;
          const { item, is_playing, device, shuffle_state, repeat_state } =
            res.body;
          item && setCurrentTrackId(item?.id);
          device.volume_percent && setVolume(device.volume_percent);
          setIsPlaying(is_playing);
          setShuffle(shuffle_state);
          setRepeat(repeat_state);
        })
        .catch(error => console.error(error));
  }, [setCurrentTrackId, setIsPlaying, spotifyApi, session]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentTrackId) {
      spotifyApi
        .getTrack(currentTrackId)
        .then(song => setSongInfo(song.body))
        .catch(error => console.error(error));
    }
  }, [currentTrackId, spotifyApi, session]);

  const debounceAdjustVolume = useCallback(
    (volume: number) => {
      debounce(() => {
        spotifyApi.setVolume(volume).catch(error => console.error(error));
      }, 500);
    },
    [spotifyApi]
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume, debounceAdjustVolume, spotifyApi, session]);

  const handlePauseAndPlay = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then(state => {
        try {
          // If there's no track playing play the first in playlist
          if (!state.body) {
            spotifyApi
              .getPlaylist(playlistId)
              .then(playlist =>
                spotifyApi.play({
                  context_uri: playlist.body.uri,
                  offset: {
                    uri: playlist.body.tracks.items[0].track?.uri ?? "",
                  },
                })
              )
              .catch(error => console.error(error));
            return;
          }
          if (state.body.is_playing) {
            spotifyApi.pause();
            setIsPlaying(!state.body.is_playing);
          } else {
            spotifyApi.play();
            setIsPlaying(!state.body.is_playing);
          }
        } catch (error) {
          console.error(error);
        }
      })
      .catch(error => console.error(error));
  };

  const handleShuffle = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then(state => {
        if (!state) return;
        if (state.body.shuffle_state) {
          spotifyApi
            .setShuffle(!state.body.shuffle_state)
            .then(() => setShuffle(!state.body.shuffle_state))
            .catch(error => console.error(error));
        } else {
          spotifyApi
            .setShuffle(!state.body.shuffle_state)
            .then(() => setShuffle(!state.body.shuffle_state))
            .catch(error => console.error(error));
        }
      })
      .catch(error => console.error(error));
  };

  const handleRepeat = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then(state => {
        if (!state) return;
        if (state.body.repeat_state === "off") {
          spotifyApi
            .setRepeat("context")
            .then(() => setRepeat("context"))
            .catch(error => console.error(error));
        } else if (state.body.repeat_state === "context") {
          spotifyApi
            .setRepeat("track")
            .then(() => setRepeat("track"))
            .catch(error => console.error(error));
        } else {
          spotifyApi
            .setRepeat("off")
            .then(() => setRepeat("off"))
            .catch(error => console.error(error));
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-5 w-1/4 h-full">
        {songInfo ? (
          <Image
            src={songInfo?.album.images[0].url}
            alt="album art"
            className="h-full"
            width={50}
            height={50}
          />
        ) : (
          <div className="h-[40px] w-[40px] opacity-30 bg-gray-400 my-3 animate-pulse"></div>
        )}
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
      </div>
      <div className="w-2/4 flex items-center justify-center gap-4">
        {shuffle ? (
          <BsShuffle
            onClick={handleShuffle}
            className="button text-[#1ed760]"
          />
        ) : (
          <BsShuffle onClick={handleShuffle} className="button" />
        )}
        <AiOutlineStepBackward
          onClick={() => spotifyApi.skipToPrevious()}
          className="button h-6 w-6"
        />
        {isPlaying ? (
          <HiPause
            onClick={handlePauseAndPlay}
            className="button h-10 w-10 text-white hover:opacity-[0.9]"
          />
        ) : (
          <HiPlay
            onClick={handlePauseAndPlay}
            className="button h-10 w-10 text-white hover:opacity-[0.9]"
          />
        )}
        <AiOutlineStepForward
          onClick={() => spotifyApi.skipToNext()}
          className="button h-6 w-6"
        />
        {repeat === "off" ? (
          <TbRepeat onClick={handleRepeat} className="button" />
        ) : repeat === "track" ? (
          <TbRepeatOnce
            onClick={handleRepeat}
            className="button text-primary"
          />
        ) : (
          <TbRepeat onClick={handleRepeat} className="button text-primary" />
        )}
      </div>
      <div className="flex items-center justify-end gap-2 w-1/4">
        <BiVolumeLow
          className="button"
          onClick={() => volume > 0 && setVolume(prev => prev - 10)}
        />
        <input
          className="bg-[#b3b3b3] h-1 rounded outline-none slider opacity-[0.8] appearance-none cursor-pointer"
          type="range"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          step={10}
          max={100}
          min={0}
        />
        <BiVolumeFull
          className="button"
          onClick={() => volume < 100 && setVolume(prev => prev + 10)}
        />
      </div>
    </div>
  );
};

export default Footer;
