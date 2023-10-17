import { useSelector } from 'react-redux';
import { getNoticeModal } from 'redux/reducer/noticeModal';

const useGetNoticeState = () => {
  const noticeModal = useSelector(getNoticeModal);

  return noticeModal;
};

export default useGetNoticeState;
