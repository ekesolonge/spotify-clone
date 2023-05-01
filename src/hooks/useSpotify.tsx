import spotifyApi from "@/lib/spotify";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") signIn();
    if (session?.user.accessToken)
      spotifyApi.setAccessToken(session.user.accessToken);
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
