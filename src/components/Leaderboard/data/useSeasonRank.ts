import useSWR from 'swr';
import { MAX_LEADERBOARD_ITEMS } from 'constants/platform';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useAddressWithPrefixSuffix } from 'hooks/useAddressWithPrefixSuffix';
import { getSeasonRank } from 'api/request';

export const useSeasonRank = () => {
  const address = useAddressWithPrefixSuffix();
  return useSWR(
    ['getSeasonRank', address],
    async () => {
      if (!address) return;
      const seasonRank = await getSeasonRank({
        CaAddress: `${address}`,
        SkipCount: 0,
        MaxResultCount: `${MAX_LEADERBOARD_ITEMS}`,
      });

      if (seasonRank) {
        const { rankingList } = seasonRank;

        return {
          ...seasonRank,
          rankingList: rankingList?.map((i) => ({ ...i, caAddress: addPrefixSuffix(i.caAddress) })) ?? [],
          selfRank: {
            ...seasonRank.selfRank,
            caAddress: addPrefixSuffix(seasonRank.selfRank.caAddress),
          },
        };
      } else return undefined;
    },
    {
      dedupingInterval: 0,
    },
  );
};
