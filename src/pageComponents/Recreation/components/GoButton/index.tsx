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

  const [curPressM, setCurPressM] = useState<number | null>(null);

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
  };

  const changeDiceCount = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const number = ((curDiceCount || 1) % diceCount.length) + 1;
    setCurPress(number);
    setCurPressM(number);
    changeCurDiceCount && changeCurDiceCount(number);
  };

  return (
    <div className={`${styles['button-mobile']} ${!isMobile && styles.button} relative w-full items-center pb-[9px]`}>
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
                  onMouseDown={() => {
                    if (curDiceCount === item) return;
                    chooseDiceCount(item);
                    setCurPress(item);
                  }}
                  onMouseUp={() => {
                    setCurPress(null);
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
        {isMobile ? (
          <div className={styles['button__border']}>
            <div
              onTouchStart={(event) => {
                event.preventDefault();
                setMBtnPress(true);
                go && go();
              }}
              onTouchEnd={() => {
                setMBtnPress(false);
              }}
              className={`${styles['btn-mobile']} ${styles['button__icon']} cursor-custom relative flex ${
                mBtnPress && styles['btn-mobile-press']
              } ${status === Status.DISABLED && styles['btn-mobile-disabled']}`}>
              <div
                className={`${mBtnPress ? 'top-[4px]' : ''} ${
                  status === Status.LOADING ? 'top-[12px] left-[64px]' : 'left-[56px] top-0'
                } absolute  flex flex-col w-fit h-fit items-center relative justify-center`}>
                {statusCom[status]}
              </div>
              <div
                className={`${styles['dice-number-mobile']} ${
                  curDiceCount === curPressM ? styles['dice-number-mobile-press'] : ''
                }`}
                onTouchStart={changeDiceCount}
                onTouchEnd={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();
                  setCurPress(null);
                  setCurPressM(null);
                }}>
                <Image
                  src={require(`assets/images/diceButton/dice${curDiceCount}-m.png`)}
                  alt=""
                  className={`${styles['dice-content-mobile']} ${
                    curPressM === curDiceCount && styles['dice-content-mobile-press']
                  }`}
                />
              </div>
            </div>
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
            onMouseUp={() => {
              setPcBtnPress(false);
            }}
            className={`${styles['btn-pc']} ${
              styles['button__icon']
            } cursor-custom relative flex items-center justify-center ${
              pcBtnMouseOn && status === Status.NONE && styles['btn-pc-hover']
            } ${pcBtnPress && status === Status.NONE && styles['btn-pc-press']} ${
              status === Status.DISABLED && styles['btn-pc-disabled']
            }`}
            onClick={() => go && go()}>
            <div
              className={`${
                pcBtnPress ? 'mt-[5px]' : ''
              } absolute top-[10px] flex ml-[12px] flex-col items-center justify-center`}>
              {statusCom[status]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(GoButton);
