import ZenroomContract from '../../lib/ZenroomContract';
import ZenroomExecutor from '../../lib/ZenroomExecutor';

import contract from '../../assets/contracts/vote';
import Signature from '../../lib/Signature';
import ZenroomExecutorError from '../../lib/errors/ZenroomExecutorError';
import Transaction from '../../lib/Transaction';

jest.mock('../../lib/ZenroomExecutor.js');


describe('ZenroomContract', () => {
  describe('addSignature', () => {
    const yesAnyAnySignature = new Signature('YES', 'ANY', 'ANY');
    const currentOutputs = ['{"type": "PetitionEncToken"}', '{"public": "...."}'];

    it('should call Zenroom Executor with the correct parameters', async () => {
      const zenroomResult = {};
      const executeMock = jest.fn();
      executeMock.mockResolvedValue(zenroomResult);

      ZenroomExecutor.mockImplementation(() => ({
        execute: executeMock,
      }));
      const zenroomExecutor = new ZenroomExecutor();
      const zenroomContract = new ZenroomContract(zenroomExecutor);

      const data = {
        public: '....',
        option: 'YES-ANY-ANY',
      };

      await zenroomContract.addSignature(yesAnyAnySignature, currentOutputs);

      expect(executeMock).toBeCalledWith(contract, data);
    });

    it('should return an error if there is an issue executing Zenroom', async () => {
      const executeMock = jest.fn();
      executeMock.mockRejectedValue(new Error('Failed to execute Zenroom'));

      ZenroomExecutor.mockImplementation(() => ({
        execute: executeMock,
      }));
      const zenroomExecutor = new ZenroomExecutor();
      const zenroomContract = new ZenroomContract(zenroomExecutor);

      await expect(zenroomContract.addSignature(yesAnyAnySignature, currentOutputs))
        .rejects.toThrow(new ZenroomExecutorError());
    });

    xit('should return a valid transaction', () => {});
  });

  describe('buildTransaction', () => {
    const somePublic = 'testPublic';
    const someOptions = 'testOptions';
    const someScores = 'testScores';
    const someIncrement = 'testIncrement';
    const someProveBin = 'someProveBin';
    const someProveOne = 'someProveOne';


    it('should return a correct transaction', () => {
      const zenroomContract = new ZenroomContract(jest.fn());
      const expectedTransaction = new Transaction({
        outputs: [JSON.stringify({
          public: somePublic,
          options: someOptions,
          scores: someScores,
          type: 'PetitionEncObject',
        })],
        extra_parameters: [someIncrement, someProveBin, someProveOne],
      });

      const zenroomOutput = JSON.stringify({
        public: somePublic,
        options: someOptions,
        scores: someScores,
        increment: someIncrement,
        provebin: someProveBin,
        prove_sum_one: someProveOne,
      });

      const actualTransaction = zenroomContract.buildTransaction(zenroomOutput);

      expect(actualTransaction).toEqual(expectedTransaction);
    });
  });
});
