import Logo from "../assets/logo.svg";
import { LOGIN_URL } from "../lib/spotify";

const Login = () => {
  return (
    <div className="h-screen grid place-items-center bg-black">
      <div className="flex items-center justify-center flex-col">
        <img src={Logo} alt="logo" className="mb-6" />
        <a
          className="bg-[#1ed760] p-5 rounded-full text-white font-semibold text-lg"
          href={LOGIN_URL}
        >
          Sign in with Spotify
        </a>
      </div>
    </div>
  );
};

export default Login;
