import { graphQLRequest } from 'api/graphql';
import { MAX_GAME_RECORD_ITEMS } from 'constants/platform';
import { useAddressWithPrefixSuffix } from 'hooks/useAddressWithPrefixSuffix';
import useSWR from 'swr';

export interface ITransactionInfo {
  transactionId: string;
  transactionFee: number;
  triggerTime: string;
}

export interface IGameItem {
  id: string;
  gridNum: number;
  score: number;
  transcationFee: number;
  playTransactionInfo: ITransactionInfo;
  bingoTransactionInfo: ITransactionInfo | null;
}

interface IGameHistoryResult {
  gameList: IGameItem[];
}

export const useGameHistory = () => {
  const address = useAddressWithPrefixSuffix();
  return useSWR<IGameHistoryResult | undefined>([address, 'getGameHis'], async () => {
    const { getGameHistory } =
      (await graphQLRequest<{
        getGameHistory: IGameHistoryResult;
      }>(`
    query {
      getGameHistory(
        getGameHisDto: {
          caAddress: "${address}"
          skipCount: 0
          maxResultCount: ${MAX_GAME_RECORD_ITEMS}
        }
      ) {
        gameList {
          id
          gridNum
          score
          transcationFee
          playTransactionInfo {
            transactionId
            transactionFee
            triggerTime
          }
          bingoTransactionInfo {
            transactionId
            transactionFee
            triggerTime
          }
        }
      }
    }
  `)) || {};

    return getGameHistory;
  });
};
