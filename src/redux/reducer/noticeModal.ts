import { createSlice } from '@reduxjs/toolkit';
import { AppState, dispatch } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { ModalProps } from 'antd';
import { ReactElement } from 'react';

export interface INoticeModal {
  content?: string | string[] | React.ReactNode;
  url?: string;
}

const defaultInfo = {
  onCancel: () => {
    dispatch(
      setNoticeModal({
        open: false,
      }),
    );
  },
};

const initialState: {
  noticeModal?: ModalProps & INoticeModal;
} = {
  noticeModal: {
    ...defaultInfo,
  },
};

// Actual Slice
export const noticeModalSlice = createSlice({
  name: 'noticeModal',
  initialState,
  reducers: {
    setNoticeModal(state, action) {
      console.log('setNoticeModal', state, action.payload);
      state.noticeModal = {
        ...state.noticeModal,
        ...action.payload,
      };
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.configInfo,
      };
    },
  },
});

export const { setNoticeModal } = noticeModalSlice.actions;
export const getNoticeModal = (state: AppState) => state.noticeModal.noticeModal;
export default noticeModalSlice.reducer;
