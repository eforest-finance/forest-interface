'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('pagesComponents/CreateCollectionV2'), { ssr: false });
