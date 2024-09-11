import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forest',
  description: 'Forest',
  twitter: {
    title: 'title: test share nft to X',
    description: 'description: test share nft to X',
    images: {
      width: 1200,
      height: 675,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/Banner+1.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
  openGraph: {
    title: 'title: test share nft to X',
    description: 'description: test share nft to X',
    type: 'website',
    images: {
      width: 1200,
      height: 675,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/Banner+1.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
