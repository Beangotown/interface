import { getPopup } from 'api/request';
import { setNoticeModal } from 'redux/reducer/noticeModal';
import { store, dispatch } from 'redux/store';
import { SentryMessageType, captureMessage } from 'utils/captureMessage';
import openPage from 'utils/openPage';

export const getModalInfo = async (props: { isHalloween: boolean | undefined; caAddress: string }) => {
  const { isHalloween, caAddress } = props;
  try {
    const res = await getPopup({ caAddress });
    const noticeModalInfo = store.getState().noticeModal.noticeModal;

    if (res && isHalloween) {
      dispatch(
        setNoticeModal({
          open: true,
          onOk: () => {
            if (noticeModalInfo?.url) openPage(noticeModalInfo.url);
          },
        }),
      );
    }
  } catch (error) {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'app/bean-pass/popup',
        method: 'post',
        query: {
          caAddress,
        },
        description: error,
      },
    });
  }
};
