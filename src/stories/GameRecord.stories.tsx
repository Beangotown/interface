import type { Meta, StoryObj } from '@storybook/react';
import { GameRecord } from '../components/GameRecord';
import { toggleShowGameRecord } from '../redux/reducer/info';
import { useEffect } from 'react';
import { storybookStore } from '../../.storybook/preview';
import { useGameHistory } from '../components/GameRecord/data/useGameHistory';
import { uniqueId } from 'lodash';

const meta: Meta<typeof GameRecord> = {
  title: 'BeangoTown/GameRecord',
  component: GameRecord,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        if (!storybookStore.getState().info.showGameRecord) storybookStore.dispatch(toggleShowGameRecord());
      }, []);

      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GameRecord>;

export const WithData: Story = {
  args: {
    records: 0,
  },
  argTypes: {
    records: {
      control: { type: 'range', min: 0, max: 150, step: 1 },
    },
  },
  decorators: [
    (Story, context) => {
      const { records } = context.args as {
        records: number;
      };
      const { mutate: his } = useGameHistory();

      useEffect(() => {
        his(
          {
            gameList: Array(records)
              .fill('')
              .map((_i) => {
                const playId = uniqueId();
                const bingoId = uniqueId();

                return {
                  id: playId,
                  gridNum: 6,
                  score: 1,
                  transcationFee: 68145000,
                  playTransactionInfo: {
                    transactionId: playId,
                    transactionFee: 32010000,
                    triggerTime: '2023-08-25T14:52:09.8413129Z',
                  },
                  bingoTransactionInfo: {
                    transactionId: bingoId,
                    transactionFee: 36135000,
                    triggerTime: '2023-08-25T14:52:19.0444489Z',
                  },
                };
              }),
          },
          false,
        );
      }, [records]);

      return <Story />;
    },
  ],
};
