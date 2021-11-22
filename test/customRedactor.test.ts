import { AsyncRedactor, SyncRedactor } from '../src';

const redactor = new SyncRedactor();
const compositeRedactorWithCustomAsyncRedactor = new AsyncRedactor({
  builtInRedactors: {
    zipcode: {
      enabled: false,
    },
    digits: {
      enabled: false,
    },
  },
  customRedactors: {
    before: [
      {
        regexpPattern: /(banana|apple|orange)/,
        replaceWith: 'FOOD',
      },
    ],
    after: [
      {
        regexpPattern: /我的卡号/gi,
        replaceWith: 'PERSON_NAME',
      },
      {
        regexpPattern: /\b\d{3}-\d{4}-\d{3}\b/gi,
        replaceWith: 'PHONE_NUMBER',
      },
    ],
  },
});

describe('index.js', function () {
  type InputAssertionTuple = [string, string, string?];

  function TestCase(description: string, thingsToTest: Array<InputAssertionTuple>) {
    it(description, async () => {
      for (const [input, syncOutput, asyncOutput] of thingsToTest) {
        expect(redactor.redact(input)).toBe(syncOutput);
        if (asyncOutput) {
          await expect(compositeRedactorWithCustomAsyncRedactor.redactAsync(input)).resolves.toBe(asyncOutput);
        }
      }
    });
  }

  TestCase.only = function (description: string, thingsToTest: Array<InputAssertionTuple>) {
    it.only(description, async () => {
      for (const [input, syncOutput, asyncOutput] of thingsToTest) {
        expect(redactor.redact(input)).toBe(syncOutput);
        if (asyncOutput) {
          await expect(compositeRedactorWithCustomAsyncRedactor.redactAsync(input)).resolves.toBe(asyncOutput);
        }
      }
    });
  };

  TestCase('should redact PII', [["Hey it's David Johnson with 1234", "Hey it's PERSON_NAME with DIGITS"]]);

  it('should redact non english text', async function () {
    jest.setTimeout(7000);
    await expect(compositeRedactorWithCustomAsyncRedactor.redactAsync('我的名字是王')).resolves.toBe('我的名字是王');
    await expect(compositeRedactorWithCustomAsyncRedactor.redactAsync('我的卡号是 1234')).resolves.toBe(
      'PERSON_NAME是 1234'
    );
    await expect(compositeRedactorWithCustomAsyncRedactor.redactAsync('我的电话是 444-3332-343')).resolves.toBe(
      '我的电话是 PHONE_NUMBER'
    );
    await expect(
      compositeRedactorWithCustomAsyncRedactor.redactAsync("Hey it's David Johnson with 1234")
    ).resolves.toBe("Hey it's PERSON_NAME with 1234");
    await expect(
      compositeRedactorWithCustomAsyncRedactor.redactAsync(
        'Hi banana, my credit card is 4111111111111111 and I need help. Thanks, John'
      )
    ).resolves.toBe('Hi FOOD, my credit card is CREDIT_CARD_NUMBER and I need help. Thanks, PERSON_NAME');
  });
});
