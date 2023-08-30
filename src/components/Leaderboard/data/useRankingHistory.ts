import { graphQLRequest } from 'api/graphql';
import useSWR from 'swr';
import { IRankingHistoryResult } from './types';
import { useAddressWithPrefixSuffix } from 'hooks/useAddressWithPrefixSuffix';

export const useRankingHistory = (seasonId: string) => {
  const address = useAddressWithPrefixSuffix();
  return useSWR<IRankingHistoryResult | undefined>([seasonId, address, 'getRankingSeasonHis'], async () => {
    const { getRankingHistory } =
      (await graphQLRequest<{
        getRankingHistory: IRankingHistoryResult;
      }>(`
    query {
      getRankingHistory(getRankingHisDto: {
        seasonId: "${seasonId}"
        caAddress: "${address}"
      }) {
      season {
        rank
        score
        caAddress
      }
      weeks {
        week
        rank
        score
        caAddress
      }
    }
  }
  `)) || {};

    return getRankingHistory;
  });
};
