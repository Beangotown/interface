import { useEffect, useMemo, useState } from 'react';
import { useRankingSeasonList } from '../data/useRankingSeasonList';
import { useRankingHistory } from '../data/useRankingHistory';
import { useIsMobile } from 'redux/selector/mobile';
import { getDateFormat } from 'utils/getDateFormat';
import { IRankingHistoryResult } from '../data/types';

const DiagonalContainer = ({ icon, leftText, value }: { icon: React.ReactNode; leftText: string; value?: number }) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 flex rounded-[7px] border-[#00335C] bg-[#0538C9] shadow-[0px_0px_4px_rgba(0,0,0,0.25)_inset]">
      <div className="flex items-center rounded-bl-[7px] rounded-tl-[7px] bg-white bg-opacity-10 w-1/2">
        {icon}
        <span className={`mr-4 font-roboto font-bold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>{leftText}</span>
      </div>
      <span className="w-8 diagonal-bg-[#0538C9]"></span>
      <div className="ml-2 flex items-center justify-center text-xl font-bold text-[#FFD200]">
        <div>{value === -1 ? '-' : value?.toLocaleString() ?? '-'}</div>
      </div>
    </div>
  );
};

const formatDate = (dateStr: string) => getDateFormat(dateStr, 'yyyy.M.d');

export const PastRecordContent = () => {
  const { data } = useRankingSeasonList();
  const [selectedSeason, setSelectedSeason] = useState('');
  const { data: his } = useRankingHistory(selectedSeason);
  const isMobile = useIsMobile();

  useEffect(() => {
    const selected = data?.season?.[0];
    if (selected) setSelectedSeason(selected.id);
  }, [data]);

  const dateString = useMemo(() => {
    const selected = data?.season.find((i) => i.id === selectedSeason);

    if (selected) return `${formatDate(selected.rankBeginTime)} - ${formatDate(selected.rankEndTime)}`;

    return '-';
  }, [selectedSeason, data]);

  return (
    <div className="mb-2 flex w-full flex-grow flex-col rounded-2xl bg-blue-400 p-2 shadow-inner">
      <div className="mb-[1px] flex w-full flex-row items-center justify-between rounded-tl-2xl rounded-tr-2xl bg-[#0C40D4] p-2 shadow-inner">
        <select
          className={`bg-[#0C40D4] text-white ${isMobile ? 'p-2.5 text-lg' : 'p-2 text-3xl'}`}
          onChange={(e) => setSelectedSeason(e.target.value)}>
          {data?.season.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        <div className={`font-normal leading-none text-white text-opacity-60 ${isMobile ? 'text-md' : 'text-xl'}`}>
          {dateString}
        </div>
      </div>
      <div className="text-md h-1 w-full flex-grow overflow-auto rounded-bl-2xl rounded-br-2xl bg-[#144CEA] p-4 shadow-inner">
        {isMobile ? (
          <>
            <div className="mb-8 flex">
              <PastRecordIcon />
              <div className="flex-1">
                <DiagonalContainers his={his} />
              </div>
            </div>
            <Table his={his} />
          </>
        ) : (
          <>
            <div className="flex gap-8 p-4">
              <div className="flex-1">
                <PastRecordIcon />
                <div>
                  <DiagonalContainers his={his} />
                </div>
              </div>
              <div className="flex-1">
                <Table his={his} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface IData {
  his?: IRankingHistoryResult;
}

const Table = ({ his }: IData) => {
  const isMobile = useIsMobile();

  return (
    <table className={`${isMobile ? '' : 'text-lg'} w-full text-white`}>
      <thead className="bg-white bg-opacity-20 text-white text-opacity-70">
        <tr>
          <th className="w-1/2 p-4 text-left">Time</th>
          <th className="py-4 text-left">Points</th>
          <th className="p-4 text-right">Ranking</th>
        </tr>
      </thead>
      <tbody>
        {his?.weeks.map((i, idx) => (
          <tr key={idx} className="border-b border-white border-opacity-40">
            <td className="p-4">{i.week}</td>
            <td className="py-4">{i.score || <div className="text-white text-opacity-60">Not in</div>}</td>
            <td className="p-4 text-right">{i.rank === -1 ? '-' : i.rank}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PastRecordIcon = () => {
  const isMobile = useIsMobile();

  return (
    <img
      src={require('assets/images/past-record-icon.png').default.src}
      className={`${isMobile ? 'mr-2 h-auto w-1/3' : 'mx-auto h-1/3 px-4 pb-8'}`}
      alt="Past Record"
    />
  );
};

const DiagonalContainers = ({ his }: IData) => {
  const isMobile = useIsMobile();

  const className = `p-2 ${isMobile ? 'w-8' : 'w-12'}`;

  return (
    <>
      <DiagonalContainer
        icon={<img src={require('assets/images/crown.png').default.src} alt="crown" className={className} />}
        leftText="Ranking"
        value={his?.season.rank}
      />
      <DiagonalContainer
        icon={<img src={require('assets/images/bean.png').default.src} alt="crown" className={className} />}
        leftText="Points"
        value={his?.season.score}
      />
    </>
  );
};
