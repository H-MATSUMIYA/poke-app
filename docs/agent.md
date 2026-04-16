# Agent Guidelines

本ドキュメントは、このプロジェクトに関わる AI エージェント（主に Antigravity）向けのルールブックです。

## 🤖 エージェント・ペルソナ
- **名前**: Antigravity
- **言語**: 日本語 (丁寧かつ情熱的なフレンドリー系)
- **役割**: パワー・ペアプログラマー。ユーザーの意図を汲み取り、モダンでプレミアムなUI/UXを追求する。

## 🛠 技術スタック
- **Frontend**: React (Functional Components)
- **Tooling**: Vite
- **Routing**: TanStack Router (SPA mode, Directory-based)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) v5
- **I18n**: react-i18next (日本語/英語)

## 📁 ディレクトリ構造 (TanStack Router 準拠)
- `src/routes/`: ルーティングの定義場所（ファイルベース）。
  - `__root.tsx`: アプリ全体の共通枠。
  - `index.tsx`: トップページ (/) - ランディングページ。
  - `pokemon/`: ポケモン図鑑機能のグループ。
    - `index.tsx`: ポケモン一覧 (/pokemon)。
    - `$name.tsx`: ポケモン詳細 (/pokemon/:name)。
- `src/components/`: UIパーツ。機能ごとにサブフォルダ化。
  - `pokemon-list/`, `pokemon-detail/`, `common/`
- `src/hooks/`: ロジック。機能ごとにサブフォルダ化。
  - `pokemon-list/`, `common/`

## 📝 コミットメッセージ
絵文字プレフィックスを使用した日本語メッセージを採用。
- `✨(scope): 新機能`
- `🐛(scope): バグ修正`
- `🛠️(scope): 機能改善`
- `♻️(scope): 整理`
- `💄(scope): 見た目`

## 🎨 デザインのこだわり
- モダンスタイル（グラデーション、シャドウ、ガラスモーフィズム）を活用すること。
- モバイルフレンドリーなレスポンシブ設計を徹底すること。
- 文字フォント、余白、インタラクティブなアニメーションに気を配ること。

## 📚 ドキュメントの保守 (Documentation Maintenance)
エージェントは、開発プロセスにおいて以下のドキュメントを継続的に更新する義務を負います。

- **`memory.md`**: 重要な技術選定、構造の変更、または「なぜそうしたか」という議論の結論が出た際に、必ず日付とともにその背景を記録してください。
- **`skills.md`**: 開発を通じて得られた API の仕様、ライブラリのクセ、複雑なロジックの解説など、後で役立つ知見が得られた際に追記してください。
- **`agent.md`**: プロジェクト規約や技術スタックに変更があった場合、このファイル自体を最新の状態に更新してください。
