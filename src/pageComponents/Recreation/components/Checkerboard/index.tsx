import { ArrowDirection, ICheckerboardItem } from 'pageComponents/Recreation/checkerboard';
import React, { useMemo } from 'react';
import Lattice from '../Lattice';
import useGetState from 'redux/state/useGetState';

function Checkerboard(props: { value: ICheckerboardItem }) {
  const { value } = props;
  const { configInfo, isMobile } = useGetState();

  const bgColor = useMemo(() => (configInfo?.isHalloween ? 'bg-[#301641]' : 'bg-[#656C8A]'), [configInfo?.isHalloween]);

  const Side = {
    [ArrowDirection.TOP]: (
      <div
        className={`absolute left-0 right-0 top-[-10px] z-0 m-auto h-[12px] ${
          isMobile ? 'w-[16px]' : 'w-[32px]'
        } ${bgColor}`}
      />
    ),
    [ArrowDirection.BOTTOM]: (
      <div
        className={`absolute bottom-[-2px] left-0 right-0 z-0 m-auto h-[12px] ${
          isMobile ? 'w-[16px]' : 'w-[32px]'
        } ${bgColor}`}
      />
    ),
    [ArrowDirection.LEFT]: (
      <div
        className={`absolute bottom-0 left-[-16px] top-0 z-0 m-auto w-[20px] ${
          isMobile ? 'h-[16px]' : 'h-[32px]'
        } ${bgColor}`}
      />
    ),
    [ArrowDirection.RIGHT]: (
      <div
        className={`absolute bottom-0 right-0 top-0 z-0 m-auto w-[20px] ${
          isMobile ? 'h-[16px]' : 'h-[32px]'
        } ${bgColor}`}
      />
    ),
  };

  return (
    <div className={`relative h-full w-full pb-[8px] pr-[12px]`}>
      <Lattice value={value} />
      {value.image && value.arrow && Side[value.arrow]}
    </div>
  );
}

export default React.memo(Checkerboard);
