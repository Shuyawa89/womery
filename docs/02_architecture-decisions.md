# アーキテクチャ決定記録（ADR）

## 概要

本ドキュメントは、アーキテクチャに関する重要な決定事項を記録する。
ADR（Architecture Decision Record）形式で、各決定の背景・理由・結果を追跡可能にする。

---

## ADR-001: クリーンアーキテクチャの採用

### ステータス

採用決定

### コンテキスト

- 学習目的として、ドメインロジックとインフラストラクチャを分離する設計を体験したい
- 将来的なテスタビリティと保守性を確保したい
- エンタープライズ開発でのリアーキテクチャに必要な知識を習得したい

### 決定

クリーンアーキテクチャを採用し、以下のレイヤー構成とする。

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation                           │
│                  (Controllers, Views)                       │
├─────────────────────────────────────────────────────────────┤
│                      Application                            │
│              (Use Cases, Application Services)              │
├─────────────────────────────────────────────────────────────┤
│                        Domain                               │
│        (Entities, Value Objects, Domain Services)           │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure                          │
│          (Repositories実装, External Services)              │
└─────────────────────────────────────────────────────────────┘
```

### 依存関係のルール

- 内側のレイヤーは外側のレイヤーに依存しない
- Domain層は他のどのレイヤーにも依存しない
- 依存の方向は常に外側から内側へ

### 結果

- ドメインロジックがフレームワーク（Spring Boot）から独立
- ユニットテストが書きやすくなる
- レイヤー間の境界が明確になり、責務が分離される

### トレードオフ

- レイヤー間のデータ変換（DTO ↔ Entity ↔ Domain Model）が増える
- 小規模なアプリケーションにはオーバーエンジニアリングになる可能性
- 学習コストがかかる

---

## ADR-002: DDD（ドメイン駆動設計）の採用

### ステータス

採用決定

### コンテキスト

- ビジネスロジック（ルーティン管理、スケジュール計算）をコードで適切に表現したい
- ユビキタス言語を確立し、仕様とコードの乖離を防ぎたい
- 将来の機能拡張に対応できる柔軟なモデルを構築したい

### 決定

DDDの戦術的パターンを採用する。

#### 採用するパターン

| パターン | 用途 |
|---------|------|
| Entity | 識別子を持つオブジェクト（例：Routine, Task） |
| Value Object | 値で等価性を判断するオブジェクト（例：TimeSlot, RoutineType） |
| Aggregate | トランザクション境界となるEntityの集合 |
| Repository | Aggregateの永続化を抽象化 |
| Domain Service | Entityに属さないドメインロジック |
| Domain Event | ドメイン内で発生したイベント（将来拡張用） |

#### Aggregate設計の方針

- Aggregateは小さく保つ
- Aggregate間の参照はIDで行う（オブジェクト参照ではなく）
- 1トランザクション = 1 Aggregate の更新を原則とする

### 結果

- ビジネスロジックがドメイン層に集約される
- コードがビジネス要件を直接表現する
- 変更に強い設計になる

### トレードオフ

- 学習コストが高い
- 過度な抽象化に陥るリスク
- 小規模なCRUD機能にはオーバーキル

---

## ADR-003: CQRSの採用

### ステータス

採用決定

### コンテキスト

- 読み取り（ルーティン表示）と書き込み（ルーティン登録・更新）で求められるデータ形式が異なる
- 読み取り時はフラットなDTO、書き込み時はドメインモデル経由で処理したい
- DDDのドメインモデルを純粋に保ちたい

### 決定

CQRS（Command Query Responsibility Segregation）を採用する。

#### 構成

```
┌──────────────────────────────────────────────────────────────────┐
│                         Application                              │
│  ┌────────────────────────┐    ┌────────────────────────────┐   │
│  │     Command Side       │    │       Query Side           │   │
│  │  ┌──────────────────┐  │    │  ┌──────────────────────┐  │   │
│  │  │  Command Handler │  │    │  │    Query Handler     │  │   │
│  │  └────────┬─────────┘  │    │  └──────────┬───────────┘  │   │
│  │           ↓            │    │             ↓              │   │
│  │  ┌──────────────────┐  │    │  ┌──────────────────────┐  │   │
│  │  │  Domain Model    │  │    │  │    Read Model (DTO)  │  │   │
│  │  └────────┬─────────┘  │    │  └──────────┬───────────┘  │   │
│  │           ↓            │    │             ↓              │   │
│  │  ┌──────────────────┐  │    │  ┌──────────────────────┐  │   │
│  │  │   Repository     │  │    │  │    Query Repository  │  │   │
│  │  └────────┬─────────┘  │    │  └──────────┬───────────┘  │   │
│  └───────────┼────────────┘    └─────────────┼──────────────┘   │
│              ↓                               ↓                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      PostgreSQL                           │  │
│  │          （同一DBだが、論理的に分離）                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

#### 今回の採用レベル

**シンプルなCQRS**（同一DB、同一テーブル）を採用する。

- Command側: Domain Model → Repository → DB
- Query側: DB → Query Repository → DTO（Domain Modelを経由しない）

Event Sourcingや物理的なDB分離は採用しない（複雑性が高すぎるため）。

### 結果

- 読み取りはシンプルなクエリで高速に処理
- 書き込みはドメインモデルを経由してビジネスルールを適用
- 読み取り用DTOと書き込み用ドメインモデルを独立して最適化可能

### トレードオフ

- コード量が増える（Command用とQuery用で分離）
- 単純なCRUDに対してはオーバーエンジニアリング
- チーム全員がパターンを理解する必要がある

---

## ADR-004: パッケージ構成

### ステータス

採用決定

### 決定

以下のパッケージ構成を採用する（Kotlin/Spring Boot）。

```
com.example.app/
├── application/
│   ├── command/           # コマンドハンドラー
│   │   ├── routine/
│   │   │   ├── CreateRoutineCommand.kt
│   │   │   └── CreateRoutineCommandHandler.kt
│   │   └── task/
│   └── query/             # クエリハンドラー
│       ├── routine/
│       │   ├── GetDailyRoutineQuery.kt
│       │   └── GetDailyRoutineQueryHandler.kt
│       └── task/
├── domain/
│   ├── model/
│   │   ├── routine/
│   │   │   ├── Routine.kt           # Aggregate Root
│   │   │   ├── RoutineId.kt         # Value Object
│   │   │   ├── RoutineItem.kt       # Entity
│   │   │   └── TimeSlot.kt          # Value Object
│   │   └── task/
│   ├── repository/
│   │   ├── RoutineRepository.kt     # Interface
│   │   └── TaskRepository.kt
│   └── service/
│       └── RoutineScheduleService.kt
├── infrastructure/
│   ├── persistence/
│   │   ├── entity/                  # JPA Entity
│   │   ├── repository/              # Repository実装
│   │   └── query/                   # Query用Repository
│   └── external/
│       └── homeassistant/           # 外部連携（将来）
└── presentation/
    ├── api/
    │   ├── RoutineCommandController.kt
    │   └── RoutineQueryController.kt
    └── dto/
        ├── request/
        └── response/
```

### 理由

- クリーンアーキテクチャのレイヤーが明確に分離される
- CQRSのCommand/Query分離がパッケージ構成に反映される
- 機能追加時にどこにコードを追加すべきかが明確

---

## ADR-005: 3層アーキテクチャへの簡略化（MVP向け）

### ステータス

採用決定（ADR-003を上書き）

### コンテキスト

- MVPは迅速にリリースする必要がある
- 現在のCQRS設計は、単一ユーザーアプリケーションでは測定可能なメリットなく複雑さを増している
- 同一DB、同一テーブルでのCQRSは効果が限定的
- フルDDDはMVPの規模（9機能、単一ユーザー）にはオーバーキル
- 「分析麻痺」のリスクを回避し、実装を開始する必要がある

### 決定

CQRSを削除し、シンプルな3層アーキテクチャを使用する。

#### 変更前（ADR-003での設計）
```
Presentation → Application (Command/Query) → Domain → Infrastructure
     CQRS分離、フルDDD戦術パターン
```

#### 変更後（本ADR）
```
Presentation → Service → Repository → Domain Model
     シンプルな3層、リッチなドメインオブジェクト
```

#### 新しいパッケージ構成

```
com.example.womery/
├── api/                          # Presentation層
│   ├── QuickMemoController.kt
│   └── dto/
│       ├── request/
│       └── response/
├── service/                      # Service層
│   └── QuickMemoService.kt
├── repository/                   # Repository層
│   └── QuickMemoRepository.kt
└── domain/                       # Domain層（フレームワーク非依存）
    └── model/
        └── QuickMemo.kt
```

### 維持すべきもの

- **Kotlin + Spring Boot** - キャリア学習の目標
- **ドメインモデルの概念** - Kotlin data classとしてエンティティを表現
- **クリーンな分離** - ドメイン層にフレームワークコードを入れない
- **Repository パターン** - データアクセスの抽象化

### 削除・簡略化するもの

- **CQRS** - 単一ユーザー、同一DBアプリでは不要
- **分離されたCommand/Queryハンドラー** - 統一されたサービス層を使用
- **複雑なアグリゲートパターン** - シンプルに始め、必要に応じて進化

### 結果

- 開発が高速化（3-4ヶ月 → 6-8週間の見積もり）
- ボイラープレートが大幅に減少
- 学習目標（Kotlin + Spring Boot）は維持
- 将来必要になったらCQRSやアグリゲートパターンを追加可能

### トレードオフ

- 複雑なドメインロジックには後から再設計が必要になる可能性
- エンタープライズパターンの学習機会が減少
- 将来的なスケーラビリティよりもMVPの速度を優先

### 参照

- ADR-003（本ADRにより上書き）
- ADR-004（パッケージ構成が本ADRにより更新）

---

## 今後の検討事項

- [ ] Domain Eventの導入（機能間の疎結合化）
- [ ] Event Sourcing の必要性評価（現時点では不採用）
- [ ] 読み取り専用DBの分離（スケーラビリティが必要になった場合）
- [ ] CQRSの再導入（スケールが必要になった場合）
