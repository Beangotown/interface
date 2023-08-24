import { useIsMobile } from 'redux/selector/mobile';
import { useConditionalRank } from '../hooks/useConditionalRank';
import { Bean } from './Bean';
import { LeaderBoardItemAddress } from './LeaderBoardItemAddress';
import { LeaderBoardItemScore } from './LeaderBoardItemScore';
import { LeaderboardTextColors } from './LeaderBoardItemText';
import { Rank } from './Rank';

interface ITabContentUser {
  showMeIcon?: boolean;
  rank?: number;
  address?: string;
  score?: number;
}
export const TabContentUser = ({ showMeIcon, rank, address, score }: ITabContentUser) => {
  const isMobile = useIsMobile();
  const color: LeaderboardTextColors = LeaderboardTextColors.White;

  const wrapperClassName = useConditionalRank({
    rank,
    first: 'bg-[#F5BF49]',
    second: 'bg-[#CEDFF7]',
    third: 'bg-[#E47B3D]',
    ranked: 'bg-gradient-to-b from-[#FFD304] to-[#FFF4C1]',
    unranked: 'bg-blue-700',
    missing: 'bg-[#D7D7D7]',
  });

  return (
    <div
      className={`${wrapperClassName} ${
        isMobile ? 'h-16 p-2' : 'h-24 pb-4 pl-3 pr-4 pt-4'
      } flex items-center rounded-bl-2xl rounded-br-2xl`}>
      <img
        className={`${isMobile ? 'w-8' : 'w-16'}`}
        src={require('assets/images/me-avatar.png').default.src}
        alt="avatar"
      />
      <Rank rank={rank} />
      <LeaderBoardItemAddress address={address} color={color} />
      {showMeIcon ? <img className="ml-2 w-16" src={require('assets/images/me.png').default.src} alt="me" /> : null}
      <div className="flex-grow mr-2"></div>
      <LeaderBoardItemScore score={score} color={color} />
      <Bean />
    </div>
  );
};