import React, { ReactElement } from 'react';

import DiceRes0 from 'assets/images/diceLoading/dice-result0.svg';
import DiceRes1 from 'assets/images/diceLoading/dice-result1.svg';
import DiceRes2 from 'assets/images/diceLoading/dice-result2.svg';
import DiceRes3 from 'assets/images/diceLoading/dice-result3.svg';
import DiceRes4 from 'assets/images/diceLoading/dice-result4.svg';
import DiceRes5 from 'assets/images/diceLoading/dice-result5.svg';
import DiceRes6 from 'assets/images/diceLoading/dice-result6.svg';

interface IProps {
  curDiceCount?: number;
  diceNumbers?: number[];
  showDice: boolean;
}

function DiceResult({ curDiceCount = 1, diceNumbers, showDice }: IProps) {
  const DiceCom = (key: string): ReactElement | undefined => {
    if (!showDice) {
      return <DiceRes0 className="w-full" />;
    }
    return {
      0: <DiceRes1 className="w-full" />,
      1: <DiceRes1 className="w-full" />,
      2: <DiceRes2 className="w-full" />,
      3: <DiceRes3 className="w-full" />,
      4: <DiceRes4 className="w-full" />,
      5: <DiceRes5 className="w-full" />,
      6: <DiceRes6 className="w-full" />,
    }[key];
  };

  const DiceResCom: Record<string, ReactElement> = {
    1: <div className="w-[24%]">{DiceCom(`${diceNumbers?.[0]}`)}</div>,
    2: (
      <div className="flex w-full item-center justify-center">
        <div className="w-[24%] mr-[16px]">{DiceCom(`${diceNumbers?.[0]}`)}</div>
        <div className="w-[24%]">{DiceCom(`${diceNumbers?.[1]}`)}</div>
      </div>
    ),
    3: (
      <div className="flex flex-col w-full item-center justify-center">
        <div className="flex w-full item-center justify-center">
          <div className="w-[24%]">{DiceCom(`${diceNumbers?.[0]}`)}</div>
        </div>
        <div className="flex w-full item-center justify-center mt-[-5%]">
          <div className="w-[24%] mr-[16px]">{DiceCom(`${diceNumbers?.[1]}`)}</div>
          <div className="w-[24%]">{DiceCom(`${diceNumbers?.[2]}`)}</div>
        </div>
      </div>
    ),
  };

  return (
    <div className="absolute w-full h-full z-[51] flex justify-center items-center">
      {DiceResCom[`${curDiceCount}`]}
    </div>
  );
}

export default React.memo(DiceResult);
