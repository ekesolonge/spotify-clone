import useSpotify from "@/hooks/useSpotify";
import useStore from "@/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HiOutlineHeart, HiOutlinePlus, HiViewBoards } from "react-icons/hi";

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[] | null
  >(null);
  const setPlaylistId = useStore(state => state.setPlaylistId);
  const playlistId = useStore(state => state.playlistId);
  const sidebar = useStore(state => state.sidebar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !playlistId) {
      spotifyApi
        .getUserPlaylists()
        .then(data => {
          setPlaylists(data.body.items);
          setPlaylistId(data.body.items[0].id);
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [spotifyApi, setPlaylistId, session, playlistId]);

  return (
    <div
      className={`py-3 bg-[#121212] rounded-md h-[calc(100vh-168px)] w-full md:w-[240px] md:block ${
        sidebar ? "block" : "hidden"
      }`}
    >
      <div className="px-3">
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
        {loading
          ? Array.from(Array(7).keys()).map(index => (
              <div
                key={index}
                className="inline-block w-full h-6 opacity-30 bg-gray-400 my-3 animate-pulse mx-3"
              />
            ))
          : playlists?.map(playlist => (
              <a
                key={playlist.id}
                onClick={() => setPlaylistId(playlist.id)}
                className={`block rounded-md text-[#b3b3b3] hover:text-white cursor-pointer p-3 overflow-hidden text-ellipsis whitespace-nowrap ${
                  playlistId === playlist.id ? "bg-[#ffffff1a]" : ""
                }`}
              >
                {playlist.name}
              </a>
            ))}
      </div>
    </div>
  );
};

export default Sidebar;
