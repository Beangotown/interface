'use client';
import { getNoticeModal } from 'redux/reducer/noticeModal';
import { useSelector } from 'redux/store';

import Modal from 'components/CommonModal';
import CommonBtn from 'components/CommonBtn';

export default function NoticeModal() {
  const modalInfo = useSelector(getNoticeModal);

  const renderContent = () => {
    const content = modalInfo?.content;
    if (content instanceof String) {
      return <p className="text-left">{content}</p>;
    } else if (content instanceof Array) {
      return content.map((item, index) => {
        return (
          <p className="text-left" key={index}>
            {item}
          </p>
        );
      });
    } else {
      return content;
    }
  };

  return (
    <Modal footer={null} {...modalInfo}>
      <div className="mb-6 md:mb-[37px] md:text-[24px] md:leading-[32px]">{renderContent()}</div>
      {modalInfo?.okText && (
        <div className="mx-2">
          <CommonBtn title={modalInfo?.okText} onClick={modalInfo.onOk}></CommonBtn>
        </div>
      )}
    </Modal>
  );
}
