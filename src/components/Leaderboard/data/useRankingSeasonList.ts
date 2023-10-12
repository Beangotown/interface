import useSWR from 'swr';
import { getSeasonList } from 'api/request';

export const useRankingSeasonList = () => {
  return useSWR('getRankingSeasonList', async () => {
    const rankingSeasonList = await getSeasonList();

    return rankingSeasonList;
  });
};
