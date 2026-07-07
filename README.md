# ポケモン図鑑アプリケーション (Pokédex App)

React + TypeScript + Vite で作成されたモダンなポケモン図鑑アプリケーションです。React Compiler（v1.0）によりビルド時に自動メモ化されます。

## コミット規約

絵文字プレフィックス付きの日本語メッセージを使用。詳細は [agent.md](./docs/agent.md#コミットメッセージ) を参照。

---

## 開発環境のセットアップ

### インストール
```bash
npm install
```

### 開発サーバー（通常）

UI やフィルターなどの日常開発向け。Vite のみ起動し、PokeAPI には直接アクセスします。

```bash
npm run dev
```

### 本番同等の確認（Cloudflare Workers）

プロキシ・キャッシュ・SPA フォールバックを含む本番に近い動作をローカルで確認する場合。

```bash
npm run preview:worker
```

`dist` をビルドしたうえで Wrangler を起動します。すでに `dist` がある場合は `npm run dev:worker` でも可。

| コマンド | 用途 |
|---|---|
| `npm run dev` | 通常開発（Vite、PokeAPI 直叩き） |
| `npm run preview:worker` | ビルド + Workers ローカル起動 |
| `npm run dev:worker` | Workers ローカル起動のみ（要 `dist`） |

### 本番デプロイ

#### 通常（Git 連携）

`main` 等へ **push すると Cloudflare が自動でビルド・デプロイ** します。日常運用ではこれだけで十分です。

#### 手動デプロイ（任意）

自動デプロイの障害時や、ローカルから直接上げたい場合のみ使用します。

```bash
npm run deploy
```

初回のみ Cloudflare へのログインが必要です（`npx wrangler login`）。

| 方法 | 使うコード | デプロイ先 |
|---|---|---|
| Git push | リポジトリに push された内容 | `wrangler.jsonc` の Worker（`poke-app`） |
| `npm run deploy` | **手元のローカル**（未コミット・未 push 含む） | 上記と**同じ本番 Worker** |

**注意**: 手動デプロイは本番を上書きします。push せずに実行すると、リポジトリと本番の内容がずれるため、通常は Git 連携に任せてください。

---

## 🤖 AIエージェント向けドキュメント (Agent Specs)

このプロジェクトを AI エージェントがメンテナンスするための「秘伝の書」です。

- [Agent Guidelines (agent.md)](./docs/agent.md): プロジェクトの基本方針と行動規約
- [Decision Memory (memory.md)](./docs/memory.md): 過去の重要な意思決定の記録
- [Agent Skills (skills.md)](./docs/skills.md): ポケモンAPIや実装に関する技術的知見
