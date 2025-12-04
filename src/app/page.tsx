'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('pagesComponents/Home'), { ssr: false });
