import useSWR from 'swr';
import { useAddressWithPrefixSuffix } from 'hooks/useAddressWithPrefixSuffix';
import { getRankHistory } from 'api/request';

export const useRankingHistory = (seasonId: string) => {
  const address = useAddressWithPrefixSuffix();
  return useSWR(seasonId && address ? 'getRankingSeasonHis' : null, async () => {
    const rankingHistory = await getRankHistory({
      SeasonId: `${seasonId}`,
      CaAddress: `${address}`,
    });

    return rankingHistory;
  });
};
