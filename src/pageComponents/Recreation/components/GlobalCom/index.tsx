import Leaderboard from 'components/Leaderboard';

import PageLoading from 'components/PageLoading';
import GameRecord from 'components/GameRecord';
import NoticeModal from 'components/NoticeModal';

export default function GlobalCom() {
  return (
    <>
      <Leaderboard />
      <GameRecord />
      <PageLoading />
      <NoticeModal />
    </>
  );
}
