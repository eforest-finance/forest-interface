import { traitsData } from './tratisData';
import BigNumber from 'bignumber.js';

const traitsTypeData = {
  Background: 100,
  Clothes: 100,
  Breed: 100,
  Theme: 4,
  Hat: 10,
  Eyes: 10,
  Pet: 10,
  Mouth: 6,
  Face: 4,
  Mustache: 4,
  Necklace: 4,
  Paw: 4,
  Trousers: 4,
  Belt: 4,
  Shoes: 4,
  Wings: 4,
  Tail: 4,
  Ride: 4,
  Weapon: 8,
  Accessory: 8,
  'Zodiac Signs': 2,
  'Quantum State': 2,
};

const levels = [
  0.00008, 0.00012, 0.00016, 0.0002, 0.0003, 0.00034, 0.0004, 0.0005, 0.00051, 0.00068, 0.00085, 0.001, 0.001332,
  0.0016666, 0.0018, 0.002, 0.005, 0.0085,
];

function getRarity(typeArray, valueArray, consoleFn) {
  const levelsObject = {};
  levels.forEach((level, index) => {
    levelsObject[index] = {
      amount: 0,
      rarity: new BigNumber(level).times(100).toString() + '%',
    };
  });
  typeArray.forEach((type, typeIndex) => {
    const typeRarity = traitsTypeData[type];
    const valueRarity = traitsData[type][valueArray[typeIndex]];
    const rarity = new BigNumber(typeRarity).times(valueRarity).div(100).toNumber();
    // console.log('levels.indexOf(rarity):', levels.indexOf(rarity), rarity);
    levelsObject[levels.indexOf(rarity)].amount += 1;
    console.info(
      `${typeIndex} Type ${type} rarity: ${typeRarity} %; Value ${valueArray[typeIndex]} rarity: ${new BigNumber(
        valueRarity,
      )
        .times(100)
        .toString()} %; total rarity: ${rarity} %, level: ${levels.indexOf(rarity)}`,
    );
  });
  console.info('rarityInfo', levelsObject);
}

export { getRarity };

// getRarity(['Background', 'Clothes', 'Mustache', 'Mouth'], ['Lime LIght', 'Admirals Coat', 'Split Beard', 'Wincing']);
