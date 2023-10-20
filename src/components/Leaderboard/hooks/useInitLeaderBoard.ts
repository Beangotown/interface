import { getWeekRank } from 'api/request';
import { MAX_LEADERBOARD_ITEMS } from 'constants/platform';
import { useAddressWithPrefixSuffix } from 'hooks/useAddressWithPrefixSuffix';
import { useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { addPrefixSuffix } from 'utils/addressFormatting';

export default function useInitLeaderBoard() {
  const { mutate } = useSWRConfig();
  const address = useAddressWithPrefixSuffix();

  const initialize = useCallback(async () => {
    if (!address) return;
    let data;
    const weekRank = await getWeekRank({
      CaAddress: `${address}`,
      SkipCount: 0,
      MaxResultCount: `${MAX_LEADERBOARD_ITEMS}`,
    });

    if (weekRank) {
      const { rankingList } = weekRank;

      data = {
        ...weekRank,
        rankingList: rankingList?.map((i) => ({ ...i, caAddress: addPrefixSuffix(i?.caAddress) })) ?? [],
        selfRank: {
          ...weekRank.selfRank,
          caAddress: addPrefixSuffix(weekRank.selfRank?.caAddress),
        },
      };
    } else {
      data = undefined;
    }
    mutate(['getWeekRank', address], data);
  }, [address, mutate]);

  return {
    initialize,
  };
}
