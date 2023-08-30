export interface IRankItem {
  rank: number;
  score: number;
  caAddress: string;
}

interface IRankResult {
  rankingList: IRankItem[];
  selfRank: IRankItem;
}

interface IWeekItem extends IRankItem {
  week: string;
}

export interface IRankingHistoryResult {
  season: IRankItem;
  weeks: IWeekItem[];
}

interface IRankingSeasonItem {
  id: string;
  name: string;
  rankBeginTime: string;
  rankEndTime: string;
  showBeginTime: string;
  showEndTime: string;
}

export interface IRankingSeasonListResult {
  season: IRankingSeasonItem[];
}

export enum ChallengeStatus {
  InProgress = 0,
  Settlement = 1,
  LastSettlement = 2,
}

export interface IWeeklyRankResult extends IRankResult {
  status: ChallengeStatus;
  refreshTime: string | null;
}

export interface ISeasonRankResult extends IWeeklyRankResult {
  seasonName: string;
}
