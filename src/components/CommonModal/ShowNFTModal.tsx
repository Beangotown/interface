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

export default function ShowNftModal({ type, onCancel, open, beanPassItem }: ShowNFTModalPropsType) {
  const { configInfo } = useGetState();

  const address = useAddress();

  const [curNftIndex, setCurNftIndex] = useState(0);

  const [beanPassList, setBeanPassList] = useState<Array<IBeanPassListItem>>([]);

  const handleJumpExplor = () => {
    if (!curNft?.owned) return;
    window.open(configInfo?.beanPassTerminalUrl || '', '_blank');
  };

  const curBeanPassId = useMemo(() => {
    const strs = configInfo?.beanPassTerminalUrl.split('-');
    return strs?.[strs?.length - 1];
  }, [configInfo]);

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
    setBeanPassList(beanPassList);
  }, [address]);

  useEffect(() => {
    if (beanPassList.length) {
      const curUseBeanPass = beanPassList.filter((i) => i.usingBeanPass);
      store.dispatch(setCurBeanPass(curUseBeanPass[0]));
    }
  }, [beanPassList]);

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
      initBeanPassList();
    } else {
      console.log('gotofores');
    }
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
            <div className={styles['left-icon']} onClick={handlePrev}>
              <img src={require('assets/images/icon-left.png').default.src} alt="" className={styles['icon']} />
            </div>

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

            <div className={styles['right-icon']} onClick={handleNext}>
              <img src={require('assets/images/icon-right.png').default.src} alt="" className={styles['icon']} />
            </div>
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
          <div className="md:text-[24px] text-base md:leading-[32px] leading-[24px] font-bold md:mt-[35px] mt-[24px] md:mb-[28px]">{`Congratulations! You've got a rare "Witchy Bean" BeanPass NFT.`}</div>
        </>
      )}
    </Modal>
  );
}
