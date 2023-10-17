import React from 'react';
import styles from './index.module.css';
import Arrow from 'assets/images/recreation/arrow.svg';
import { ArrowDirection, ICheckerboardItem } from 'pageComponents/Recreation/checkerboard';
import useGetState from 'redux/state/useGetState';

function Lattice(props: { value: ICheckerboardItem }) {
  const { value } = props;
  const { isMobile } = useGetState();

  const arrowStyle: Record<ArrowDirection, string> = {
    [ArrowDirection.LEFT]: 'rotate-180',
    [ArrowDirection.RIGHT]: 'rotate-0',
    [ArrowDirection.TOP]: 'rotate-[-90deg]',
    [ArrowDirection.BOTTOM]: 'rotate-90',
  };

  if (!value.image) return null;
  return (
    <div
      className={`relative z-10 flex aspect-[56/60] w-full flex-col items-center justify-center rounded-[14px] ${
        styles.lattice
      } ${!isMobile && styles['lattice-mobile']} ${value.arrow && styles['lattice--shadow']} bg-transparent`}>
      <div
        className="absolute left-0 top-0 flex"
        style={{
          width: `calc(${(value.width ?? 1) * 100}% + ${((value.width ?? 1) - 1) * 1.2}px)`,
          height: `calc(${(value.height ?? 1) * 100}% + ${((value.height ?? 1) - 1) * 0.8}px)`,
        }}>
        {value.positionImage && (
          <img
            className={`absolute top-[-8px] h-auto ${
              isMobile ? 'left-[10px] h-[529px] w-[20px]' : 'left-[30px] h-[58px] w-[40px]'
            }`}
            src={value.positionImage}
            alt="image"
          />
        )}
        <img className={`h-full w-full`} src={value.image} alt="image" />
      </div>
      {value.arrowColor && value.arrow && (
        <div
          className={styles['lattice__arrow']}
          style={{
            color: `${value.arrowColor}`,
          }}>
          <Arrow
            className={`${arrowStyle[value.arrow]}`}
            style={{
              stroke: `${value.arrowColor}`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(Lattice);
