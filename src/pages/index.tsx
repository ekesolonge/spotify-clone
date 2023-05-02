import { Layout } from '@/components';
import { NextSeo } from 'next-seo';

export default function Home() {
  return (
    <div className="bg-black h-[100dvh]">
      <NextSeo title="Spotify" />
      <Layout />
    </div>
  );
}
