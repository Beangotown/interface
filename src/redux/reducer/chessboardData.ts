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
} = {
  chessboardData: undefined,
  resetStart: true,
  chessboardTotalStep: 0,
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

export const { setChessboardData, setChessboardResetStart, setCurChessboardNode, setChessboardTotalStep } =
  chessboardDataSlice.actions;
export const getChessboardData = (state: AppState) => state.chessboardData.chessboardData?.data;
export const getImageResources = (state: AppState) => state.chessboardData.chessboardData?.imageResources;
export const getBtnImageResources = (state: AppState) => state.chessboardData.chessboardData?.btnImageResources;
export const getCheckerboardCounts = (state: AppState) => state.chessboardData.chessboardData?.checkerboardCounts || 18;
export const getCurChessboardNode = (state: AppState) => state.chessboardData.curChessboardNode;
export const getResetStart = (state: AppState) => state.chessboardData.resetStart;
export const getChessboardTotalStep = (state: AppState) => state.chessboardData.chessboardTotalStep;

export default chessboardDataSlice.reducer;
