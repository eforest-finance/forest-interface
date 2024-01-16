'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('pagesComponents/Landing'), { ssr: false });
