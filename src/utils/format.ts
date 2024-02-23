import BigNumber from 'bignumber.js';

export function formatTokenPrice(
  price: number | BigNumber | string,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;

  if (!priceBig.isEqualTo(0) && priceBig.lt(0.0001)) {
    return '< 0.0001';
  }

  const priceFixed = priceBig.toFixed(decimalPlaces, roundingMode);
  const res = new BigNumber(priceFixed).toFormat();
  return res;
}

export function formatUSDPrice(
  price: number | BigNumber | string,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;
  const priceFixed = priceBig.toFixed(decimalPlaces, roundingMode);
  const priceFixedBig = new BigNumber(priceFixed);

  if (priceBig.comparedTo(0) === 0) {
    return '$ 0';
  }

  if (priceFixedBig.comparedTo(0.0001) === -1) {
    return '<$ 0.0001';
  }

  return `$ ${priceFixedBig.toFormat()}`;
}
