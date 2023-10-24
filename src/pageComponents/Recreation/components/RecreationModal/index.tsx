import { Modal } from 'antd';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

import lightTreasure from 'assets/base64/lightTreasure';

import styles from './index.module.css';
import useGetState from 'redux/state/useGetState';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import dataAnimation from 'assets/images/animation/treasureBox.json';
import treasureBoxHalloween from 'assets/images/animation/treasureBoxHalloween.json';
import diceLoading1 from 'assets/images/diceLoading/dice-loading1.json';
import diceLoading2 from 'assets/images/diceLoading/dice-loading2.json';
import diceLoading3 from 'assets/images/diceLoading/dice-loading3.json';
import diceLight from 'assets/images/diceLoading/dice-light.json';
import buttonBg from 'assets/base64/buttonBg';
import { RANDOM_STEP } from 'constants/copywriting';
import DiceResult from './DiceResult';
import { sleep } from 'utils/common';

export enum RecreationModalType {
  LOADING = 'loading',
  DICE = 'dice',
  TREASURE = 'treasure',
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
  curDiceCount?: number;
  type: RecreationModalType;
  onClose?: () => void;
}

function RecreationModal(props: IRecreationModal) {
  const { open, step, bean, type, onClose, diceNumbers, curDiceCount } = props;

  const { isMobile, configInfo } = useGetState();
  const [treasureStatus, setTreasureStatus] = useState<TreasureStatus>(TreasureStatus.OPENED);
  const [openable, setOpenable] = useState<boolean>(true);
  const [showDice, setShowDice] = useState<boolean>(false);

  const treasureAnimationRef = useRef<LottieRefCurrentProps | null>(null);

  const loadingAnis: Record<string, Record<string, any>> = {
    1: diceLoading1,
    2: diceLoading2,
    3: diceLoading3,
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
      setShowDice(false);
    }
  }, [open]);

  const modalContent: Record<RecreationModalType, ReactElement | null> = {
    [RecreationModalType.DICE]: (
      <div className={`relative w-full h-full flex flex-col items-center justify-center top-0`}>
        {showDice &&
          step &&
          (isMobile ? (
            <div className="absolute top-[-120px] flex flex-col items-center justify-center">
              <span className={`text-[#fff] left-0 right-0 m-auto text-center font-fonarto text-[64px]`}>{step}</span>
              <span className={`text-[#fff] left-0 right-0 m-auto text-center font-fonarto text-[40px]`}>
                {step === 1 ? 'Step Forward' : 'Steps Forward'}
              </span>
            </div>
          ) : (
            <span
              className={`absolute top-[-100px] text-[#fff] left-0 right-0 m-auto text-center font-fonarto text-[96px]`}>
              {step === 1 ? `${step} Step Forward` : `${step} Steps Forward`}
            </span>
          ))}
        <div className={`relative ${isMobile ? 'h-auto w-full mt-[-40px]' : 'h-[720px] max-h-[640Px] w-[auto]'}`}>
          <DiceResult curDiceCount={curDiceCount} diceNumbers={diceNumbers} showDice={showDice} />
          <Lottie
            loop={false}
            autoplay={true}
            animationData={diceLight}
            className="w-full h-full"
            onComplete={async () => {
              setShowDice(true);
              await sleep(1500);
              onClose && onClose();
            }}
          />
        </div>
      </div>
    ),
    [RecreationModalType.LOADING]: (
      <div className="relative w-full h-full flex flex-col items-center justify-center top-0">
        <Lottie
          loop={true}
          autoplay={true}
          animationData={loadingAnis[`${curDiceCount || 1}`]}
          className={`${isMobile ? 'h-auto w-full mt-[-40px]' : 'h-[720px] max-h-[640Px] w-[auto]'}`}
        />
        <span
          className={`text-[#fff] absolute left-0 right-0 m-auto text-center font-fonarto ${
            isMobile ? 'text-[16px] bottom-0' : 'text-[42px] bottom-0'
          }`}>
          {RANDOM_STEP}
        </span>
      </div>
    ),
    [RecreationModalType.TREASURE]: (
      <div className="relative z-[80] flex h-auto w-full flex-col items-center justify-center">
        <div className={`relative flex items-center justify-center mt-[100px]`}>
          {treasureStatus === TreasureStatus.OPENED ? (
            <div
              className={`absolute left-0 right-0 ${configInfo?.isHalloween ? 'z-[51]' : 'z-[40]'}  m-auto ${
                configInfo?.isHalloween
                  ? isMobile
                    ? 'h-[90px] top-[-90px]'
                    : 'h-[121px] top-[-121px]'
                  : isMobile
                  ? 'h-auto w-[67%] top-[-105%]'
                  : 'h-auto w-[377px] top-[-60%]'
              }`}>
              {!configInfo?.isHalloween && (
                <img src={lightTreasure} className="relative z-[20] h-full w-full" alt="lightTreasure" />
              )}

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
            animationData={configInfo?.isHalloween ? treasureBoxHalloween : dataAnimation}
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
      className={`${styles['recreation-modal']} ${isMobile && styles['recreation-modal-mobile']}`}>
      {open && modalContent[type]}
    </Modal>
  );
}

export default React.memo(RecreationModal);
