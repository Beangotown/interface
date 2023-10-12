import {
  IBeanPassClaimRes,
  IBeanPassClaimReq,
  IConfigResponse,
  IChessboardDataResponse,
  IGetRankQuery,
  IRankHistoryQuery,
} from 'types';
import request, { cmsRequest } from './axios';
import {
  IRankingHistoryResult,
  IRankingSeasonListResult,
  ISeasonRankResult,
  IWeeklyRankResult,
} from 'components/Leaderboard/data/types';

export const getBeanPassClaimClaimable = async (query: IBeanPassClaimReq): Promise<IBeanPassClaimRes> => {
  return request.get('app/bean-pass/claimable', { params: query });
};

export const receiveBeanPassNFT = async (body: IBeanPassClaimReq): Promise<IBeanPassClaimRes> => {
  return request.post('app/bean-pass/claim', body);
};

export const blockHeight = async (): Promise<number> => {
  return request.get('app/chain/blockHeight');
};

export const getWeekRank = async (query: IGetRankQuery): Promise<IWeeklyRankResult> => {
  return request.get('/app/rank/week-rank', { params: query });
};

export const getSeasonRank = async (query: IGetRankQuery): Promise<ISeasonRankResult> => {
  return request.get<any>('/app/rank/season-rank', { params: query });
};

export const getSeasonList = async (): Promise<IRankingSeasonListResult> => {
  return request.get<any>('/app/rank/season-list');
};

export const getRankHistory = async (query: IRankHistoryQuery): Promise<IRankingHistoryResult> => {
  return request.get<any>('/app/rank/ranking-history', { params: query });
};

export const fetchConfigItems = async (): Promise<IConfigResponse> => {
  return cmsRequest.get<IConfigResponse>('items/config');
};

export const fetchChessboardData = async (): Promise<IChessboardDataResponse> => {
  return cmsRequest.get<IChessboardDataResponse>('items/chessboard_data');
};
