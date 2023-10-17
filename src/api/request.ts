import {
  IBeanPassClaimRes,
  IBeanPassClaimReq,
  IConfigResponse,
  IChessboardDataResponse,
  IGetRankQuery,
  IRankHistoryQuery,
  INoticeModalResponse,
  IBeanPassListItem,
  ISetCurBeanBody,
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

export const getPopup = async (params: { caAddress: string }): Promise<boolean> => {
  return request.post('app/bean-pass/popup', params);
};

export const fetchConfigItems = async (): Promise<IConfigResponse> => {
  return cmsRequest.get<IConfigResponse>('items/config');
};

export const fetchChessboardData = async (): Promise<IChessboardDataResponse> => {
  return cmsRequest.get<IChessboardDataResponse>('items/chessboard_data');
};

export const fetchNoticeModal = async (): Promise<INoticeModalResponse> => {
  return cmsRequest.get<INoticeModalResponse>('items/notice_modal');
};
export const fetchBeanPassList = async (query: { caAddress: string }): Promise<Array<IBeanPassListItem>> => {
  return request.get('/app/bean-pass/nft-list', { params: query });
};

export const setCurUsingBeanPass = async (body: ISetCurBeanBody): Promise<IBeanPassListItem> => {
  return request.post('/app/bean-pass/using POST', body);
};
