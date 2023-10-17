import { getPopup } from 'api/request';
import { setNoticeModal } from 'redux/reducer/noticeModal';
import { store, dispatch } from 'redux/store';

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
            if (noticeModalInfo?.url) window.open(noticeModalInfo.url, '_blank');
          },
        }),
      );
    }
  } catch (error) {
    /* empty */
  }
};
