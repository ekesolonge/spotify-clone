import { HiOutlineHome, HiOutlineSearch } from "react-icons/hi";
import { useAuth } from "../context/AuthProvider";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex justify-between p-4">
      <a onClick={() => navigate("/")}>
        <img className="h-10 w-10" src={Logo} alt="logo" />
      </a>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => navigate("/")}
          className="bg-[#242424] flex items-center justify-center rounded-full flex-shrink-0 h-10 w-10 hover:opacity-[0.9]"
        >
          <HiOutlineHome className="text-[hsla(0,0%,100%,.7)] h-6 w-6" />
        </button>
        <div className="bg-[#242424] flex gap-2 items-center w-full rounded-3xl hover:opacity-[0.9]">
          <button className="shrink-0 flex items-center justify-center rounded-full h-10 w-10">
            <HiOutlineSearch className="text-[hsla(0,0%,100%,.7)] h-6 w-6" />
          </button>
          <input
            placeholder="What do you want to listen to?"
            className="w-[400px] pr-2 bg-transparent hover:outline-none hover:border-none focus:outline-none"
          />
        </div>
      </div>
      <div>
        <img />
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
