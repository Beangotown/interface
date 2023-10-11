import React, { ReactElement } from 'react';

import GoButtonSvg from 'assets/images/recreation/go-button.svg';
import GoButtonDisabledSvg from 'assets/images/recreation/go-button-disabled.svg';
import GoButtonPcSvg from 'assets/images/recreation/go-button-pc.svg';
import GoButtonDisabledPcSvg from 'assets/images/recreation/go-button-pc-disabled.svg';

import DiceBtn1 from 'assets/images/diceButton/dice1.svg';
import diceBtn1Png from '../../../../assets/images/diceButton/dice1.png';
import DiceBtn2 from 'assets/images/diceButton/dice2.svg';
import DiceBtn3 from 'assets/images/diceButton/dice3.svg';
import DiceBtn1Selected from 'assets/images/diceButton/dice1-selected.svg';
import DiceBtn2Selected from 'assets/images/diceButton/dice1-selected.svg';
import DiceBtn3Selected from 'assets/images/diceButton/dice1-selected.svg';

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

  const diceButtons: Record<string, Record<ButtonStatus, ReactElement>> = {
    1: {
      [ButtonStatus.DEFAULT]: <DiceBtn1 className="w-full h-full" />,
      [ButtonStatus.SELECTED]: <DiceBtn1Selected className="w-full h-full" />,
    },
    2: {
      [ButtonStatus.DEFAULT]: <DiceBtn2 className="w-full h-full" />,
      [ButtonStatus.SELECTED]: <DiceBtn2Selected className="w-full h-full" />,
    },
    3: {
      [ButtonStatus.DEFAULT]: <DiceBtn3 className="w-full h-full" />,
      [ButtonStatus.SELECTED]: <DiceBtn3Selected className="w-full h-full" />,
    },
  };

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

  const changeDiceCount = () => {
    const number = ((curDiceCount || 1) % diceCount.length) + 1;
    changeCurDiceCount && changeCurDiceCount(number);
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
          <div className="flex items-center justify-between mb-[32px]">
            {diceCount.map((item) => {
              return (
                <div
                  key={item}
                  className={`${styles['dice-number']} ${curDiceCount === item && styles.active}`}
                  onClick={() => chooseDiceCount(item)}>
                  {curDiceCount === item ? diceButtons[item].selected : diceButtons[item].default}
                </div>
              );
            })}
          </div>
        )}
        {isMobile && (
          <div className={styles['dice-number-mobile']} onClick={changeDiceCount}>
            {curDiceCount}
          </div>
        )}
        <button
          className={`${styles['button__icon']} cursor-custom relative flex items-center justify-center`}
          onClick={() => go && go()}>
          {isMobile ? GoButtonBg[status] : GoButtonPcBg[status]}
          <div className="absolute top-[4px] flex flex-col items-center justify-center">{statusCom[status]}</div>
        </button>
      </div>
    </div>
  );
}

export default React.memo(GoButton);
