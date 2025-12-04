'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('pagesComponents/CreateItemV2'), { ssr: false });
