import { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: {
    title: 'title: test share nft to X',
    description: 'description: test share nft to X',
    images: [
      {
        url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
      },
    ],
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
