# Agent Guidelines

本ドキュメントは、このプロジェクトに関わる AI エージェント（Cursor 等）向けのルールブックです。

## エージェント向け方針
- **言語**: 日本語
- **役割**: ペアプログラマー。ユーザーの意図を汲み取り、既存の規約とコードスタイルに沿って実装する。

## コミュニケーション規約
- **合意形成の徹底**: いかなる修正（コード、ドキュメント、ファイル移動等）も、必ず事前に具体的な内容を提案し、ユーザーの合意を得てから着手すること。
- **独断の禁止**: 「良かれと思って」の独断による作業開始は厳禁。特に、指摘を受けた直後にそのまま修正に飛びつくのではなく、まずは確認を挟むこと。

## 技術スタック
- **Frontend**: React (Functional Components) 19
- **React Compiler**: ビルド時の自動メモ化（`babel-plugin-react-compiler` + `@rolldown/plugin-babel`）
- **Tooling**: Vite
- **Routing**: TanStack Router (SPA mode, Directory-based)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) v5
- **Validation**: Zod (スキーマ定義/型推論)
- **I18n**: react-i18next (日本語/英語)
- **Hosting / Edge**: Cloudflare Workers (Wrangler)
- **API Proxy**: 本番環境では `/api/*` → PokeAPI（Workers 上でキャッシュ）

## ディレクトリ構造 (TanStack Router 準拠)
- `docs/`: エージェント向けドキュメント（`agent.md`, `memory.md`, `skills.md`）
- `src/routes/`: ルーティングの定義場所（ファイルベース）。
  - `__root.tsx`: アプリ全体の共通枠。
  - `index.tsx`: トップページ (/) - ランディングページ。
  - `pokemon/`: ポケモン図鑑機能のグループ。
    - `index.tsx`: ポケモン一覧 (/pokemon)。
    - `-$name/`: 詳細画面専用のコンポーネント・フック・ユーティリティの置き場。
      - `components/`（例: `DetailVersionSelect.tsx`, `MovesSection.tsx`, `FlavorTextSection.tsx`）
      - `hooks/`（例: `usePokemonDetailPage.ts`, `useMoveDetails.ts`）
      - `utils/`（pure 関数。例: `flavorText.ts`, `speciesDisplay.ts`, `moves.ts`）
    - `$name.tsx`: ポケモン詳細 (/pokemon/:name)。
    - `-index/`: 一覧画面専用のコンポーネントやフックの置き場。
      - `components/`
- `src/components/`: アプリ全体で共有するUIパーツ。
  - `common/`
- `src/hooks/`: アプリ全体で共有するロジック。
  - `common/`
  - `pokemon-list/`
- `src/api/`: APIクライアント。
- `src/types/`: 共通型定義。
- `src/utils/`: 共通ユーティリティ。
- `src/i18n/`: i18next 設定。
- `src/locales/`: 翻訳 JSON（`ja.json`, `en.json`）。
- `src/worker.ts`: Cloudflare Workers エントリ（PokeAPI プロキシ＆静的アセット配信）。
- `wrangler.jsonc`: Wrangler 設定（`dist` をアセット、`src/worker.ts` を main）。

## コミットメッセージ

絵文字プレフィックスを使用した日本語メッセージを採用（本プロジェクトのコミット規約の正）。

### 基本形式
`絵文字(対象範囲): 内容`

### 使用する絵文字
- ✨ **新機能**: `:sparkles:` (feat)
- 🐛 **バグ修正**: `:bug:` (fix)
- 🛠️ **機能改善**: `:hammer:` (improve)
- ♻️ **コード整理**: `:recycle:` (refactor)
- 💄 **スタイル修正**: `:lipstick:` (style)
- 📝 **ドキュメント**: `:memo:` (docs)

## デザイン方針
- モダンでレスポンシブな UI。Tailwind CSS を活用。
- モバイルフレンドリーなレイアウトを優先。

## 作業完了チェックリスト
「完了」を宣言する前に、**必ず** 以下を実施すること。コード変更のみでタスクを終了してはならない。

### 1. ドキュメント更新トリガーの確認
次のいずれかに該当したら、`docs/` の更新が **必須**（「後で」は不可）:

- 新機能・画面コンポーネント・hook・API クライアントの追加
- ディレクトリ構造・命名規約・データフローの変更
- ユーザーとの議論で技術判断（A ではなく B）が確定した
- 外部 API（PokeAPI 等）の挙動・制約を新たに把握した

### 2. 3ファイル個別チェック

1.  **`agent.md` (憲法)**:
    - コードの物理的な配置、命名規則、技術スタック、あるいは「合意形成のルール」自体に変更はないか？
2.  **`memory.md` (歴史)**:
    - ユーザーとの対話を通じて、「AではなくBにした」という経緯や、後から「なぜこうなった？」と疑問に思うような判断はなかったか？
3.  **`skills.md` (知見)**:
    - APIの挙動、CSSの工夫、ライブラリのハマりどころなど、「未来の自分（や他の開発者）のためのメモ」として残すべき発見はなかったか？

### 3. 完了報告の形式
ドキュメント確認後、ユーザーへの完了報告に **必ず1行** 含める:

- `Docs: 更新なし（理由）` または `Docs: memory.md / skills.md を更新`

**※ 機能実装とドキュメント更新（または「更新不要」の明示的理由）は同一タスクの「1セット」。ユーザーが docs 更新を依頼した場合は、合意済みとみなし即時反映してよい。**

## ドキュメントの保守 (Documentation Maintenance)
エージェントは、開発プロセスにおいて以下のドキュメントを継続的に更新する義務を負います。

- **`memory.md`**: 重要な技術選定、構造の変更、または「なぜそうしたか」という議論の結論が出た際に、必ず日付とともにその背景を記録してください。廃止済みの決定には **状態** を明記すること。
- **`skills.md`**: 開発を通じて得られた API の仕様、ライブラリのクセ、複雑なロジックの解説など、後で役立つ知見が得られた際に追記してください。現行コードに存在しない実装の記述は残さないこと。
- **`agent.md`**: プロジェクト規約や技術スタックに変更があった場合、このファイル自体を最新の状態に更新してください。

### 命名の補足（Record と Map の区別）
- プレーンオブジェクトのルックアップテーブルは `xxxByKey` 形式（例: `movesByName`, `localizedNamesById`）。変数名に `Map` を使わない。
- JavaScript の `Map` オブジェクトを使う場合のみ `new Map()` とセットで記述する。
