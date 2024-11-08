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
  IErrorResponse,
} from 'types';
import request, { cmsRequest } from './axios';
import {
  IRankingHistoryResult,
  IRankingSeasonListResult,
  ISeasonRankResult,
  IWeeklyRankResult,
} from 'components/Leaderboard/data/types';

export const getBeanPassClaimClaimable = async (
  query: IBeanPassClaimReq,
): Promise<IBeanPassClaimRes & IErrorResponse> => {
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

export const fetchChessboardData = async (url?: string): Promise<IChessboardDataResponse> => {
  return cmsRequest.get<IChessboardDataResponse>(`items/${url}` || 'items/chessboard_data');
};

export const fetchChessboardConfig = async (): Promise<{ data: Record<string, [string, string]> }> => {
  return cmsRequest.get<{ data: Record<string, [string, string]> }>('items/chessboard_config');
};

export const fetchNoticeModal = async (): Promise<INoticeModalResponse> => {
  return cmsRequest.get<INoticeModalResponse>('items/notice_modal');
};
export const fetchBeanPassList = async (query: { caAddress: string }): Promise<Array<IBeanPassListItem>> => {
  return request.get('/app/bean-pass/nft-list', { params: query });
};

export const setCurUsingBeanPass = async (body: ISetCurBeanBody): Promise<IBeanPassListItem> => {
  return request.post('/app/bean-pass/using', body);
};

export const trackUnlockInfo = async (body: { caAddress: string; caHash: string }) => {
  return request.post('/app/trace/user-action', body);
};
