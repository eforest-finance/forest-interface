import { Metadata } from 'next';

// url: string | URL;
// secureUrl?: string | URL;
// alt?: string;
// type?: string;
// width?: string | number;
// height?: string | number;

export const metadata: Metadata = {
  openGraph: {
    title: 'title: test share nft to X',
    description: 'description: test share nft to X',
    type: 'website',
    images: {
      width: 1200,
      height: 675,
      url: 'https://looksrare.mo.cloudinary.net/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/0x7fa4427abb4304f7797a5ac2e95ff82965a61af6bfd81a9363f2acfaa23fb1ca?resource_type=image&f=auto&c=limit&w=1200&q=auto',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
