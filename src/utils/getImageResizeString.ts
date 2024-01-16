export default function getImageResizeString(
  modal: 'fixed' | 'lfit' | 'fill' | 'pad' | 'scale',
  params: {
    width?: number;
    height?: number;
    scale?: number;
  },
) {
  const { width, height, scale } = params;
  const isScale = modal === 'scale';
  const modalString = isScale ? `p_${scale || 100}` : `m_${modal}`;
  const widthString = width ? `,w_${width}` : '';
  const heightString = height ? `,h_${height}` : '';
  const resizeString = '?x-oss-process=image/resize,' + modalString + heightString + widthString;
  return resizeString;
}
