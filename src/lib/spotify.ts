import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi({
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
});

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
];

export const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${
  import.meta.env.VITE_CLIENT_ID
}&redirect_uri=${window.origin}&response_type=token&scope=${scopes.join(" ")}`;

export default spotifyApi;
