import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { InfoStateType, LoginStatus } from 'redux/types/reducerTypes';
import { WalletType } from 'types';

const initialState: InfoStateType = {
  isMobile: false,
  baseInfo: {
    rpcUrl: '',
  },
  theme: 'light',
  walletInfo: null,
  walletType: WalletType.unknown,
  accountInfoSync: null,
  loginStatus: LoginStatus.UNLOGIN,
  showLeaderboard: false,
  showLeaderboardInfo: false,
  showGameRecord: false,
  assetVisible: false,
  isNeedSyncAccountInfo: true,
};

// Actual Slice
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setWalletInfo(state, action) {
      state.walletInfo = action.payload;
    },
    setWalletType(state, action) {
      state.walletType = action.payload;
    },
    setLoginStatus(state, action) {
      state.loginStatus = action.payload;
    },
    setAccountInfoSync(state, action) {
      state.accountInfoSync = action.payload;
    },
    setPlayerInfo(state, action) {
      state.playerInfo = action.payload;
    },
    toggleShowLeaderboard(state) {
      state.showLeaderboard = !state.showLeaderboard;
    },
    toggleShowLeaderboardInfo(state) {
      state.showLeaderboardInfo = !state.showLeaderboardInfo;
    },
    toggleShowGameRecord(state) {
      state.showGameRecord = !state.showGameRecord;
    },
    setAssetVisible(state, action) {
      state.assetVisible = action.payload;
    },
    setGameSetting(state, action) {
      state.gameSetting = action.payload;
    },
    setIsNeedSyncAccountInfo(state, action) {
      state.isNeedSyncAccountInfo = action.payload;
    },
    setCurBeanPass(state, action) {
      state.curBeanPass = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const {
  setIsMobile,
  setLoginStatus,
  setWalletInfo,
  setAccountInfoSync,
  setWalletType,
  setPlayerInfo,
  toggleShowLeaderboard,
  toggleShowLeaderboardInfo,
  toggleShowGameRecord,
  setAssetVisible,
  setGameSetting,
  setIsNeedSyncAccountInfo,
  setCurBeanPass,
} = infoSlice.actions;
export const selectInfo = (state: AppState) => state.info;
export default infoSlice.reducer;
