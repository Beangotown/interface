import React from 'react';
import Menu from '../Menu';
import Ranking from 'assets/images/recreation/ranking.svg';
import Nft from 'assets/images/recreation/nft.svg';
import GoButton, { IGoButton, Status } from '../GoButton';
import useGetState from 'redux/state/useGetState';
import beanImage from 'assets/images/recreation/bean.png';

import styles from './index.module.css';
import Image from 'next/image';
import { dispatch } from 'redux/store';
import { toggleShowLeaderboard } from 'redux/reducer/info';
import useInitLeaderBoard from 'components/Leaderboard/hooks/useInitLeaderBoard';
import showMessage from 'utils/setGlobalComponentsInfo';
import { SentryMessageType, captureMessage } from 'utils/captureMessage';

interface IBoard extends IGoButton {
  onNftClick?: () => void;
}

function Board({
  hasNft,
  go,
  status = Status.NONE,
  playableCount = 0,
  sumScore = 5,
  onNftClick,
  curDiceCount,
  changeCurDiceCount,
}: IBoard) {
  const { isMobile, playerInfo } = useGetState();

  const { initialize } = useInitLeaderBoard();

  const handleShowLeaderboard = async () => {
    showMessage.loading();
    try {
      await initialize();
    } catch (err) {
      captureMessage({
        type: SentryMessageType.ERROR,
        params: {
          name: 'useInitLeaderBoard',
          method: 'get',
          description: err,
        },
      });
    } finally {
      showMessage.hideLoading();
      dispatch(toggleShowLeaderboard());
    }
  };

  if (isMobile) {
    return (
      <div className="absolute right-0 top-[15px] z-[40]">
        <Menu
          icon={<Ranking className="h-[auto] w-[44px]" />}
          className="mb-[12px]"
          title="Leader Board"
          onClick={handleShowLeaderboard}
        />
        <Menu
          icon={<Nft className="h-[auto] w-[29.5px]" />}
          title={hasNft ? 'BeanPass NFT' : 'BeanPass Giveaway'}
          onClick={() => onNftClick && onNftClick()}
        />
      </div>
    );
  } else {
    return (
      <div className="flex h-full w-full flex-col px-[47px] pt-[56px]">
        <div className="relative z-40 flex-1">
          <div className={styles['board__bean']}>
            <Image src={beanImage} alt="bean" className="h-[64px] w-[64px]" />
            <span className={styles['board__bean__number']}>{playerInfo?.sumScore || 0}</span>
          </div>
          <Menu
            icon={<Ranking className="h-[auto] w-[76px]" />}
            className="mb-[24px]"
            title="Leader Board"
            onClick={handleShowLeaderboard}
          />
          <Menu
            icon={<Nft className="h-[auto] w-[59px]" />}
            title={hasNft ? 'BeanPass NFT' : 'BeanPass Giveaway'}
            onClick={() => onNftClick && onNftClick()}
          />
        </div>
        <GoButton
          playableCount={playableCount}
          sumScore={sumScore}
          status={status}
          curDiceCount={curDiceCount}
          changeCurDiceCount={changeCurDiceCount}
          go={() => go && go()}
        />
      </div>
    );
  }
}

export default React.memo(Board);
