'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('pagesComponents/MiniApp/Drops/Detail'), { ssr: false });
