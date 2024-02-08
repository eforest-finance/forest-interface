import { DEFAULT_CELL_WIDTH } from 'constants/index';

const getTextWidth = (text: string, font = '14px Poppins,sans-serif') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    const textmetrics = context.measureText(text);
    return textmetrics.width + 24;
  } else {
    return DEFAULT_CELL_WIDTH;
  }
};

export default getTextWidth;
