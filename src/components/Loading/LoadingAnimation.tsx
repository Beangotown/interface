import { useLottie } from 'lottie-react';
import LoadingAnimation from 'assets/images/loading-animation.json';
import Image from 'next/image';
import useGetState from 'redux/state/useGetState';
import { TelegramPlatform } from '@portkey/did-ui-react';

export default function LoadingAni() {
  const { isMobile } = useGetState();

  const Animation = () => {
    const options = {
      animationData: LoadingAnimation,
      loop: true,
      autoplay: true,
    };

    const { View } = useLottie(options, { margin: '0 auto', width: isMobile ? '100%' : '30%' });

    return View;
  };

  return (
    <div
      className={`h-full w-full overflow-hidden bg-[#2D20E1] ${
        TelegramPlatform.isTelegramPlatform() ? 'pt-[100px]' : 'pt-[199px]'
      }`}>
      <Image src={require('assets/images/loading-title.png')} alt="" className="mx-auto h-[129px] w-[270px]"></Image>
      <Image src={require('assets/images/game-coming.png')} alt="" className="mx-auto mt-[75px] w-[257px]"></Image>
      <Animation></Animation>
    </div>
  );
}
