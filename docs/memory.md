# Decision Memory

このファイルは、プロジェクトにおける主要な意思決定（なぜそうしたか）を記録します。
廃止済みの決定には **状態** を明記し、現行方針と混同しないようにします。

## 📅 2026-04-11

### 🌏 日本語検索の導入
- **決定**: GitHub の外部 JSON データをフェッチして日本語検索に対応。
- **理由**: PokeAPI は最新世代（第9世代）の日本語データ登録が遅れており、API単体では日本語検索が機能しなかったため。
- **効果**: 全 1025 匹のポケモンの日本語名、英語名、IDでの即時検索が可能になった。
- **状態**: ❌ 廃止（2026-07-07 に PokeAPI CSV へ移行、下記 2026-07-07 参照）

### 🔄 フィルター状態の永続化（sessionStorage）
- **決定**: `sessionStorage` を使用して、検索ワード、タイプ、世代、スクロール位置を保存。
- **理由**: 詳細画面から一覧画面へ戻った際の UX を損なわないよう、直前の状態を復元する必要があった。`localStorage` ではなく `sessionStorage` を選んだのは、ブラウザを閉じればリセットされるという図鑑アプリとしての自然な挙動を優先したため。
- **状態**: ❌ 廃止。フィルターは 2026-04-24 に URL Search Params へ移行。スクロール位置の復元は現在未実装。

### 🐛 ラブトロス等の詳細画面 404 エラー修正
- **決定**: 種族データ（Species）の取得に、名前ではなく `pokemon.species.url` を使用するように変更。
- **原因**: フォルム違いのポケモン（`enamorus-incarnate` 等）において、名前を直接エンドポイントに渡すと 404 エラーになる PokeAPI の仕様によるもの。
- **改善**: 全てのフォルムにおいて、正しい種族データが取得できるようになった。
- **状態**: ✅ 現行

## 📅 2026-04-12

### 📂 ファイル構造のリファクタリング
- **決定**: フラットな構造から、ページ単位のディレクトリ構造（Feature-based）へ変更。
- **理由**: アプリの規模拡大に伴い、どのファイルがどの画面に対応しているかを明確にするため。
- **結果**: 当時は `src/pages/PokemonList` 等に Hook や Component を閉じ込めた。
- **状態**: ❌ 後続の TanStack Router 移行（2026-04-16）およびコロケーション移行（2026-04-24）により、現在は `src/routes/` 配下が正。

## 📅 2026-04-16

### 🚀 TanStack Router (SPA) への移行
- **決定**: `react-router-dom` を廃止し、`TanStack Router` によるファイルベースルーティングに移行。
- **理由**: 将来的な機能追加（わざ一覧、進化ツリーなど）を見据え、100%型安全なルーティングと整理されたディレクトリ構造を確保するため。
- **構造**: ディレクトリ形式 (`src/routes/pokemon/index.tsx`, `src/routes/pokemon/$name.tsx`) を採用し、URL階層とファイル物理構造を一致させた。
- **SPA維持**: 複雑さを避けるため、SSRは導入せず SPA 構成を継続。
- **状態**: ✅ 現行

### 🏠 ルーティングの階層化とランディングページ導入
- **決定**: トップページを `/` (ランディング) とし、図鑑機能を `/pokemon` 配下に移動。
- **理由**: 将来的な機能追加（わざ、アイテム、チーム編成など）に備え、機能ごとに独立したURL空間を確保するため。
- **状態**: ✅ 現行

## 📅 2026-04-24

### 🎯 ルートレベル・コロケーション（Route-level Colocation）への移行
- **決定**: `src/components/pokemon-*` を廃止し、`src/routes/pokemon/` 内の各ルートディレクトリ（プレフィックス `-`）にコンポーネントを移動。
- **構造**:
  - `src/routes/pokemon/-index/components/` (一覧画面専用)
  - `src/routes/pokemon/-$name/components/` (詳細画面専用)
- **理由**:
  - 画面ファイル（`index.tsx`, `$name.tsx`）とその専用部品が物理的に離れていることによるコンテキストスイッチ（視点の移動）を最小限にするため。
  - 「特定の画面でしか使わない部品」をグローバルな `src/components` から隔離し、プロジェクト全体の凝集度を高めるため。
- **状態**: ✅ 現行

### 🔗 URL Search Params へのフィルター状態移行
- **決定**: `useState` + `sessionStorage` による手動のフィルター状態管理を廃止し、TanStack Router の Search Params (Zod 連携) へ移行。
- **理由**:
  - 手動の `sessionStorage` 同期はボイラープレートが多く、バグの温床になりやすいため。
  - フィルター状態がURLに乗ることで、ブラウザの「戻る/進む」ボタンへの対応や、特定の検索結果のURL共有を容易にするため。
- **効果**: コンポーネント内のロジックが宣言的になり、コード量が削減された。また、Zod によるバリデーションにより、URLからの不正な入力に対しても堅牢になった。
- **状態**: ✅ 現行

## 📅 2026-04-26

### 🛠️ 入力デバウンス処理の共通化と `useDebouncedSync` の導入
- **決定**: `FilterBar` 内に手書きされていたデバウンスロジックを、カスタムフック `useDebouncedSync` として抽出。
- **理由**:
  - IME対応やURL同期を伴うデバウンス処理は記述量が多く、他の検索機能でも再利用可能にするため。
  - コンポーネントから複雑な副作用（Effect）を分離し、UIの記述に集中させるため。
- **状態**: ✅ 現行

### ⚠️ エージェント・ガイドラインの遵守に関する反省と教訓
- **経緯**: `agent.md` に「合意形成の徹底」が記されていたにもかかわらず、ユーザーの指摘（Zodの欠落）に対して確認を挟まず即座に修正を行ってしまった。
- **根本原因**: 「役に立ちたい」という解決欲求が先走り、プロジェクトの「プロセス」よりも「結果」を優先させてしまった。
- **教訓**: エージェントは「自律的であること」と「規約を遵守すること」のバランスを常に意識しなければならない。特にドキュメント（憲法）に関わる変更は、たとえ明白な修正であっても必ず「提案 ➔ 合意」のステップを踏むこと。

## 📅 2026-07-02

### ✨ Cloudflare Workers による PokeAPI プロキシ＆キャッシュ導入
- **決定**: `src/worker.ts` と `wrangler.jsonc` を追加し、本番環境では `/api/*` 経由で PokeAPI にアクセスする構成へ移行。
- **変更内容**:
  - `pokeApi.ts` の `BASE_URL` を本番時 `/api/v2`、開発時 `https://pokeapi.co/api/v2` に切り替え。
  - `fetchSpeciesByUrl` で PokeAPI 絶対 URL を本番時 `/api/` 相対パスへ変換。
  - Workers 上で `/api/*` を `https://pokeapi.co/api/*` にプロキシし、Cache API でエッジキャッシュ。
  - `/api/` 以外は `dist` の静的アセット配信。
- **理由**:
  - PokeAPI への直接アクセスを減らし、レスポンス速度と可用性を向上させるため。
  - Cloudflare エッジでキャッシュすることで、一覧・詳細の繰り返し閲覧時の負荷を軽減するため。
- **状態**: ✅ 現行

## 📅 2026-07-06

### 🐛 Cloudflare Workers キャッシュの HIT 率改善
- **決定**: `src/worker.ts` の Cache API 利用を修正し、`.wrangler` を `.gitignore` に追加。
- **経緯**: PokeAPI プロキシ（`/api/*`）のキャッシュが期待どおり HIT しないケースがあった。
- **変更内容**:
  - キャッシュキー生成時に `request.headers` を含めない（GET の URL のみでキー化）。
  - キャッシュ保存前に `Vary` / `Set-Cookie` ヘッダーを削除。
  - Wrangler のローカル開発用ディレクトリ `.wrangler` を Git 管理対象外に。
- **理由**: Cache API は Request の method / headers も照合対象になるため、不要な差分で MISS が増えていた。
- **状態**: ✅ 現行

### 🖼️ スプライト画像の jsDelivr CDN 化
- **決定**: PokeAPI が返す GitHub raw URL を使わず、`PokemonSprite` コンポーネントで jsDelivr CDN URL を組み立てて表示する。
- **経緯**: 一覧画面で多数の `<img>` が `raw.githubusercontent.com` に同時アクセスし、429 (Too Many Requests) で画像が表示されない不具合が発生。API データ（Worker 経由）は正常だった。
- **変更内容**:
  - `src/components/common/PokemonSprite.tsx` を追加（一覧・詳細で共用）。
  - official-artwork URL を jsDelivr 形式で生成し、読み込み失敗時は通常スプライト (`pokemon/{id}.png`) へフォールバック。
  - `PokemonCard.tsx` / `DetailHero.tsx` の `<img>` を `PokemonSprite` に置き換え。
- **理由**:
  - PokeAPI の JSON に含まれる画像 URL は GitHub raw 向けであり、大量同時取得に向かないため。
  - jsDelivr は `PokeAPI/sprites` リポジトリを CDN 配信しており、画像取得の CDN 役を担えるため。
  - Workers の `/api/*` キャッシュは JSON 用。画像まで Worker プロキシする必要はない（jsDelivr が既に CDN）。
- **状態**: ✅ 現行

### 🌏 日本語検索データソースの PokeAPI CSV 移行
- **決定**: 日本語名マッピングを `fanzeyi/pokemon.json` から PokeAPI 公式 CSV（jsDelivr 経由）へ変更。
- **経緯**: 外部 JSON が809件（メルメタルまで）で止まっており、第8・9世代の日本語検索（例: ニャオハ）がヒットしなかった。
- **変更内容**: `pokemon_species_names.csv` を1リクエストで取得し、`local_language_id=11`（日本語）を ID キーのマッピングに変換。
- **理由**: PokeAPI 公式データで1025種族すべての日本語名をカバーでき、追加 API 呼び出しなしで済むため。
- **状態**: ✅ 現行（`usePokemonList.ts`）

### 🔄 SPA リロード時の `/200` NotFound 修正
- **決定**: `wrangler.jsonc` に `not_found_handling: single-page-application` と `run_worker_first: ["/api/*"]` を追加。Worker 内の手動 `200.html` フォールバックを削除。
- **経緯**: `/pokemon/charizard` 等をリロードすると `/200` へリダイレクトされ NotFound 表示。Worker が `200.html` を取得すると Cloudflare Assets が 307 で `/200` へ飛ばしていた。
- **理由**: Cloudflare 公式 SPA 設定なら `index.html` を同一 URL で返せる。`/api/*` のみ Worker 優先、それ以外は Assets に委譲。
- **状態**: ✅ 現行

## 📅 2026-07-07

### ⚛️ React Compiler v1.0 の導入
- **決定**: `babel-plugin-react-compiler` と `@rolldown/plugin-babel` を devDependency に追加し、`vite.config.ts` で `reactCompilerPreset()` を有効化。
- **変更内容**:
  - ESLint を `eslint-plugin-react-hooks` の `recommended-latest` preset に更新（Compiler 最適化不可コードの検出）。
  - 詳細画面 hook（`usePokemonDetailPage`）から手書き `useMemo` を削除（Compiler が自動メモ化）。
- **理由**:
  - React 19 環境で、軽い derived state 向けの手書き `useMemo` を減らし、コードを素直に保つため。
  - ビルド時にコンポーネント・hook を自動最適化し、将来のパフォーマンス改善を標準化するため。
- **注意**: ランタイム依存ではなく **ビルド時のみ** 動作。React DevTools の `Memo ✨` バッジで最適化を確認できる。
- **状態**: ✅ 現行

## 📅 2026-07-08

### ✨ 詳細画面への覚え技リスト追加と作品選択の共通化
- **決定**: 詳細画面に覚え技セクション（`MovesSection`）を追加。図鑑説明用だった作品コンボを `DetailVersionSelect` としてページ共通設定に昇格し、図鑑説明・覚え技の両方が連動するようにした。
- **変更内容**:
  - `fetchVersion` / `fetchMove` を `pokeApi.ts` に追加。`PokemonDetail` に `moves` 配列を型追加。
  - `usePokemonDetailPage` で `activeVersion` → `fetchVersion` → `version_group` を解決し、`getMovesForVersionGroup` で覚え技をフィルタ。
  - `useMoveDetails` が `useQueries` で技詳細（威力・命中・属性・区分）を取得。`MovesSection` で覚え方ごとにテーブル表示。
  - `FlavorTextSection` から作品 `<select>` を削除（表示のみ）。
- **理由**:
  - PokeAPI の覚え技は `version_group` 単位、図鑑説明は `version` 単位のため、UI は version を維持しつつ技側だけ `fetchVersion` で変換する。
  - 覚え方（レベルアップ / わざマシン / 教え技 / タマゴ等）はすべて表示。属性タイプとダメージ区分の両方を表示。
- **v1 の制限**: 技の威力・命中は `/move/{name}` の現在値のみ。世代別 `past_values` は未反映。
- **状態**: ✅ 現行

### ♻️ Record ルックアップテーブルの命名整理
- **決定**: プレーンオブジェクト（`Record<string, T>`）の変数名から `Map` サフィックスを廃止し、`xxxByKey` 形式に統一。
- **変更内容**: `moveMap` → `movesByName`（`useMoveDetails` / `MovesSection`）、`namesMap` → `localizedNamesById`（`usePokemonList.ts`）。
- **理由**: `Map` は JavaScript の `Map` オブジェクトと紛らわしいため。`groupMovesByLearnMethod` 内の `new Map()` は実際の Map なのでそのまま。
- **状態**: ✅ 現行（詳細画面の技詳細取得は 2026-07-09 BFF 移行により `useMoveDetails` は削除）

## 📅 2026-07-09

### ✨ 詳細画面 BFF 導入（`/api/ui/pokemon/:name`）
- **決定**: 詳細画面のデータ取得・成型を Cloudflare Worker の BFF に移行。一覧・`PokemonCard` は従来どおり `/api/v2` プロキシ（または dev 直叩き）を維持。
- **変更内容**:
  - Worker ルーター: `/api/ui/*` → BFF、`/api/v2/*` → PokeAPI プロキシ、`/*` → 静的 Assets。
  - `GET /api/ui/pokemon/:name?lang=ja|en&version=` が `PokemonDetailView`（表示用 JSON）を返す。
  - 成型ロジック（図鑑説明・覚え技・ローカライズ）を `src/bff/` に集約。pure 関数は `src/shared/detail/` を FE/Worker で共有。
  - FE: `usePokemonDetailPage` が `fetchPokemonDetailView` の 1 クエリに簡素化。`useMoveDetails` 削除。
- **理由**:
  - PokeAPI 生 JSON と複数リクエストの複雑さを FE から排除し、詳細画面を 1 リクエストで描画可能にする。
  - プロキシと BFF を併存させ、効果の大きい詳細画面から段階的に移行する。
- **v1 の制限**: 技の威力・命中は `past_values` 未反映（従来どおり）。
- **状態**: ✅ 現行

### ♻️ 詳細画面 hook の `$name.tsx` への統合
- **決定**: BFF 化後に薄くなった `usePokemonDetailPage` を削除。`$name.tsx` に `useQuery` + 作品選択 state を直書き。
- **理由**: hook の責務が配線のみになり、1ファイルにまとめた方が追いやすい。
- **状態**: ✅ 現行
