import React, { ReactElement, useState } from 'react';

import GoButtonSvg from 'assets/images/recreation/go-button.svg';
import GoButtonDisabledSvg from 'assets/images/recreation/go-button-disabled.svg';
import GoButtonPcSvg from 'assets/images/recreation/go-button-pc.svg';
import GoButtonDisabledPcSvg from 'assets/images/recreation/go-button-pc-disabled.svg';

import Image from 'next/image';

import styles from './index.module.css';
import useGetState from 'redux/state/useGetState';

export enum Status {
  LOADING = 'loading',
  DISABLED = 'disabled',
  NONE = 'none',
}

export enum ButtonStatus {
  DEFAULT = 'default',
  SELECTED = 'selected',
}

export interface IGoButton {
  status?: Status;
  hasNft?: boolean;
  playableCount?: number;
  sumScore?: number;
  curDiceCount?: number;
  changeCurDiceCount?: (num: number) => void;
  go?: () => void;
}

function GoButton({
  go,
  status = Status.NONE,
  playableCount = 0,
  sumScore = 5,
  curDiceCount,
  changeCurDiceCount,
}: IGoButton) {
  const { isMobile } = useGetState();
  const diceCount = [1, 2, 3];

  const [curPress, setCurPress] = useState<number | null>(null);
  const [curTouch, setCurTouch] = useState<number | null>(null);

  const [curPressM, setCurPriceM] = useState<number | null>(null);

  const [pcBtnMouseOn, setPcBtnMouseOn] = useState(false);
  const [mBtnMouseOn, setMBtnMouseOn] = useState(false);

  const [pcBtnPress, setPcBtnPress] = useState(false);
  const [mBtnPress, setMBtnPress] = useState(false);

  const GoButtonBg: Record<Status, ReactElement> = {
    [Status.NONE]: <GoButtonSvg className="w-full h-full" />,
    [Status.LOADING]: <GoButtonSvg className="w-full h-full" />,
    [Status.DISABLED]: <GoButtonDisabledSvg className="w-full h-full" />,
  };

  const GoButtonPcBg: Record<Status, ReactElement> = {
    [Status.NONE]: <GoButtonPcSvg className="w-full h-full" />,
    [Status.LOADING]: <GoButtonPcSvg className="w-full h-full" />,
    [Status.DISABLED]: <GoButtonDisabledPcSvg className="w-full h-full" />,
  };

  const statusCom: Record<Status, ReactElement> = {
    [Status.NONE]: (
      <>
        <span
          className={`font-fonarto font-[500] tracking-tight text-[#fff] text-stroke-[#52300B] ${
            isMobile ? 'text-[48px] leading-[48px] mt-[10px]' : 'text-[72px] leading-[72px] mb-[4px] mt-[2px]'
          }`}>
          Go
        </span>
        <span
          className={`${
            isMobile ? 'text-[14px] leading-[14px]' : 'text-[21px] leading-[21px]'
          } font-bold text-[#52300B]`}>
          {playableCount}/{sumScore}
        </span>
      </>
    ),
    [Status.LOADING]: (
      <div className={`${styles['button__icon__loading']} ${isMobile ? 'mt-[10px] w-[45px]' : 'mt-[16px] w-[85px]'}`}>
        <div className={styles['button__icon__loading__bounce1']}></div>
        <div className={styles['button__icon__loading__bounce2']}></div>
      </div>
    ),
    [Status.DISABLED]: (
      <>
        <span
          className={`font-fonarto font-[500] text-[#fff] text-stroke-[#8E8E8E] ${
            isMobile ? 'text-[48px] leading-[48px] mt-[10px]' : 'text-[72px] leading-[72px] mb-[4px] mt-[2px]'
          }`}>
          Go
        </span>
        <span
          className={`${
            isMobile ? 'text-[14px] leading-[14px]' : 'text-[21px] leading-[21px]'
          } font-bold text-[#8E8E8E]`}>
          {playableCount}/{sumScore}
        </span>
      </>
    ),
  };

  const chooseDiceCount = (number: number) => {
    changeCurDiceCount && changeCurDiceCount(number);
    setCurPress(number);
  };

  const changeDiceCount = () => {
    const number = ((curDiceCount || 1) % diceCount.length) + 1;
    changeCurDiceCount && changeCurDiceCount(number);
    setCurPress(number);
  };

  return (
    <div
      className={`${styles['button-mobile']} ${
        !isMobile && styles.button
      } relative flex w-full items-center justify-center pb-[9px]`}>
      {isMobile && (
        <div className={styles['button__border']}>
          <div className={styles['button__border__top']} />
          <div className={styles['button__border__bottom']} />
        </div>
      )}

      <div className="relative">
        {!isMobile && (
          <div className="flex items-center justify-between mb-[16px] ml-[-24px]">
            {diceCount.map((item) => {
              return (
                <div
                  onMouseEnter={() => {
                    setCurTouch(item);
                  }}
                  onMouseLeave={() => {
                    setCurTouch(null);
                  }}
                  key={item}
                  className={`${styles['dice-number']} ${
                    curDiceCount === item && curPress !== item && styles.active
                  }  ${curPress === item && styles.press}  ${
                    curTouch === item && curDiceCount !== item && styles['hover']
                  }`}
                  onClick={() => chooseDiceCount(item)}>
                  <Image
                    src={require(`assets/images/diceButton/dice${item}.png`)}
                    alt=""
                    className={`${styles['dice-content']} ${curPress === item && styles['dice-content-press']}`}
                  />
                </div>
              );
            })}
          </div>
        )}
        {isMobile && (
          <div
            className={`${styles['dice-number-mobile']} ${
              curDiceCount === curPressM && styles['dice-number-mobile-press']
            }`}
            onClick={changeDiceCount}>
            {/* {curDiceCount}
             */}
            <Image
              src={require(`assets/images/diceButton/dice${curDiceCount}-m.png`)}
              alt=""
              className={`${styles['dice-content-mobile']} ${
                curPressM === curDiceCount && styles['dice-content-press-mobile']
              }`}
            />
          </div>
        )}
        {/* <button
          className={`${styles['button__icon']} cursor-custom relative flex items-center justify-center`}
          onClick={() => go && go()}>
          {isMobile ? GoButtonBg[status] : GoButtonPcBg[status]}
          <div className="absolute top-[4px] flex flex-col items-center justify-center">{statusCom[status]}</div>
        </button> */}
        {isMobile ? (
          <div
            onMouseEnter={() => {
              setMBtnMouseOn(true);
            }}
            onMouseLeave={() => {
              setMBtnMouseOn(false);
            }}
            onMouseDown={() => {
              setMBtnPress(true);
            }}
            className={`${styles['btn-mobile']} cursor-custom relative flex items-center justify-center ${
              mBtnMouseOn && status === Status.NONE && styles['btn-mobile-hover']
            } ${mBtnPress && status === Status.NONE && styles['btn-mobile-press']} ${
              status === Status.DISABLED && styles['btn-mobile-disabled']
            }`}
            onClick={() => go && go()}>
            {GoButtonBg[status]}
            <div className="absolute top-[4px] flex flex-col items-center justify-center">{statusCom[status]}</div>
          </div>
        ) : (
          <div
            onMouseEnter={() => {
              setPcBtnMouseOn(true);
            }}
            onMouseLeave={() => {
              setPcBtnMouseOn(false);
            }}
            onMouseDown={() => {
              setPcBtnPress(true);
            }}
            className={`${styles['btn-pc']} cursor-custom relative flex items-center justify-center ${
              pcBtnMouseOn && status === Status.NONE && styles['btn-pc-hover']
            } ${pcBtnPress && status === Status.NONE && styles['btn-pc-press']} ${
              status === Status.DISABLED && styles['btn-pc-disabled']
            }`}
            onClick={() => go && go()}>
            {GoButtonPcBg[status]}
            <div className="absolute top-[4px] flex flex-col items-center justify-center">{statusCom[status]}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(GoButton);
