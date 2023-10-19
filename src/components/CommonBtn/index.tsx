import { MouseEventHandler } from 'react';
import styles from './style.module.css';

interface ICommonBtnProps {
  title?: string | React.ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  className?: string;
}

export default function CommonBtn({ title = 'Confirm', onClick, className }: ICommonBtnProps) {
  return (
    <div className={`${styles.commonBtn} ${className}`} onClick={onClick}>
      {title}
    </div>
  );
}
