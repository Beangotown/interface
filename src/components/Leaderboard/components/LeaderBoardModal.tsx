import { Modal, ModalProps, Row } from 'antd';
import { CloseIcon } from 'assets/images/index';

import styles from './style.module.css';
import { useIsMobile } from 'redux/selector/mobile';

export default function LeaderBoardModal({
  children,
  title,
  onCancel,
  closable = true,
  className,
  ...params
}: ModalProps) {
  const isMobile = useIsMobile();

  return (
    <Modal className={styles.leaderboardModal} {...params} closable={false} centered>
      <Row className={`${styles.modal__title} modal__title`} justify="center" align="middle">
        <span>{title}</span>
        {closable && <CloseIcon className={styles.modal__closeIcon} onClick={onCancel} />}
      </Row>
      <div className={`${isMobile ? 'h-[60vh]' : 'h-[50vh]'} overflow-auto`}>{children}</div>
    </Modal>
  );
}