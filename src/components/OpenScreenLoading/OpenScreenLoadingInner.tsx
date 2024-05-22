'use client';
import { useLottie } from 'lottie-react';
import useGetState from 'redux/state/useGetState';

const options = {
  animationData: require('./open-screen-loading.json'),
  loop: true,
  autoplay: true,
};

const OpenScreenLoadingInner = ({ loading }: { loading?: boolean }) => {
  const { isMobile } = useGetState();

  const { View } = useLottie(options, { margin: '0 auto', width: isMobile ? '100%' : '30%' });

  return (
    <>
      <div
        className={`h-full w-full overflow-hidden absolute top-0 left-0 justify-center items-center -z-10 ${
          loading ? 'flex' : 'hidden'
        }`}>
        {View}
      </div>
    </>
  );
};

export default OpenScreenLoadingInner;
