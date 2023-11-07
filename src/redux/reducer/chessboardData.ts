import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { IChessboardData } from 'types';
import { CheckerboardNode } from 'pageComponents/Recreation/checkerboard';

const initialState: {
  chessboardData: IChessboardData | undefined;
  resetStart: boolean;
  curChessboardNode?: CheckerboardNode;
  chessboardTotalStep: number;
  checkerboardCounts: number;
  startPosition: [number, number];
} = {
  chessboardData: undefined,
  resetStart: true,
  chessboardTotalStep: 0,
  checkerboardCounts: 18,
  startPosition: [5, 4],
};

// Actual Slice
export const chessboardDataSlice = createSlice({
  name: 'chessboardData',
  initialState,
  reducers: {
    setChessboardData(state, action) {
      state.chessboardData = action.payload;
    },
    setChessboardResetStart(state, action) {
      state.resetStart = action.payload;
    },
    setCurChessboardNode(state, action) {
      state.curChessboardNode = action.payload;
    },
    setChessboardTotalStep(state, action) {
      state.chessboardTotalStep = action.payload;
    },
    setCheckerboardCounts(state, action) {
      state.checkerboardCounts = action.payload;
    },
    setStartPosition(state, action) {
      state.startPosition = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.chessboardData,
      };
    },
  },
});

export const {
  setChessboardData,
  setChessboardResetStart,
  setCurChessboardNode,
  setChessboardTotalStep,
  setCheckerboardCounts,
  setStartPosition,
} = chessboardDataSlice.actions;
export const getChessboardData = (state: AppState) => state.chessboardData.chessboardData?.data;
export const getImageResources = (state: AppState) => state.chessboardData.chessboardData?.imageResources;
export const getBtnImageResources = (state: AppState) => state.chessboardData.chessboardData?.btnImageResources;
export const getCheckerboardCounts = (state: AppState) => state.chessboardData.checkerboardCounts;
export const getCurChessboardNode = (state: AppState) => state.chessboardData.curChessboardNode;
export const getResetStart = (state: AppState) => state.chessboardData.resetStart;
export const getChessboardTotalStep = (state: AppState) => state.chessboardData.chessboardTotalStep;
export const getChessboardStartPosition = (state: AppState) => state.chessboardData.startPosition;

export default chessboardDataSlice.reducer;
