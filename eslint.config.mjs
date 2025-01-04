import globals from 'globals';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';
import importPlugin from 'eslint-plugin-import';
import unusedImportPlugin from 'eslint-plugin-unused-imports';
import eslintPkg from '@eslint/js';
const { configs: eslintConfigs } = eslintPkg;
import typescriptParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

// チェック対象のコードがどの実行環境で使われるか
// https://eslint.org/docs/latest/use/configure/language-options#specifying-environments
export default [
  // eslint:recommended 設定を追加
  eslintConfigs.recommended,
  // ESLint の設定を拡張するためのプロパティ（多分 Flat Config 未対応のものの extends をする方法なはず）
  ...compat.extends(
    // TypeScript の推奨設定を追加
    'plugin:@typescript-eslint/eslint-recommended',
    // Prettier との競合を避けるための設定を追加
    'prettier'
  ),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      // ES Modules を使ってコードを書く場合は module を指定する必要がある
      sourceType: 'module',
      globals: {
        // ブラウザで使用する場合（alert、window などのグローバル変数を認識する）
        ...globals.browser,
        // node のグローバル変数
        ...globals.node,
        // jest のグローバル変数
        ...globals.jest,
        // ES6 のグローバル変数
        ...globals.es6,
      },
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      // eslint-plugin-jest
      jest: jestPlugin,
      // eslint-plugin-import
      import: importPlugin,
      // eslint-plugin-unused-imports
      'unused-imports': unusedImportPlugin,
    },
    rules: {
      // コメント /* や */ の前後にスペースが必要
      'spaced-comment': 0,
      // デフォルトインポート（デフォルトは Warning）
      'import/no-named-as-default': 0,
      // 使用していない import 文を削除
      'unused-imports/no-unused-imports': 1,
      /**
       * TypeScript は標準の型チェックの一部と重複するルール https://github.com/typescript-eslint/typescript-eslint/blob/1c1b572c3000d72cfe665b7afbada0ec415e7855/docs/getting-started/linting/FAQ.md#eslint-plugin-import
       */
      // 参照されたモジュール内のすべての名前付きインポートは名前付きエクスポートのセット内にある必要がある
      'import/named': 0,
      // インポートしたオブジェクトから存在しないプロパティにアクセスしてはならない
      'import/namespace': 0,
      // インポートされたモジュールは、そのモジュールのデフォルトエクスポートを使用してはならない
      'import/default': 0,
      // デフォルトのエクスポートでエクスポートされた名前をプロパティとして使用してはならない
      'import/no-named-as-default-member': 0,
    },
    files: ['**/*.js', '**/*.ts'],
    ignores: ['node_modules/**', 'dist/**', 'package.json', 'yarn.lock', 'eslint.config.mjs'],
  },
];