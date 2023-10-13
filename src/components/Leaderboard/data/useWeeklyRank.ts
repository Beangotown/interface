import useSWR from 'swr';
import { MAX_LEADERBOARD_ITEMS } from 'constants/platform';
import { getWeekRank } from 'api/request';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useAddressWithPrefixSuffix } from 'hooks/useAddressWithPrefixSuffix';

export const useWeeklyRank = () => {
  const address = useAddressWithPrefixSuffix();

  return useSWR(
    ['getWeekRank', address],
    async () => {
      if (!address) return;
      const weekRank = await getWeekRank({
        CaAddress: `${address}`,
        SkipCount: 0,
        MaxResultCount: `${MAX_LEADERBOARD_ITEMS}`,
      });

      if (weekRank) {
        const { rankingList } = weekRank;

        return {
          ...weekRank,
          rankingList: rankingList?.map((i) => ({ ...i, caAddress: addPrefixSuffix(i.caAddress) })) ?? [],
          selfRank: {
            ...weekRank.selfRank,
            caAddress: addPrefixSuffix(weekRank.selfRank.caAddress),
          },
        };
      } else return undefined;
    },
    {
      dedupingInterval: 0,
    },
  );
};
