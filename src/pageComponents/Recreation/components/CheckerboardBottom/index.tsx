import React from 'react';
import useGetState from 'redux/state/useGetState';
import Bus from 'assets/images/recreation/bus.svg';

function CheckerboardBottom() {
  const { configInfo, isMobile } = useGetState();

  return (
    <>
      {configInfo?.isHalloween ? (
        <div
          className={`absolute left-0 w-full flex ${
            isMobile ? 'h-[112px] bottom-[-46px] pl-[10px]' : 'h-[212px] bottom-[-76px] pl-[28px]'
          }`}>
          <img
            className={`${isMobile ? 'h-[94.5px] w-auto' : 'h-[185px] w-auto'}`}
            src={require('assets/images/recreation/grave.png').default.src}
            alt=""
          />
          <img
            className={`absolute bottom-0 right-[8px] ${isMobile ? 'h-[46px] w-auto' : 'h-[76px] w-auto'}`}
            src={require('assets/images/recreation/fence.png').default.src}
            alt=""
          />
        </div>
      ) : (
        <div className="ml-[-16px] mt-[-50px] w-full">
          <Bus className={`${isMobile ? 'h-[120px] w-[120px]' : 'h-[240px] w-[240px]'}`} />
        </div>
      )}
    </>
  );
}

export default React.memo(CheckerboardBottom);
