import { MutableRefObject } from 'react';
import { CheckerboardList, ICheckerboardItem, ArrowDirection } from '../checkerboard';

export const getList = (
  node: ICheckerboardItem,
  nodePosition: [number, number],
  checkerboardData: ICheckerboardItem[][],
  linkedList: MutableRefObject<CheckerboardList | undefined>,
  firstNodePosition: [number, number],
) => {
  const current = {
    row: nodePosition[0],
    column: nodePosition[1],
    info: node,
  };

  linkedList.current?.append(current);

  if (node.arrow) {
    let nextPosition: [number, number] = [nodePosition[0], nodePosition[1]];
    switch (node.arrow) {
      case ArrowDirection.LEFT:
        nextPosition = [nodePosition[0], nodePosition[1] - 1];
        break;
      case ArrowDirection.RIGHT:
        nextPosition = [nodePosition[0], nodePosition[1] + 1];
        break;
      case ArrowDirection.TOP:
        nextPosition = [nodePosition[0] - 1, nodePosition[1]];
        break;
      case ArrowDirection.BOTTOM:
        nextPosition = [nodePosition[0] + 1, nodePosition[1]];
        break;
    }

    if (nextPosition[0] === firstNodePosition[0] && nextPosition[1] === firstNodePosition[1]) {
      return;
    } else {
      getList(
        checkerboardData[nextPosition[0]][nextPosition[1]],
        nextPosition,
        checkerboardData,
        linkedList,
        firstNodePosition,
      );
    }
  }
};
