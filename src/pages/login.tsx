import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
} from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

const Login = ({ providers }: Props) => {
  return (
    <div className="h-screen grid place-items-center bg-black">
      <NextSeo title="Login" />
      <div className="flex items-center justify-center flex-col">
        <Image
          priority
          src="/logo.svg"
          alt="logo"
          className="mb-6"
          height={168}
          width={168}
        />
        {providers &&
          Object.values(providers).map(provider => (
            <a
              key={provider.id}
              className="bg-[#1ed760] p-5 rounded-full text-white font-semibold text-lg cursor-pointer"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Sign in with {provider.name}
            </a>
          ))}
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const providers = await getProviders();
  return { props: { providers } };
};
