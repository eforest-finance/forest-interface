import { Metadata } from 'next';

// url: string | URL;
// secureUrl?: string | URL;
// alt?: string;
// type?: string;
// width?: string | number;
// height?: string | number;

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
