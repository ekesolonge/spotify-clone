import React, { useEffect, useState } from "react";
import { HiOutlineHeart, HiOutlinePlus, HiViewBoards } from "react-icons/hi";
import { useApp } from "../context/AppProvider";
import { useAuth } from "../context/AuthProvider";
import spotifyApi from "../lib/spotify";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { setPlaylistId } = useApp();
  useEffect(() => {
    if (spotifyApi.getAccessToken())
      spotifyApi
        .getUserPlaylists()
        .then(data => {
          setPlaylistId(data.body.items[0].id);
          setPlaylists(data.body.items);
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
  }, [spotifyApi, token]);

  return (
    <div className="p-3 bg-[#121212] rounded-md h-[calc(100vh-168px)] w-[240px]">
      <div>
        <a className="flex gap-3 items-center text-[#b3b3b3] hover:text-white cursor-pointer py-3">
          <HiViewBoards className="h-6 w-6" />
          <p>Your Library</p>
        </a>
        <a className="flex gap-3 items-center text-[#b3b3b3] hover:text-white cursor-pointer py-3">
          <HiOutlinePlus className="h-6 w-6" />
          <p>Create Playlist</p>
        </a>
        <a className="flex gap-3 items-center text-[#b3b3b3] hover:text-white cursor-pointer py-3">
          <HiOutlineHeart className="h-6 w-6" />
          <p>Liked Songs</p>
        </a>
      </div>
      <hr className="border-t-[1px] border-[#282828] my-2" />
      <div className="overflow-y-auto h-[calc(100%-160px)] scrollbar-thin scrollbar-thumb-[hsla(0,0%,100%,.3)] hover:scrollbar-thumb-[hsla(0,0%,100%,.5)]">
        {loading ? (
          <>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
            <div className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse"></div>
          </>
        ) : (
          playlists?.map(playlist => (
            <a
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="block text-[#b3b3b3] hover:text-white cursor-pointer my-3 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {playlist.name}
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
