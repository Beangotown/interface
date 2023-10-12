import { Modal } from 'antd';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

import lightTreasure from 'assets/base64/lightTreasure';

import styles from './index.module.css';
import useGetState from 'redux/state/useGetState';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import dataAnimation from 'assets/images/animation/treasureBox.json';
import diceLoading1 from 'assets/images/diceLoading/dice-loading1.json';
import diceLoading2 from 'assets/images/diceLoading/dice-loading2.json';
import diceLoading3 from 'assets/images/diceLoading/dice-loading3.json';
import diceLight1 from 'assets/images/diceLoading/dice-light1.json';
import diceLight2 from 'assets/images/diceLoading/dice-light2.json';
import diceLight3 from 'assets/images/diceLoading/dice-light3.json';
import DiceRes1 from 'assets/images/diceLoading/dice-result1.svg';
import DiceRes2 from 'assets/images/diceLoading/dice-result2.svg';
import DiceRes3 from 'assets/images/diceLoading/dice-result3.svg';
import DiceRes4 from 'assets/images/diceLoading/dice-result4.svg';
import DiceRes5 from 'assets/images/diceLoading/dice-result5.svg';
import DiceRes6 from 'assets/images/diceLoading/dice-result6.svg';
import dice1 from 'assets/images/animation/dice1.json';
import dice2 from 'assets/images/animation/dice2.json';
import dice3 from 'assets/images/animation/dice3.json';
import dice4 from 'assets/images/animation/dice4.json';
import dice5 from 'assets/images/animation/dice5.json';
import dice6 from 'assets/images/animation/dice6.json';
import buttonBg from 'assets/base64/buttonBg';
import { RANDOM_STEP } from 'constants/copywriting';

export enum RecreationModalType {
  LOADING = 'loading',
  DICE = 'dice',
  TREASURE = 'treasure',
  TRANSITION = 'transition',
}

export enum TreasureStatus {
  CLOSE = 'close',
  OPENING = 'Opening',
  OPENED = 'Opened',
}

export enum LoadingType {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

interface IRecreationModal {
  open: boolean;
  step?: number;
  bean?: number;
  diceNumbers?: number[];
  type: RecreationModalType;
  loadingType?: LoadingType;
  onClose?: () => void;
  onTransitionOver?: () => void;
}

function RecreationModal(props: IRecreationModal) {
  const { open, step, bean, type, onClose, diceNumbers, loadingType, onTransitionOver } = props;

  const { isMobile } = useGetState();
  const [treasureStatus, setTreasureStatus] = useState<TreasureStatus>(TreasureStatus.OPENED);
  const [openable, setOpenable] = useState<boolean>(true);

  const treasureAnimationRef = useRef<LottieRefCurrentProps | null>(null);

  const dice: Record<string, Record<string, any>> = {
    1: dice1,
    2: dice2,
    3: dice3,
    4: dice4,
    5: dice5,
    6: dice6,
  };

  const dicePic: Record<string, typeof React.Component> = {
    1: DiceRes1,
    2: DiceRes2,
    3: DiceRes3,
    4: DiceRes4,
    5: DiceRes5,
    6: DiceRes6,
  };

  const loadingAnis: Record<LoadingType, Record<string, any>> = {
    [LoadingType.ONE]: diceLoading1,
    [LoadingType.TWO]: diceLoading2,
    [LoadingType.THREE]: diceLoading3,
  };

  const lights: Record<LoadingType, Record<string, any>> = {
    [LoadingType.ONE]: diceLight1,
    [LoadingType.TWO]: diceLight2,
    [LoadingType.THREE]: diceLight3,
  };

  const openTreasure = () => {
    if (openable) {
      treasureAnimationRef.current?.play();
    }
  };

  useEffect(() => {
    if (!open) {
      setTreasureStatus(TreasureStatus.CLOSE);
      setOpenable(true);
    }
  }, [open]);

  const getDiceCom = (key: number) => {
    const Com = dicePic[key];
    return <Com className="flex-1" key={key}></Com>;
  };

  const modalContent: Record<RecreationModalType, ReactElement | null> = {
    [RecreationModalType.DICE]: (
      <div className="w-full h-full flex items-center justify-center mt-[-80px]">
        <div>{step}</div>
        {diceNumbers?.map((item) => {
          return getDiceCom(item);
        })}
      </div>
    ),
    [RecreationModalType.LOADING]: (
      <div className="relative w-full h-full flex items-center justify-center mt-[-80px]">
        <Lottie
          loop={true}
          autoplay={true}
          animationData={loadingAnis[loadingType || LoadingType.ONE]}
          className={`${isMobile ? 'h-auto w-[90%]' : 'h-[720px] max-h-[640Px] w-[auto]'}`}
        />
        <span
          className={`text-[#fff] absolute left-0 right-0 m-auto text-center font-fonarto ${
            isMobile ? 'text-[16px] bottom-0' : 'text-[42px] bottom-[60px]'
          }`}>
          {RANDOM_STEP}
        </span>
      </div>
    ),
    [RecreationModalType.TRANSITION]: (
      <div className="relative w-full h-full flex items-center justify-center mt-[-80px]">
        <Lottie
          loop={false}
          autoplay={true}
          animationData={lights[loadingType || LoadingType.ONE]}
          className={`${isMobile ? 'h-auto w-[90%]' : 'h-[720px] max-h-[640Px] w-[auto]'}`}
          onComplete={() => {
            onTransitionOver?.();
          }}
        />
      </div>
    ),
    [RecreationModalType.TREASURE]: (
      <div className="relative z-[80] flex h-auto w-full flex-col items-center justify-center">
        <div className={`relative flex items-center justify-center mt-[100px]`}>
          {treasureStatus === TreasureStatus.OPENED ? (
            <div
              className={`absolute left-0 right-0 z-[40] m-auto ${
                isMobile ? 'h-auto w-[67%] top-[-105%]' : 'h-auto w-[377px] top-[-60%]'
              }`}>
              <img src={lightTreasure} className="relative z-[20] h-full w-full" alt="lightTreasure" />
              <span
                className={`absolute bottom-0 left-0 right-0 font-[900] top-0 z-[30] m-auto flex items-center justify-center text-[#fff] ${
                  isMobile ? 'text-[64px]' : 'text-[96px]'
                }`}>
                +{bean}
              </span>
            </div>
          ) : null}
          <Lottie
            lottieRef={treasureAnimationRef}
            loop={false}
            autoplay={false}
            animationData={dataAnimation}
            onComplete={() => {
              setTreasureStatus(TreasureStatus.OPENED);
            }}
            className={`z-[50] ${isMobile ? 'mt-[-70px] h-auto w-[70%]' : 'mt-[-100px] h-auto w-[520px]'}`}
          />
        </div>
        <button
          style={{
            backgroundImage: `url(${buttonBg})`,
          }}
          className={`${styles['treasure-btn']} ${
            isMobile ? styles['treasure-btn-mobile'] : styles['treasure-btn-pc']
          }`}
          onClick={treasureStatus === TreasureStatus.OPENED ? onClose : openTreasure}>
          <span className="mb-[6.5px] font-fonarto">
            {treasureStatus === TreasureStatus.OPENED ? 'Confirm' : 'OPEN'}
          </span>
        </button>
      </div>
    ),
  };

  return (
    <Modal
      open={open}
      footer={null}
      keyboard={false}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      className={styles['recreation-modal']}>
      {open && modalContent[type]}
    </Modal>
  );
}

export default React.memo(RecreationModal);
