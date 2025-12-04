import styles from '../style.module.css';
import Card from './Card';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Tag } from './Card';

const Detail = () => {
  return (
    <div className={``}>
      <div></div>
      <h1>SGR Giveaway</h1>
      <Tag title="Ongoing" type="Green" />
      <div>The SGR token was part of the Sögur project, which aimed to create a global digital currency.</div>
    </div>
  );
};

export default Detail;
