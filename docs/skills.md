# Agent Skills & Knowledge

ポケモンのデータ構造や特定のライブラリに関するテクニカルな知見集です。
ディレクトリ構造などの規約は `agent.md` を参照してください。

## 🧬 PokeAPI の知識

### フォルムと種族の関係
- `/pokemon/[id or name]` エンドポイントで取得できるのは「姿（フォーム）」のデータ。
- `/pokemon-species/[id or name]` エンドポイントで取得できるのは「種族」のデータ（日本語名や説明文など）。
- 特殊な姿を持つポケモン（ラブトロス、ジガルデなど）は、必ず `species.url` から種族データを取得すること。

### スプライト画像と CDN
- PokeAPI の JSON レスポンスには画像ファイル本体は含まれず、`sprites.other['official-artwork'].front_default` 等に **URL 文字列** が入る。
- その URL は `raw.githubusercontent.com/PokeAPI/sprites/...`（GitHub raw）を指す。**API の URL をそのまま `<img src>` に使わないこと** — 一覧で同時大量取得すると 429 になりやすい。
- 実際の画像ファイルは GitHub 上の [`PokeAPI/sprites`](https://github.com/PokeAPI/sprites) リポジトリに置かれている。
- 本プロジェクトでは jsDelivr CDN URL を `PokemonSprite` で組み立てる:
  - 公式イラスト: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/{id}.png`
  - フォールバック: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/{id}.png`
- 実装: `src/components/common/PokemonSprite.tsx` — official-artwork を先に試し、`onError` で通常スプライトへ切り替える。
- Workers の `/api/*` プロキシは JSON 用のみ。画像は jsDelivr が CDN 役を担うため Worker 経由にしない。

### 世代の区切り (Generation Boundaries)
世代フィルターは ID 範囲で絞り込む。定義は `usePokemonList.ts` の `GENERATIONS` が正。
- **第1世代**: 1 - 151 (カントー)
- **第2世代**: 152 - 251 (ジョウト)
- **第3世代**: 252 - 386 (ホウエン)
- **第4世代**: 387 - 493 (シンオウ)
- **第5世代**: 494 - 649 (イッシュ)
- **第6世代**: 650 - 721 (カロス)
- **第7世代**: 722 - 809 (アローラ)
- **第8世代**: 810 - 898 (ガラル)
- **LEGENDS**: 899 - 905 (ヒスイ)
- **第9世代**: 906 - 1025 (パルデア)

## ⚛️ React & TanStack Query パターン

### 一覧のフィルター・ページング (`usePokemonList.ts`)
- **全件リスト**: `/pokemon?limit=1500` で取得。レスポンスにタイプ情報は含まれない。
- **タイプフィルター**: `/type/{type}` を `fetchType` で取得し、返却されたポケモン名リストと全件リストを突き合わせる。`typeFilter` が空のときはフェッチしない（`enabled: !!typeFilter`）。
- **世代フィルター**: `GENERATIONS` の ID 範囲でクライアント側フィルター。
- **検索**: 外部 JSON（GitHub）で日本語名マッピングを構築し、英語名・ID・日本語名で絞り込む。
- **ページング**: API の offset ページングではなく、絞り込み済み配列を `useInfiniteQuery` で 20 件ずつ `slice` する。無限スクロールの状態管理に React Query を利用している。

### 無限スクロールのトリガー
- スクロール位置の計算: `scrollTop + clientHeight >= scrollHeight - 300`
- `fetchNextPage` を呼び出す際は必ず `hasNextPage && !isFetchingNextPage` をチェックして多重実行を防ぐこと。

### データ取得の使い分け (loader vs useQuery)
TanStack Router と React Query を組み合わせる際の基準：

1. **`loader` を使うべきケース (詳細画面など)**
    - **目的**: 遷移後の画面を「完成した状態」で見せる。
    - **やり方**: `queryClient.ensureQueryData` を使用して遷移前にキャッシュを確保する。
    - **注意**: 取得が重いと「クリック後の遷移」が遅れるため、データ量が少ない場合に推奨。

2. **`useQuery` (コンポーネント内) のみで良いケース (大規模な一覧など)**
    - **目的**: ユーザーの操作に即座に反応し、読み込み状況を可視化する。
    - **やり方**: ローディングスケルトンやアニメーションを併用する。

## 🛣 TanStack Router

### コロケーションの `-` プレフィックス
- フォルダ名やファイル名を `-` (ハイフン) または `_` (アンダースコア) で始めると、ルーターの自動生成対象から除外できる。
- 画面専用コンポーネントは `-index/` や `-$name/` 配下に置く（詳細は `agent.md`）。

### Zod を活用した Search Params バリデーション
TanStack Router の `validateSearch` に Zod を使用することで、URLからの入力を型安全かつ堅牢に扱える：

- **スキーマ定義**: `z.object({ ... })` でパラメータを定義。
- **catch() の活用**: `.catch('')` や `.catch(defaultValue)` を使用することで、ユーザーがURLを直接編集して不正な値を入力しても、アプリをクラッシュさせずにデフォルト値へフォールバックできる。
- **navigate での更新**: `navigate({ search: (prev) => ({ ...prev, type: 'fire' }) })` のように関数形式で更新することで、他の既存の検索パラメータを維持したまま特定の値を変更できる。
- **IME（日本語入力）対策**: `onChange` で即座に `navigate` を実行すると、再レンダリングによりIMEの変換状態がリセットされる。`useDebouncedSync` でローカル状態とデバウンス同期する。

### デバウンス同期パターン (`useDebouncedSync`)
URL Search Params や Props とローカルの `input` 状態を同期させる際のパターン：
- **課題**: `onChange` で即座に外部状態（URLなど）を更新すると、再レンダリングによりIMEの変換が壊れたり、APIリクエストが過剰に発生したりする。
- **解決策**: ローカル状態（即時反映）と外部同期（デバウンス反映）の二段構えにする。
- **実装**: `useDebouncedSync` フック（`src/hooks/common/useDebouncedSync.ts`）。

## 🌏 多言語対応 (i18n)
- `i18next` を使用。設定は `src/i18n/config.ts`、文言は `src/locales/`。
- ポケモン個別の日本語名は `usePokemonList.ts` 内で外部JSONデータを活用してマッピングを行っている。

## ☁️ Cloudflare Workers & Cache API

### PokeAPI プロキシ (`src/worker.ts`)
- `/api/*` を `https://pokeapi.co/api/*` にプロキシし、Cache API でエッジキャッシュする。
- キャッシュ TTL: ブラウザ 1日 (`max-age=86400`)、エッジ 7日 (`s-maxage=604800`)。
- デバッグ: レスポンスヘッダー `x-proxy-cache` が `HIT` / `MISS` / `BYPASS`。
- `/api/` 以外は `dist` の静的アセット配信。HTML 404 時は SPA フォールバックとして `200.html` を返す。

### 本番 / 開発の API 切り替え (`pokeApi.ts`)
- **本番** (`import.meta.env.PROD`): `BASE_URL = '/api/v2'` → Workers プロキシ経由。
- **開発** (`npm run dev`): `BASE_URL = 'https://pokeapi.co/api/v2'` → PokeAPI 直叩き。
- `fetchSpeciesByUrl` は PokeAPI 絶対 URL を本番時 `/api/` 相対パスへ変換する。

### ローカルでの Workers 確認
- 起動手順は [README.md](../README.md) を参照（`npm run preview:worker` 等）。
- `wrangler.jsonc` は `dist` をアセットとして配信するため、Workers 確認前にビルドが必要。
- レスポンスヘッダー `x-proxy-cache` でキャッシュ HIT/MISS を確認できる。

### デプロイ
- **通常**: Git push → Cloudflare が自動ビルド・デプロイ（README 参照）。
- **手動** (`npm run deploy`): ローカルから同じ本番 Worker（`poke-app`）へ直接デプロイ。未 push の変更も反映されるため、障害時などに限り使用。

### Cache API の注意点
- `cache.match()` / `cache.put()` のキーは **URL だけでなく method・headers も照合**される。
- キャッシュキー生成時に `request.headers` をそのまま渡すと、リクエストごとに別エントリになり HIT 率が下がる。**GET の URL のみ**でキーを作る。
- オリジンから返る `Vary` / `Set-Cookie` はキャッシュ保存前に削除すること。
- ローカル開発時の Wrangler 設定は `.wrangler/` に生成される（`.gitignore` 対象）。
