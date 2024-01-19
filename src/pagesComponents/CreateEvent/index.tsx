'use client';

import { Form } from 'antd';
import { CollectionSelect } from './components/CollectionSelect';
import { useState } from 'react';
import { useMount } from 'react-use';

export default function CreateEvent() {
  const [collections, setCollections] = useState([]);

  useMount(() => {
    setCollections([
      {
        collectionName: 'NFT Collection Name 01',
        symbol: 'AAAAAAA-0',
      },
      {
        collectionName: 'NFT Collection Name 02',
        symbol: 'AAAAAAB-0',
      },
      {
        collectionName: 'NFT Collection Name 03',
        symbol: 'AAAAAAC-0',
      },
    ]);
  });

  return (
    <Form layout="vertical" size="large" className="max-w-[1024px] !mx-auto !pt-[24px] !px-4">
      <h1 className="text-[24px] my-0 font-bold leading-normal">Create an Event</h1>
      <Form.Item label="Choose a collection" required>
        <CollectionSelect options={collections} />
      </Form.Item>
      <Form.Item label="Event Name" required></Form.Item>
      <Form.Item label="Event Time" required></Form.Item>
      <Form.Item label="Limit Per User" required></Form.Item>
      <Form.Item label="Mint Price" required></Form.Item>
      <Form.Item label="Burn the Non-mint NFT" required></Form.Item>
      <Form.Item label="Event Description" required></Form.Item>
      <Form.Item label="Event Banner" required></Form.Item>
      <Form.Item label="Event Promotional Image" required></Form.Item>
      <Form.Item label="Links to social medial" required></Form.Item>
    </Form>
  );
}
