# Womery

ADHDの人を支援する「外付け脳」ツール。日常の選択を減らし、本来集中すべき活動にエネルギーを使えるようにする。

## 概要

**Womery（ウーメリー）** は、Working Memory（ワーキングメモリ）から派生した名称です。ADHDの人が苦手とするワーキングメモリを外部化し、補完するツールを提供します。

### コンセプト

> 「未来の自分を一切信用しない」
> 「脳のメモリを記憶に使わない、全て外部化する」

### 主な機能

- **クイックメモ**: 即時に記録できるメモ機能
- **ルーティン管理**: 時間ベースのルーティン管理
- **持ち物管理**: 忘れ物を防ぐ持ち物チェックリスト
- **タグ付け**: メモの整理・検索機能

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js + TypeScript |
| バックエンド | Kotlin + Spring Boot 3.2+ |
| データベース | PostgreSQL 15+ |
| コンテナ | Docker / Docker Compose |
| CI/CD | GitHub Actions |

## 開発環境のセットアップ

### 前提条件

- Docker Desktop または OrbStack
- Git

### 開始手順

```bash
# リポジトリをクローン
git clone https://github.com/Shuyawa89/womery.git
cd womery

# Docker Composeで起動
docker compose up -d

# バックエンド: http://localhost:8080
# フロントエンド: http://localhost:3000
```

### サービスの操作

```bash
# 全サービスを起動
docker compose up -d

# バックエンドのみ再ビルド
docker compose up -d --build backend

# サービスを停止
docker compose down

# ボリュームを削除して初期化
docker compose down -v
```

### ログの確認

```bash
# バックエンドのログ
docker compose logs backend -f

# フロントエンドのログ
docker compose logs frontend -f
```

## プロジェクト構成

```
womery/
├── backend/          # Kotlin + Spring Boot
│   └── src/main/kotlin/com/example/womery/
│       ├── api/      # REST Controllers
│       ├── service/  # Business Logic
│       ├── domain/   # Domain Models
│       └── repository/# Data Access
├── frontend/         # Next.js + TypeScript
│   ├── app/         # App Router
│   ├── components/  # React Components
│   └── lib/         # Utilities
├── docs/            # プロジェクトドキュメント
└── docker-compose.yml
```

## ドキュメント

- [技術選定書](docs/01_tech-stack.md)
- [アーキテクチャ設計](docs/02_architecture-decisions.md)
- [要件定義](docs/03_requirements.md)
- [ドメイン設計](docs/04_domain-design.md)

## 開発ガイドライン

### Git Flow

- `main`: 本番環境（常にデプロイ可能）
- `develop`: 開発統合ブランチ
- `feature/*`: 機能開発ブランチ（`develop`から作成）

### コミットメッセージ

```
<type>: <description>

- feat: 新機能
- fix: バグ修正
- refactor: リファクタリング
- docs: ドキュメント更新
- test: テスト追加/修正
- chore: その他
```

## ライセンス

MIT License
