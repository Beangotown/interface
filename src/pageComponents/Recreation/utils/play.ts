import { GetBingoReward, Play } from 'contract/bingo';
import { IBoutInformation, IPlayerProps } from 'types';
import { SentryMessageType, captureMessage } from 'utils/captureMessage';
import { deserializeLog } from 'utils/deserializeLog';
import { Proto } from 'utils/proto';

const play = async (params: IPlayerProps) => {
  const proto = Proto.getInstance().getProto();
  if (proto) {
    const { TxResult } = await Play(params);
    const log = TxResult?.Logs?.filter((item) => {
      return item.Name === 'Bingoed';
    })?.[0];
    if (log) {
      const res = await deserializeLog(log, proto);
      const logResult: IBoutInformation = {
        score: res.score,
        playId: res.playId,
        gridNum: res.gridNum,
        diceCount: res.diceCount,
        diceNumbers: res.diceNumbers.value,
        startGridNum: res.startGridNum ?? 0,
        endGridNum: res.endGridNum ?? 0,
      };
      return logResult;
    } else {
      captureMessage({
        type: SentryMessageType.HTTP,
        params: {
          name: 'playDeserializeLog',
          method: 'get',
          query: params,
          description: {
            TxResult,
            errorMsg: 'no log events',
          },
        },
      });
      const bingoRes = await GetBingoReward(params);
      return bingoRes;
    }
  } else {
    const bingoRes = await GetBingoReward(params);
    return bingoRes;
  }
};

export default play;
