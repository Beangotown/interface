import Modal from './index';
import { ShowBeanPassType, ShowNFTModalPropsType } from './type';
import Image from 'next/image';
import styles from './style.module.css';
import useGetState from 'redux/state/useGetState';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CommonBtn from 'components/CommonBtn';
import { Carousel } from 'antd';
import { fetchBeanPassList, setCurUsingBeanPass } from 'api/request';
import { useAddress } from 'hooks/useAddress';
import { IBeanPassListItem } from 'types';
import { store } from 'redux/store';
import { setCurBeanPass } from 'redux/reducer/info';
import { qualityBlue } from 'constants/nft';
import showMessage from 'utils/setGlobalComponentsInfo';

export default function ShowNftModal({ type, onCancel, open, beanPassItem }: ShowNFTModalPropsType) {
  const { configInfo, curBeanPass } = useGetState();

  const address = useAddress();

  const [curNftIndex, setCurNftIndex] = useState(0);

  const [beanPassList, setBeanPassList] = useState<Array<IBeanPassListItem>>([]);

  const [showLeftToggle, setShowLeftToggle] = useState(false);

  const [showRightToggle, setShowRightToggle] = useState(false);

  const handleJumpExplor = () => {
    if (!curNft?.owned) return;
    window.open(`${configInfo!.explorerBeanPassUrl}${curNft.symbol}`, '_blank');
  };

  const onChange = (number: number) => {
    setCurNftIndex(number);
  };

  const curNft = useMemo(() => {
    if (!beanPassList.length) return null;
    return beanPassList[curNftIndex];
  }, [beanPassList, curNftIndex]);

  const carousel = useRef(null);

  const handlePrev = () => {
    carousel.current && (carousel.current as any).prev();
  };

  const handleNext = () => {
    carousel.current && (carousel.current as any).next();
  };

  const initBeanPassList = useCallback(async () => {
    const beanPassList = await fetchBeanPassList({ caAddress: address });
    const ownedArr = beanPassList.filter((i) => i.owned);
    if (open) {
      if (!ownedArr.length) {
        showMessage.error(`You don't have any BeanPass NFTs in your account.`);
      } else {
        if (curBeanPass) {
          const curBeanPassFilter = beanPassList.filter((i) => i.symbol === curBeanPass.symbol);
          if (curBeanPassFilter.length && !curBeanPassFilter[0].owned) {
            showMessage.error('This BeanPass NFT is currently not in your account.');
          }
        }
      }
    }
    setBeanPassList(beanPassList);
  }, [address, curBeanPass, open]);

  useEffect(() => {
    if (beanPassList.length) {
      const curUseBeanPass = beanPassList.filter((i) => i.usingBeanPass);
      curUseBeanPass?.[0] && store.dispatch(setCurBeanPass(curUseBeanPass[0]));
    }
  }, [beanPassList]);

  useEffect(() => {
    if (beanPassList.length > 1) {
      if (curNftIndex === 0) {
        setShowLeftToggle(false);
        setShowRightToggle(true);
      } else if (curNftIndex === beanPassList.length - 1) {
        setShowLeftToggle(true);
        setShowRightToggle(false);
      } else {
        setShowLeftToggle(true);
        setShowRightToggle(true);
      }
    }
  }, [beanPassList, curNftIndex]);

  useEffect(() => {
    open && initBeanPassList();
  }, [initBeanPassList, open]);

  useEffect(() => {
    if (type === ShowBeanPassType.Display) {
      address && initBeanPassList();
    }
  }, [address, initBeanPassList, type]);

  const handleUse = async () => {
    if (curNft?.owned) {
      const res = await setCurUsingBeanPass({
        caAddress: address,
        symbol: curNft.symbol,
      });
      console.log(res);
      if (res && !res.owned) {
        showMessage.error('This BeanPass NFT is currently not in your account.');
      }
      initBeanPassList();
    } else {
      window.open(
        `${configInfo!.forestNftDetailUrl}${configInfo!.curChain}-${curNft?.symbol}/${configInfo?.curChain}`,
        '_blank',
      );
    }
  };

  const getCongratulationsMsg = () => {
    if (beanPassItem?.symbol && qualityBlue.includes(beanPassItem?.symbol)) {
      return `Congratulations! You've got a rare "${beanPassItem?.tokenName}" BeanPass NFT.`;
    }
    return `Congratulations! You now have a "${beanPassItem?.tokenName}" BeanPass NFT.`;
  };

  return (
    <Modal
      destroyOnClose
      className={styles.showBeanPassModal}
      open={open}
      title={type !== ShowBeanPassType.Display ? 'BeanPass NFT' : 'Congratulations'}
      onCancel={onCancel}>
      {type === ShowBeanPassType.Display ? (
        <>
          <div className={styles.nft__pic}>
            {showLeftToggle && (
              <div
                className={`${styles['left-icon']} ${!showRightToggle ? 'absolute left-0' : ''}`}
                onClick={handlePrev}>
                <img src={require('assets/images/icon-left.png').default.src} alt="" className={styles['icon']} />
              </div>
            )}

            <div className="mx-auto h-[160px] w-[160px] md:mt-0 md:h-[240px]  md:w-[240px] relative">
              <Carousel afterChange={onChange} dots={false} ref={carousel}>
                {beanPassList.map((item, index) => {
                  return (
                    <div className="relative" key={index}>
                      <img
                        src={item.nftImageUrl || ''}
                        alt=""
                        className="h-[160px] w-[160px] md:h-[240px]  md:w-[240px]"
                      />
                      {!item.owned && (
                        <div className="h-[160px] w-[160px] md:h-[240px]  md:w-[240px] flex justify-center items-center absolute top-0 left-0 bg-[#3989FF] opacity-70">
                          <img
                            src={require('assets/images/icon-lock.png').default.src}
                            alt=""
                            className="md:w-16 md:h-16 w-[42.667px] h-[42.667px]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Carousel>
            </div>

            {showRightToggle && (
              <div
                className={`${styles['right-icon']} ${!showLeftToggle ? 'absolute right-0' : ''}`}
                onClick={handleNext}>
                <img src={require('assets/images/icon-right.png').default.src} alt="" className={styles['icon']} />
              </div>
            )}
          </div>
          <div className={styles.nft__label} onClick={handleJumpExplor}>
            <span className={`${styles.nft__text} ${!curNft?.owned ? 'opacity-60' : ''}`}>
              {curNft?.owned ? curNft?.tokenName : 'Not Owned'}
            </span>
            {curNft?.owned && (
              <Image src={require('assets/images/link-icon.png')} alt="" className="ml-1 h-6 w-6"></Image>
            )}
          </div>
          {curNft?.usingBeanPass ? (
            <div className={styles['text__inuse']}>In Use Now</div>
          ) : (
            <CommonBtn
              onClick={handleUse}
              title={!curNft?.owned ? 'Get the BeanPass' : !curNft.usingBeanPass ? 'Use' : ''}
              className="w-[262px] h-12 md:mt-7 mt-6 mx-auto"></CommonBtn>
          )}
        </>
      ) : (
        <>
          <div className="mx-auto h-[160px] w-[160px] md:mt-0 md:h-[240px]  md:w-[240px] relative">
            <img src={beanPassItem?.nftImageUrl || ''} alt="" className="w-full h-full" />
          </div>
          <div className="md:text-[24px] text-base md:leading-[32px] leading-[24px] font-bold md:mt-[35px] mt-[24px] md:mb-[28px]">
            {getCongratulationsMsg()}
          </div>
        </>
      )}
    </Modal>
  );
}
