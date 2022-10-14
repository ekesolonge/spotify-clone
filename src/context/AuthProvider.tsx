import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-node";
import spotifyApi from "../lib/spotify";

interface IAuthContext {
  token: string;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (hash && !token) {
      const data = hash
        .substring(1)
        .split("&")
        .find((elem: string) => elem.startsWith("access_token"))
        ?.split("=")[1];
      if (data) token = data;

      window.location.hash = "";
      if (token) {
        window.localStorage.setItem("token", token);
        setToken(token);
        spotifyApi.setAccessToken(token);
        navigate("/");
      }
    }

    if (token) {
      setToken(token);
      spotifyApi.setAccessToken(token);
      navigate("/");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
