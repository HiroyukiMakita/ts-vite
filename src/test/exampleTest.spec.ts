/** @ref https://jestjs.io/ja/docs/getting-started */

let value1: undefined | string = undefined;
let value2: undefined | string = undefined;
let value3: undefined | string = undefined;
let value4: undefined | string = undefined;

beforeAll((done) => {
  value1 = 'すべてのテストの前に 1 度だけ実行したい処理';
  done();
});
beforeEach((done) => {
  value2 = 'すべてのテストの前に毎回実行したい処理';
  done();
});
beforeAll(async () => {
  value3 = await new Promise((resolve) => {
    resolve('すべてのテストの前に 1 度だけ実行したい処理');
  });
});
beforeEach(async () => {
  value4 = await new Promise((resolve) => {
    resolve('すべてのテストの前に毎回実行したい処理');
  });
});

test('普通に単体テスト', () => {
  const sum = 1 + 1;
  expect(sum).toBe(2);
});

describe('複数のテストグループ', () => {
  it('beforeAll test', () => {
    expect(value1).toBeDefined();
  });
  it('beforeEach test', () => {
    expect(value2).toBeDefined();
  });
  it('非同期の beforeAll test', () => {
    expect(value3).toBeDefined();
  });
  it('非同期の beforeEach', () => {
    expect(value4).toBeDefined();
  });
});

describe('繰り返しテスト', () => {
  // 見た目かっこよい、インデントを気にしながら書くのが大変
  it.each`
    a    | b    | sum  | expected
    ${1} | ${1} | ${2} | ${true}
    ${2} | ${2} | ${3} | ${false}
    ${2} | ${1} | ${3} | ${true}
  `(`【テンプレートリテラル】 (($a + $b) === $sum) === $expected`, ({ a, b, sum, expected }) => {
    expect(a + b === sum).toBe(expected);
  });

  // 引数の型推論が聞いているので TypeScript 的にはこっちの方が書きやすい
  it.each([
    { a: 1, b: 1, sum: 2, expected: true },
    { a: 2, b: 2, sum: 3, expected: false },
    { a: 2, b: 1, sum: 3, expected: true },
  ])(`【配列】 (($a + $b) === $sum) === $expected`, ({ a, b, sum, expected }) => {
    expect(a + b === sum).toBe(expected);
  });
});
