import React, { ReactElement, useEffect, useState } from 'react';
import { ANIMATION_DURATION } from 'constants/animation';

import beanImage from 'assets/images/recreation/bean.png';

import styles from './index.module.css';
import Image from 'next/image';
import { useDeepCompareEffect } from 'react-use';
import useGetState from 'redux/state/useGetState';

interface IRole {
  id?: string;
  width: string | number;
  bean?: number;
  translate: {
    x: number;
    y: number;
  };
  animationDuration?: number;
  showAdd?: boolean;
  position?: {
    x?: number;
    y?: number;
  };
  hideAdd?: () => void;
  children?: React.ReactNode;
}

enum PlacementType {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
}

function Role(props: IRole) {
  const {
    id = 'animationId',
    width,
    bean,
    translate,
    animationDuration = ANIMATION_DURATION,
    showAdd,
    hideAdd,
    children,
    position,
  } = props;

  const [popoverPlacement, setPopoverPlacement] = useState<PlacementType>(PlacementType.TOP);
  const { isMobile } = useGetState();

  const PopoverComponent = (
    <div className={`flex h-full items-center pb-[8px] ${styles['role__info']}`}>
      <Image className={`${isMobile ? 'h-[32px] w-[32px]' : 'h-[64px] w-[64px]'}`} src={beanImage} alt="bean" />
      <span className={`ml-[4px] leading-[24px] text-[#FFFFFF] ${isMobile ? 'text-[20px]' : 'text-[40px]'}`}>
        +{bean}
      </span>
    </div>
  );

  const Popover: Record<PlacementType, ReactElement> = {
    [PlacementType.TOP]: (
      <div
        className={`relative flex h-full w-full justify-center bg-[url(/images/recreation/add-bean.svg)] bg-[100%_100%] bg-no-repeat ${styles['appears-animation']}`}>
        {PopoverComponent}
      </div>
    ),
    [PlacementType.RIGHT]: (
      <div
        className={`relative left-[90%] top-[100%] aspect-[89/44] w-full bg-[url(/images/recreation/add-bean-right.svg)] bg-[100%_100%] bg-no-repeat pl-[22px] pt-[4px] ${styles['appears-animation-right']}`}>
        {PopoverComponent}
      </div>
    ),
  };

  useEffect(() => {
    if (showAdd) {
      const timer = setTimeout(() => {
        hideAdd && hideAdd();
        clearTimeout(timer);
      }, 1300);
    }
  }, [showAdd]);

  useDeepCompareEffect(() => {
    if (position) {
      switch (position.x) {
        case 0:
          setPopoverPlacement(PlacementType.RIGHT);
          return;
        default:
          setPopoverPlacement(PlacementType.TOP);
          return;
      }
    }
  }, [position]);

  return (
    <div
      id={id}
      className={`absolute bottom-0 right-0 z-50 flex items-center justify-center pb-[8px] pr-[12px]`}
      style={{
        width: width,
        transition: `transform ${animationDuration}ms linear`,
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}>
      <div className="aspect-[56/60] w-full">
        <div className={styles.role}>
          <div className="mb-[4px] aspect-[86/50] h-auto w-[150%]">{showAdd && bean && Popover[popoverPlacement]}</div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Role);
