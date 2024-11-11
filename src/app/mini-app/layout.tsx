import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forest',
  description: 'Forest',
  twitter: {
    title: 'First NFT marketplace on aelf blockchain',
    description: 'First NFT marketplace on aelf blockchain',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1726107869879-1200_630%20%282%29.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
  openGraph: {
    title: 'First NFT marketplace on aelf blockchain',
    description: 'First NFT marketplace on aelf blockchain',
    type: 'website',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1726107869879-1200_630%20%282%29.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
