import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { HiOutlineHome, HiOutlineSearch } from "react-icons/hi";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-between p-4">
      <a onClick={() => router.push("/")}>
        <Image
          className="h-10 w-10"
          src="/logo.svg"
          alt="logo"
          height={168}
          width={168}
        />
      </a>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => router.push("/")}
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
      <div className="flex items-center gap-4">
        {session?.user.image && (
          <Image
            className="rounded-full"
            alt="user-image"
            src={session.user.image}
            width={30}
            height={30}
          />
        )}
        <button onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
