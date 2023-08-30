import { Disclosure } from '@headlessui/react';
import { IGameItem, ITransactionInfo } from '../data/useGameHistory';
import { copyText } from 'utils/copyText';
import { middleEllipsis } from 'utils/middleEllipsis';
import { useIsMobile } from 'redux/selector/mobile';
import { getDateFormat } from 'utils/getDateFormat';
import { formatElfValue } from 'utils/formatElfValue';
import { useSelector, AppState } from 'redux/store';

const explorerSelector = (state: AppState) => state.configInfo.configInfo?.explorerBaseUrl;

const GameRecordItemChild = ({ data, title }: { data: ITransactionInfo | null; title: string }) => {
  const isMobile = useIsMobile();
  const explorerBaseUrl = useSelector(explorerSelector);

  if (!data) return null;

  return (
    <div className={`mb-2 w-full rounded-2xl bg-[#144CEA] p-4 text-white ${isMobile ? 'text-xs' : ''}`}>
      <table className="w-full">
        <thead>
          <tr>
            <th className="pb-4">{title}</th>
            <th className="pb-4 text-right">
              <a
                href={`${explorerBaseUrl}${data.transactionId}`}
                className="text-white underline"
                target="_blank"
                rel="noopener noreferrer">
                View on Explore
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-white text-opacity-60">Date</td>
            <td className="text-right">{getDateFormat(data.triggerTime, 'MMM dd HH:mm:ss')}</td>
          </tr>
          <tr>
            <td className="text-white text-opacity-60">Status</td>
            <td className="text-right">Confirmed</td>
          </tr>
          <tr>
            <td className="text-white text-opacity-60">Transaction Fee</td>
            <td className="text-right">{formatElfValue(data.transactionFee)} ELF</td>
          </tr>
          <tr>
            <td className="text-white text-opacity-60">Transaction ID</td>
            <td className="text-right">
              {middleEllipsis(data.transactionId)}{' '}
              <button onClick={() => copyText(data.transactionId)}>
                <img src={require('assets/images/copy.png').default.src} alt="copy" className="h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Wrapper = (props: React.HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    className="mb-2 w-full rounded-2xl bg-[#5197FF] p-4 shadow-[0px_1px_2px_0px_#64A2FF_inset,0px_-1px_2px_0px_#3A80E8_inset]"
  />
);

export const GameRecordItem = ({ data }: { data: IGameItem }) => {
  const isMobile = useIsMobile();
  const { gridNum, score, transcationFee, playTransactionInfo, bingoTransactionInfo } = data;

  return (
    <Disclosure as={Wrapper}>
      {({ open }) => (
        <div className="text-left">
          <div className="flex justify-between pb-4">
            <div
              className={`text-lg font-bold leading-normal text-white ${isMobile ? 'text-[1rem]' : 'text-[2.5rem]'}`}>
              {getDateFormat(playTransactionInfo.triggerTime, 'dd MMM')}
            </div>
            <div className="text-md text-right text-white text-opacity-60">
              {getDateFormat(playTransactionInfo.triggerTime, 'HH:mm:ss')}
            </div>
          </div>
          <table className="mb-4 w-full">
            <thead>
              <tr className={`text-white text-opacity-60 ${isMobile ? 'text-[.7rem]' : 'text-md'}`}>
                <th>Random step result</th>
                <th>Earn points</th>
                <th className="text-right">Transaction Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold text-white">
                <td>{gridNum}</td>
                <td>{score}</td>
                <td className="text-right">{formatElfValue(transcationFee)} ELF</td>
              </tr>
            </tbody>
          </table>
          {!open ? (
            <Disclosure.Button className="py-2 font-bold text-[#003658]">More &#x25BC;</Disclosure.Button>
          ) : null}
          <Disclosure.Panel>
            <GameRecordItemChild data={playTransactionInfo} title="Play" />
            {bingoTransactionInfo ? <GameRecordItemChild data={bingoTransactionInfo} title="Bingo" /> : null}
            {open ? <Disclosure.Button className="py-2 text-[#003658]">Pack up &#x25B2;</Disclosure.Button> : null}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
