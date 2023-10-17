import React, { ReactNode } from 'react';

import useGetState from 'redux/state/useGetState';
import styles from './index.module.css';

function BoardRight({ children }: { children: ReactNode }) {
  const { imageResources, configInfo } = useGetState();
  return (
    <div className={styles['game__pc__side']}>
      <div
        className={styles['game__pc__blur']}
        style={{
          backgroundImage: `url(${imageResources?.aloginBgPc})`,
        }}></div>
      {configInfo?.isHalloween && <div className={styles['game__pc__mask']}></div>}
      <div className="z-30 h-full w-full">{children}</div>
    </div>
  );
}

export default React.memo(BoardRight);
