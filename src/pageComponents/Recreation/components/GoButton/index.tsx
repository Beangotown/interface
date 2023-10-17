import React, { ReactElement, useState } from 'react';

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
  const { isMobile, btnImageResources } = useGetState();

  const diceCount = [1, 2, 3];

  const diceImages: Record<string, string> = {
    1: btnImageResources!.pc['dice1'],
    2: btnImageResources!.pc['dice2'],
    3: btnImageResources!.pc['dice3'],
  };

  const [curPress, setCurPress] = useState<number | null>(null);
  const [curTouch, setCurTouch] = useState<number | null>(null);

  const [curPressM, setCurPressM] = useState<number | null>(null);

  const [pcBtnMouseOn, setPcBtnMouseOn] = useState(false);

  const [pcBtnPress, setPcBtnPress] = useState(false);
  const [mBtnPress, setMBtnPress] = useState(false);

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
          className={`font-fonarto font-[500] tracking-tight text-[#fff] text-stroke-[#8E8E8E] ${
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

  const changeDiceCount = (event: React.TouchEvent<HTMLDivElement>) => {
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
                  style={{
                    backgroundImage: `url(${
                      btnImageResources?.pc[
                        curDiceCount === item && curPress !== item
                          ? 'bg-dice-selected'
                          : curPress === item
                          ? 'bg-dice-press'
                          : curTouch === item && curDiceCount !== item
                          ? 'bg-dice-hover'
                          : 'bg-dice-default'
                      ]
                    })`,
                  }}
                  className={`${styles['dice-number']}`}
                  onClick={() => chooseDiceCount(item)}>
                  {curPress && curPress === item && <div className={styles['dice-content-mask']}></div>}

                  <img
                    src={diceImages[item]}
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
              }}
              onTouchEnd={() => {
                setMBtnPress(false);
                go && go();
              }}
              style={{
                backgroundImage: `url(${
                  btnImageResources?.mobile[
                    mBtnPress ? 'bg-go-press-m' : status === Status.DISABLED ? 'bg-go-disabled-m' : 'bg-go-default-m'
                  ]
                })`,
              }}
              className={`${styles['btn-mobile']} ${styles['button__icon']} cursor-custom relative flex`}>
              {mBtnPress && status === Status.NONE && <div className={styles['btn-mobile-mask']}></div>}

              <div
                className={`${mBtnPress ? 'top-[4px]' : ''} ${
                  status === Status.LOADING ? 'top-[12px] left-[64px]' : 'left-[54px] top-0'
                } absolute flex flex-col w-fit h-fit items-center relative justify-center`}>
                {statusCom[status]}
              </div>
              <div
                style={{
                  backgroundImage: `url(${
                    btnImageResources?.mobile[curDiceCount === curPressM ? 'bg-dice-press-m' : 'bg-dice-default-m']
                  })`,
                }}
                className={`relative ${styles['dice-number-mobile']}`}
                onTouchStart={changeDiceCount}
                onTouchEnd={(event) => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();
                  setCurPress(null);
                  setCurPressM(null);
                }}>
                {curPressM && <div className={styles['dice-content-mobile-mask']}></div>}

                <img
                  src={btnImageResources!.mobile[`dice${curDiceCount}-m`]}
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
              go && go();
            }}
            style={{
              backgroundImage: `url(${
                btnImageResources?.pc[
                  pcBtnMouseOn && status === Status.NONE
                    ? 'bg-go-hover-pc'
                    : pcBtnPress && status === Status.NONE
                    ? 'bg-go-press-pc'
                    : status === Status.DISABLED
                    ? 'bg-go-disabled-pc'
                    : 'bg-go-default-pc'
                ]
              })`,
            }}
            className={`${styles['btn-pc']} ${styles['button__icon']} cursor-custom relative flex items-center justify-center z-[11]  `}>
            {pcBtnPress && status === Status.NONE && <div className={styles['btn-pc-mask']}></div>}
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
