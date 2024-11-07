import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forest',
  description: 'Forest',
  twitter: {
    title: 'Stability World',
    description: 'You can contact @stabilityworld_ai_bot right away.',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1729830000297-activityTitle.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
  openGraph: {
    title: 'Stability World',
    description: 'You can contact @stabilityworld_ai_bot right away.',
    type: 'website',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1729830000297-activityTitle.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
