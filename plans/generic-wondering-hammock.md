# Womery アーキテクチャ見直しと推奨事項

## 概要

現在のアーキテクチャ（Clean Architecture + DDD + CQRS）はエンタープライズパターンの学習としては適切ですが、**MVPには過剰設計**です。本プランでは、学習機会を維持しながら、より早くリリースするための簡略化を提案します。

---

## 現状分析

### 良い点
- 要件とドメイン理解がしっかりドキュメント化されている
- ユビキタス言語が明確に確立されている
- ADR（Architecture Decision Record）の実践が優れている
- 技術選定がキャリア目標と一致している（Kotlin + Spring Boot）

### 課題
1. **CQRSはメリットなく複雑さを増やす** - 同一DB、同一テーブルでは効果が限定的
2. **フルDDDはMVPの規模にはオーバーキル** - 9機能、単一ユーザー
3. **Bounded Contextが未定義** - 設計が未完了
4. **コードが未実装** - 「分析麻痺」のリスク

---

## 推奨アーキテクチャ簡略化

### 変更前（現在の設計）
```
Presentation → Application (Command/Query) → Domain → Infrastructure
     CQRS分離、フルDDD戦術パターン
```

### 変更後（推奨）
```
Presentation → Service → Repository → Domain Model
     シンプルな3層、リッチなドメインオブジェクト
```

### 維持すべきもの
- **Kotlin + Spring Boot** - キャリア学習の目標
- **Next.js + TypeScript** - PWAサポート、型安全性
- **PostgreSQL** - JSONBの柔軟性
- **ドメインモデルの概念** - Kotlin data classとしてエンティティを表現
- **クリーンな分離** - ドメイン層にフレームワークコードを入れない

### 削除・簡略化すべきもの
- **CQRS** - 単一ユーザー、同一DBアプリでは不要
- **分離されたCommand/Queryハンドラー** - 統一されたサービス層を使用
- **複雑なアグリゲートパターン** - シンプルに始め、必要に応じて進化

---

## 提案するBounded Context

ドメイン分析に基づき、以下のコンテキストを推奨：

```
┌─────────────────────────────────────────────────────────────┐
│                      Womery                                  │
├────────────────┬────────────────┬───────────────────────────┤
│ スケジュール   │   キャプチャ   │      チェックリスト       │
│ コンテキスト   │   コンテキスト │      コンテキスト         │
├────────────────┼────────────────┼───────────────────────────┤
│ - Routine      │ - QuickMemo    │ - Belonging               │
│ - RoutineItem  │ - Inbox        │ - BelongingCheck          │
│ - DailySchedule│ - Task         │                           │
│ - WorkLocation │ - Memo         │                           │
└────────────────┴────────────────┴───────────────────────────┘
```

### アグリゲートルート
| コンテキスト | アグリゲートルート | エンティティ/VO |
|-------------|-------------------|-----------------|
| スケジュール | Routine | RoutineItem, TimeSlot, RoutineType |
| スケジュール | DailySchedule | WorkLocation |
| キャプチャ | QuickMemo | (単体) |
| キャプチャ | Task | DueDate |
| キャプチャ | Memo | (単体) |
| チェックリスト | Belonging | ApplicableLocations |
| チェックリスト | BelongingCheck | CheckItem |

---

## 実装戦略: Vertical Slice

レイヤーごとではなく、機能ごとにエンドツーエンド（UI → API → DB）で実装する。

### MVP実装の推奨順序

| フェーズ | 機能 | 理由 |
|---------|------|------|
| **1** | F-007: クイック入力 | 核となる価値提案、フルスタック検証 |
| **1** | F-008: Inbox表示 | キャプチャフローの完成 |
| **2** | F-002: ルーティン登録 | スケジュールの基盤 |
| **2** | F-001: ルーティン表示 | タイムグリッドUI |
| **3** | F-003: 勤務場所選択 | シンプルなUI |
| **3** | F-004: ルーティン自動切替 | 場所とルーティンの連携 |
| **4** | F-005: 持ち物登録 | シンプルなCRUD |
| **4** | F-006: 持ち物チェック | チェックリストUI |
| **5** | F-009: 翌日準備確認 | 統合機能 |

### フェーズ1の詳細（クイック入力 + Inbox）
```
作成するファイル:

バックエンド (Kotlin/Spring Boot):
  - domain/model/QuickMemo.kt
  - service/QuickMemoService.kt
  - repository/QuickMemoRepository.kt
  - api/QuickMemoController.kt

フロントエンド (Next.js):
  - app/quick-input/page.tsx
  - app/inbox/page.tsx
  - components/QuickInputButton.tsx
  - api/quickMemos.ts (APIクライアント)

データベース:
  - migrations/001_create_quick_memos.sql
```

---

## 更新されるADR提案

### ADR-005: 3層アーキテクチャへの簡略化（提案）

**コンテキスト**: MVPは迅速にリリースする必要がある。現在のCQRS設計は、単一ユーザーアプリケーションでは測定可能なメリットなく複雑さを増している。

**決定**: CQRSを削除し、シンプルな3層アーキテクチャを使用:
- Presentation（コントローラー）
- Service（ビジネスロジック）
- Repository（データアクセス）
- Domain（Kotlin data class、フレームワーク非依存）

**結果**:
- 開発が高速化
- ボイラープレートが減少
- スケールが必要になったらCQRSを追加可能

---

## 見積もり期間

| アプローチ | MVP完成まで |
|----------|------------|
| 現行（フルDDD/CQRS） | 3-4ヶ月 |
| **推奨（簡略化）** | **6-8週間** |
| Next.jsのみ | 3-4週間 |

---

## 決定事項

1. **CQRS削除**: 承認済み - MVPには簡略化された3層アーキテクチャを使用
2. **認証方式**: 後で決定 - 認証なしで開始し、後で追加
3. **開始点**: クイック入力（F-007）を最初の機能として実装

---

## 検証プラン

フェーズ1実装後:
1. バックエンド起動: `./gradlew bootRun`
2. フロントエンド起動: `npm run dev`
3. クイック入力フローのテスト: アプリ開く → FABタップ → テキスト入力 → 保存 → Inboxで確認
4. DB検証: `quick_memos`テーブルに新規レコードがあることを確認
5. テスト実行: `./gradlew test`（バックエンド）、`npm test`（フロントエンド）

---

## 次のステップ（承認後）

1. `02_architecture-decisions.md`にADR-005を追加
2. Kotlin/Spring Bootプロジェクト構造を初期化
3. Next.jsプロジェクトをTypeScriptで初期化
4. ローカルPostgreSQL用のDocker Composeをセットアップ
5. フェーズ1を実装（クイック入力 + Inbox）
