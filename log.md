# 開発ログ

## 2026-06-14 現在

### 実装段階

`PLAN.md` の新仕様マイルストーン **M1R: 串軌道への置き換え**、
**M2R: 三連刺しコアルール** に加え、**M3: レベル設計検証** の
5ステージ実装と到達可能性の自動検証まで実装済み。

現状は、空の串を発射し、先端で球を3個刺して壁へ届けるコアルールを、
異なる角度・チャージ・危険回避を要求する5ステージで検証できる。

### 実装済み

- Phaser 3、TypeScript、Viteによるゲーム基盤
- 固定画面のプレイフィールド
- マウスカーソルまたはタップ位置へ追従する砲台照準
- `Space`または画面上の発射ボタンによる長押しチャージ
- PCでのマウス移動による連続照準と左クリック発射
- スマートフォンでのプレイ領域タップによる照準保持
- 入力を離した瞬間の照準角度とチャージ量による発射
- 25〜155度の照準角度制限と照準マーカー
- 球が何も刺さっていない竹串の発射
- 重力を受ける決定論的な串軌道
- 串が進行方向へ先端を向ける描画
- 壁、天井、床への最初の接触による発射終了
- 旧仕様の壁反射と反射回数制限の廃止
- 串先端の移動線分を使った球の連続衝突判定
- 接触順に最大3個まで球を串へ固定
- 串に刺さった球を飛行中の串上へ描画
- 3個刺した状態で壁へ到達した場合のみ600点を加算
- 0〜2個で発射終了した場合の球の位置復元
- 3個刺した後でも画面外、時間切れ、爆弾なら無得点
- 同一固定ステップ内の球、爆弾、壁の接触順処理
- 串の先端、軸、刺さった球による爆弾接触判定
- 爆弾命中時の球復元、残り串-1、スコア-500
- 全球回収時の完成ボーナスと残り串ボーナス
- 残り串0かつ球が残っている場合の失敗
- 残り球、残り串、現在の取得数、スコアのHUD
- 球取得数を示す串付近の3枠インジケーター
- 完成、未完成、爆弾命中の簡易エフェクト
- S/A/B/C評価を含むクリア・失敗リザルト
- ポーズ、再開、リトライ
- PC向けキーボード操作
- スマートフォン向けタッチ操作とレスポンシブ表示
- ゲームロジックとPhaser描画の分離
- 物理ロジックとコアルールの単体テスト
- 手作りの検証用5ステージ
- ステージごとの名前、目的、球・爆弾・障害壁・残り串・基準スコア定義
- ステージごとの重力・最低初速・最高初速の上書き
- ステージごとの得点確定壁
- 串先端・軸・刺さった球を含むステージ内障害壁との連続衝突判定
- 前後ボタン、`N`、`P` による検証ステージ切り替え
- ステージ名、番号、検証目的の表示
- 各ステージの代表攻略経路を実シミュレーションで通す自動テスト

### M3検証ステージ

1. **一、まっすぐ三連**
   - 目的: 中速の素直な放物線で、三個を順番に刺して右壁へ届ける。
   - 代表経路: 55度、初速650。
2. **二、ふわり山なり**
   - 目的: 弱いチャージで頂点をまたぎ、縦にまとまった三個を拾う。
   - 代表経路: 76度、初速500。
3. **三、疾風の浅撃ち**
   - 目的: 強いチャージの浅い軌道で、遠い三個を壁際まで運ぶ。
   - 代表経路: 35度、初速860。
4. **四、板を越えて**
   - 目的: 手前の障害壁を山なりに越え、左壁へ三個を届ける。
   - 代表経路: 125度、初速700。
5. **五、火種の向こう**
   - 目的: 爆弾の上側を通し、完成後も安全な右壁まで運ぶ。
   - 代表経路: 48度、初速690。

各ステージの代表経路は固定ステップの実シミュレーションでクリアを確認済み。
必要な初速は500〜860に分散しており、最大チャージ連打を共通解にしていない。

### 現在遊べる内容

カーソルまたはタップ位置で砲台の角度とチャージ時間を調整し、左右に配置された3個一組の球を
串の先端で順番に刺す。3個刺した串を壁へ届けると得点になり、
3個未満で壁へ当たると球は元の位置へ戻る。

中央の爆弾へ触れると、その発射で刺した球が戻り、残り串とスコアに
ペナルティが入る。6個すべての球を2本以上の完成串で回収するとクリア。

### 操作

- `Space`長押し: チャージ
- `Space`を離す: 空の串を発射
- マウス移動: カーソル位置へ照準
- マウス左ボタン長押し・リリース: チャージと発射
- プレイ領域をタップ: タップ位置へ照準を保持
- 発射ボタン長押し・リリース: タッチ操作でのチャージと発射
- `Esc`: ポーズ
- `R`: リトライ
- `D`: 予測軌道表示の切り替え
- `N`: 次の検証ステージ
- `P`: 前の検証ステージ

### 起動方法

```powershell
npm install
npm run dev
```

### 検証状況

- `npm test`: 26テスト成功
- `npm run build`: 成功
- 照準位置からの角度計算、25〜155度への制限、時間経過で角度が変化しないことを単体テストで確認
- 最新の照準角度で発射し、リトライで90度へ戻ることを単体テストで確認
- 同一条件で同じ軌道になることを単体テストで確認
- 壁接触時に反射せず停止することを単体テストで確認
- 最大3個取得、4個目の無視、壁到達時の得点を単体テストで確認
- 未完成時の球復元を単体テストで確認
- 爆弾の先端・軸接触とペナルティを単体テストで確認
- 最終串での失敗、全状態のリトライ復元を単体テストで確認
- PC幅のブラウザで初期表示と未完成発射を確認
- PC幅のブラウザでマウスカーソル追従、左クリック発射、ドラッグ中の照準変更を確認
- 未完成後に残り球6、取得数0/3へ戻ることを確認
- 390×844pxで照準用キャンバスと発射ボタンが重ならないことを確認
- ブラウザコンソールのエラー・警告なし
- Viteの本番ビルドではチャンクサイズ警告のみ。ビルド自体は成功
- 5ステージすべての代表経路がクリア可能であることを自動テストで確認
- 障害壁が外周より先に串を停止させることを単体テストで確認
- 串の軸が障害壁へ触れた場合も停止することを単体テストで確認
- 各代表経路が指定された左壁・右壁・床へ到達して得点することを確認
- ステージ切り替えで名前、番号、球数、残り串が更新されることをブラウザで確認
- 390×844pxで数値HUDとステージナビの間に8pxの余白があることを確認

実機相当のタッチイベントによる「タップで照準保持」は自動ブラウザでは未検証。

### M3の未検証リスク

- 初見プレイヤーが説明なしで各ステージの狙いを理解できるかは観察プレイテストが必要
- 安全解と高得点解の選択割合、同じ失敗の反復回数は未計測
- 代表経路以外の想定外解と、球・障害壁・爆弾の見た目上の余裕は手動調整が必要
- ステージ2と3のチャージ差が数値表示なしでも十分に知覚できるかは未確認

### 未実装

次の段階は、M3の観察プレイテストと `PLAN.md` の **M4: UI・演出・モバイル対応**。

- 初見プレイヤー向けの観察プレイテストと配置調整
- 安全解と上級者向け解のスコア設計
- 正式なステージ選択・解放進行
- 球取得、完成、未完成、爆弾の効果音

### リポジトリ

- GitHub: <https://github.com/oracle991/odango>
- デフォルトブランチ: `main`
- M1初回コミット: `efb51ca Build gravity cannon M1 prototype`

## 2026-06-14 串への団子追加順を修正

- 新しく取得した団子を `attachedBallIds` の先頭へ追加し、串の先端側から順に刺さるよう修正
- 接触順が `a -> b -> c` の場合、先端から `c, b, a` になる回帰テストを追加
- `npm test`: 27テスト成功
- `npm run build`: 成功（既存のチャンクサイズ警告のみ）

## 2026-06-15 M4: UI・演出・モバイル対応

### 実装

- タイトル画面、5ステージの一覧選択、プレイHUD、ポーズ、クリア・失敗リザルト、設定画面を実装
- タイトル・ステージ選択・プレイ間の画面遷移と、ポーズ／リザルトからの導線を整理
- BGM音量、効果音音量、画面揺れ、軌道補助の設定を追加し、`localStorage` へ保存
- Web Audio APIによる仮のBGM、チャージ音、発射、球取得、完成、未完成、爆弾の効果音を追加
- 球取得数、3個完成、壁での得点確定、未完成、爆弾をDOMバナーとPhaserエフェクトの両方で表示
- 完成と爆弾に設定連動の画面揺れを追加
- 白・桜・よもぎの球に色以外の識別記号を追加
- 串の取得数を塗り分け付きの3枠表示にし、無音でも得点成立条件を追えるよう調整
- タッチ照準と独立した大型発射ボタン、Safe Area、縦長画面、低い横長画面向けのレスポンシブCSSを追加
- `load-stage` コマンドを追加し、ステージ一覧から任意ステージを直接開始可能にした

### 検証

- `npm test`: 27テスト成功
- `npm run build`: 成功（既存のPhaser由来チャンクサイズ警告のみ）
- PC 1280×720でタイトル → ステージ選択 → プレイ → ポーズの導線をブラウザ確認
- 390×844でHUDとステージ表示の間に10pxの余白があり、横スクロールが発生しないことを確認
- 390×844でプレイ領域タップ後に発射ボタンを押し、残り串が4から3へ減ることを確認
- モバイル表示で発射ボタン、ヘルプ、プレイキャンバスが重ならないことを確認
- 設定画面が390×844内に収まり、画面揺れ・軌道補助の状態を保持することを確認
- ブラウザコンソールのエラー・警告なし

### 残る確認

- 実機iOS Safari／Android Chromeでの長押し、音声再生開始、Safe Areaの最終確認
- 観察プレイテストで、初見時に「3個刺して壁へ届ける」条件と未完成時の復元が伝わるか確認

## 2026-06-15 M5: コンテンツ拡張

### 実装

- 全15ステージ、5ステージごとの3チャプター構成へ拡張
- チャプター1で基本軌道、チャプター2で複数経路・障害壁・爆弾、チャプター3で移動球と複合配置を段階導入
- ステージ定義へチャプター番号、複数の得点確定壁、球の往復移動設定を追加
- 移動球を固定ステップ内で決定論的に更新し、リトライ時に基準位置へ復元
- 得点可能な外周壁だけを金色に強調表示
- 移動球へ移動軸のガイドを表示し、通常の浮遊演出と区別
- 各ステージの代表攻略ショット列を定義し、全ステージのクリア可能性を実シミュレーションで検証
- ステージ評価計算を独立モジュール化
- `localStorage` に解放済みステージ数、各ステージのクリア状態、最高スコアを保存
- ステージクリア時に次の1ステージを解放
- ステージ一覧へロック状態、最高スコア、最高評価、チャプター表示を追加
- 未解放ステージへの通常UIからの移動を防止
- 設定データ初期化で進行データも初期化
- ステージ選択画面を「全十五景」へ更新

### 難易度構成

1. ステージ1〜5: 単一の三連刺し、弱／強チャージ、左右・床への着壁、障害壁と爆弾の導入
2. ステージ6〜10: 9〜12個の球、複数の得点壁、複数軌道の使い分け、障害物と危険物の複合
3. ステージ11〜15: 12〜15個の球、移動球、狭い経路、複数の着壁、少ない予備串による総合試験

各ステージの基準スコアは、代表攻略で残る串数と完成串数から算出し、
最少手数のクリアでS評価へ届くよう調整した。

### 検証

- `npm test`: 43テスト成功
- `npm run build`: 成功（既存のPhaser由来チャンクサイズ警告のみ）
- 全15ステージの代表攻略ショット列が、指定された得点壁へ到達してクリアできることを自動テストで確認
- 最大初速が全ステージ共通の初手正解にならないことを自動テストで確認
- 複数得点壁の許可・拒否、移動球の決定論的移動、リトライ復元を単体テストで確認
- 進行データの不正値復旧、評価計算、最高スコア保持、クリア時のみの次面解放を単体テストで確認
- PC幅で15枚のステージカードが表示され、最初の1面だけ解放されることをブラウザ確認
- 390×844pxでステージ一覧の横スクロールが発生せず、15面を縦スクロールできることを確認
- 390×844pxのプレイ画面でヘルプと発射ボタンの間に10pxの余白があることを確認
- PC・モバイル確認時のブラウザコンソールにエラー・警告なし

### 残る確認

- 観察プレイテストによる各ステージの安全解・高得点解・想定外解の確認
- ステージ11以降で移動球の周期が数値表示なしでも読み取れるか確認
- チャプター2後半からチャプター3への難易度上昇が急すぎないか確認
- 実機iOS Safari／Android Chromeで15面一覧の長時間スクロールと進行保存を確認

## 2026-06-16 M5 stage data split

### Implementation
- Split the 15 M5 stage recipes from `src/game/stage.ts` into one file per stage under `src/game/stages/`.
- Added `src/game/stages/types.ts` for `StageRecipe` / `RepresentativeShot` and `src/game/stages/buildStage.ts` for recipe-to-`StageDefinition` conversion.
- Added `src/game/stages/index.ts` as the fixed-order stage registry. Edit individual stage files for placement and route data, and edit the registry only when changing stage order or adding/removing stages.
- Kept `validationStages`, `representativeStageShots`, and `coreRulesStage` exported from `src/game/stage.ts` so existing UI, Phaser, simulation, and test imports continue to work.

### Verification
- `npm test`: 43 tests passed.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.

## 2026-06-16 Balance constants split

### Implementation
- Added `src/game/balance.ts` as the central home for shooting physics, skewer attachment tuning, scoring, rank thresholds, scoring wall defaults, and generated-stage tuning constants.
- Moved `simulationConfig` out of `src/game/config.ts`; `config.ts` now keeps layout/cannon placement and re-exports `simulationConfig` for compatibility.
- Replaced hardcoded score and penalty values in `GameSimulation`, target score calculation in `stages/buildStage`, rank thresholds in `progress`, and attached-ball spacing/radius references in simulation/rendering with `balance.ts` values.

### Verification
- `npm test`: 43 tests passed.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.

## 2026-06-16 Coordinate stage data and completion order bonus

### Implementation
- Changed M5 stage recipes from trajectory-generated ball placement to coordinate-authored `groups`, where each group owns three ball coordinates and its representative shot.
- Kept `representativeStageShots` available by deriving it from `groups[].shot`, so the existing reachability tests can still replay the intended routes.
- Preserved moving-ball behavior with per-group `moving: true` flags instead of global `movingGroups` indices.
- Added a completion-order bonus rule. By default, completing a skewer in white -> pink -> green contact order grants an additional 300 points.
- Added completion order bonus metadata to `StageDefinition`, scoring logic, simulation update results, and the completion feedback banner.
- Updated target score generation to account for the best available completion-order bonus per completed skewer.

### Verification
- `npm test`: 45 tests passed.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.
- Browser smoke check on `http://localhost:5173/`: title screen, stage select with 15 cards, and stage 1 play screen loaded without console errors.
## 2026-06-17 団子図鑑・調理法・お品書きルール追加

### 実装
- 完成した串が当たった得点壁から団子の種類を決める調理法ルールを追加。既定では右壁=焼きだんご、左壁=みたらしだんご、床=月見だんご、天井=笹だんご。
- ステージ中に初めて作った団子種類を `dangoDex` に記録し、2品目以降に図鑑ボーナスを加算するようにした。
- 各ステージの得点対象壁から自動で「お品書き」を生成し、指定された種類をすべて作った時点でお品書き達成ボーナスを加算するようにした。
- 団子種類、図鑑ボーナス、お品書き達成を完成フィードバックとステージナビへ表示。
- 目標スコア生成に図鑑ボーナスとお品書き達成ボーナスを反映。

### 検証
- `npm test`: 46 tests passed.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.

## 2026-06-17 Stage 6-15 multiple-solution redesign

### Implementation
- Redesigned stages 6 through 15 around the dango dex, cooking-wall, and menu-completion rules.
- Added `alternateShots` to stage ball groups so a single three-ball group can be collected by more than one shot route.
- Added `choiceGroup` helpers for compact crossing-point ball groups that support both the primary route and an alternate route.
- Added `representativeStageShotRoutes` and stage tests that require stages 6-15 to have at least two reproducible clear routes with different wall-result sequences.
- Reworked the redesigned stages so the safe route and alternate route both clear, while mixed wall choices can be used to chase the stage menu bonus.

### Verification
- `npm test`: 56 tests passed.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.

## 2026-06-19 Moving dango visibility tuning

### Implementation
- Increased generated moving-dango amplitudes from 6/9px to 60/72px, making the one-sided swing at least three times the 20px ball radius.
- Unified the phase within each moving group so its three balls travel together instead of spreading apart over the enlarged swing.
- Retimed stage 12's default representative route with one-second waits for its two moving groups; the alternate route remains immediately playable.
- Added a regression test requiring every moving ball's one-sided swing to be at least three times its rendered radius.

### Verification
- `npm test`: 57 tests passed, including all representative and alternate clear routes.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.
- Browser comparison on stages 11 and 12 confirmed that the 60px vertical and 72px horizontal swings are plainly visible and that each three-ball group stays coherent while moving.

## 2026-06-19 Dango spacing tuning

### Implementation
- Replaced the compact crossing-point layout used by stages 6-15 with a three-point circular layout that keeps each pair of 20px-radius dango at least 40px apart while preserving both shot routes.
- Added per-group rotation for nearby crossing groups in stage 9 so separate groups also retain the same minimum spacing.
- Adjusted stage 2's final dango coordinate to satisfy the same spacing rule.
- Added regression coverage for all initial stage layouts and for moving-dango positions sampled throughout their motion cycles.

### Verification
- `npm test`: 59 tests passed, including all representative and alternate clear routes.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.

## 2026-06-19 Dango spacing expansion

### Implementation
- Increased the authored minimum dango center distance from 40px to 50px, leaving at least 10px of visible space between 20px-radius dango.
- Expanded the shared three-dango layout and added a dedicated 5px pickup-forgiveness value so the wider visual placement remains compatible with the skewer-tip interaction without changing bomb or obstacle collision.
- Repositioned stage 2's hand-authored arc group along its representative trajectory.
- Rotated nearby groups in stages 8, 10, and 15 to prevent one intended shot from collecting a dango from a neighboring group.
- Repositioned stage 9's three groups onto separated crossing points and updated their representative and alternate shots while preserving its three-landing-choice objective.
- Kept the 50px minimum active both at rest and throughout moving-dango cycles.

### Verification
- `npm test`: 59 tests passed, including all representative and alternate clear routes.
- `npm run build`: succeeded. Vite still reports the existing large chunk warning.
- Browser smoke check at 1280x720 confirmed normal playfield rendering and no play-HUD regression; the 50px spacing guarantee is covered across all stages by the static and moving-position tests.

## 2026-06-19 Stage 6-15 trajectory-aligned dango placement

### 背景
- 団子間隔を50pxへ広げた結果、`choiceGroup` の円形クラスタ配置では3個のうち1個が代表射撃の軌道から26〜30px離れ、取得しきい値32pxに対する余裕が2〜6pxしかなく、1射で3連刺しするのが難しくなっていた。

### 実装
- ステージ6〜15の静止グループを `choiceGroup`（クラスタ）から、代表射撃の実軌道上に3個を並べる座標直書きグループへ変更（チャプター1と同方式）。各グループの主経路の取得余裕が約31pxに改善し、軌道に素直に通せば3連刺しになる。
- 団子は軌道進行方向の手前から白→桜→よもぎの順に並べ、主経路で接触順ボーナスが自然に成立するようにした。
- 軌道上配置は同一グループで左右に分かれる別解と幾何学的に両立しないため、別解は「同じ3個を取った後、下流で別の壁（主に右→床、一部は左）へ落とす射撃」を全数シミュレーションで再導出。各ステージに最低1つの別壁ルートを残し、複数解テストを維持。
- 各ステージの得点壁を実際に到達可能な壁の和集合に整理（例: ステージ6〜9は右・床）。お品書きと図鑑ボーナスの目標スコアが到達可能な内容と整合するようにした。
- 移動団子グループ（ステージ11・12）はタイミング依存のため `choiceGroup` のまま維持。ステージ11では新配置のg3を移動グループg1の揺れ列から64px離して再配置。
- ステージ8は代替弾が先発で隣接グループの団子を巻き込む干渉を避けるため、別解を後段グループ1つに集約。
- ステージ6〜15の目的文を新しい軌道・壁構成に合わせて更新。

### 検証
- `npm test`: 59 tests passed（全ステージの代表ルートと別解ルートのクリア、静止・移動の50px間隔を含む）。
- `npm run build`: 成功（既存のチャンクサイズ警告のみ）。

### 残る確認
- 観察プレイテストで、軌道上配置により初見でも3連刺しが安定して決まるか、別解（別壁＝別団子）の発見率を確認。
- 得点壁を右・床中心に整理した結果、ステージ6〜9の壁バリエーションがやや単調。必要なら一部グループの主軌道を左壁着弾へ振り直して変化を足す。
## 2026-06-23 Stage unlock gating disabled

### Implementation
- Changed progress defaults, save parsing, and result recording so `unlockedStageCount` is normalized to the full stage count.
- Removed stage-clear gating from the stage-select cards, play-screen routing guard, and in-game next-stage button.
- Data reset now restores settings and progress with all stages unlocked immediately.
- The result screen's next-stage button can advance to the next stage even after a failed attempt, because later stages are no longer gated by clears.

### Verification
- `npm test`: 59 tests passed.
- `npm run build`: succeeded.

## 2026-07-06 全15ステージのレベルデザイン再設計

### 設計方針

`design-2d-levels` スキルの手順に従い、各ステージの「一文の目的」から配置を逆算して
全15ステージを作り直した。座標は手置きではなく、実シミュレーション
（`GameSimulation` / `stepSkewer`）で代表射撃の軌道を走らせ、その軌道上に
3個を並べる方式で導出した。別解は角度25〜155度×初速440〜900の全数探索で
「同じ3個を取って別の壁で仕上げる射撃」を再導出し、代表・別解とも
フルルートの再生でクリアを確認してから採用した。

- 章1で新要素を1ステージ1つずつ導入（照準→弱チャージ→左向き→チャージ両端→障害板）。
  旧構成で章1にあった爆弾は、PLAN.md の章構成どおり章2の頭（ステージ6）へ移動した。
- 章2は壁の選択（調理法・お品書き）と危険物の複合。章3は移動団子・煙突・火の門の複合試験。
- 爆弾は「通行禁止」ではなく、安直な低い直撃や欲張りな高いロブだけを止める位置に置いた。
  遅い山なり軌道の頂点付近は串の軸（88px）が広く掃くため、爆弾はロブ経路から
  100px 以上離すことを設計ルールにした。
- 移動団子は取得時刻に振れの端（速度ゼロ点）が来るよう位相を逆算し、
  タイミング取りが1/120秒精度を要求しないようにした。

### 新ステージ構成

1. 一、はじめの一串: 中チャージの素直な放物線で右壁へ（55度/700）。
2. 二、ふわり月見: 弱チャージで頂点をまたぎ床へ（78度/520）。
3. 三、左右の焼き分け: 左向き照準の導入。左たれ・右焼きの2本（118度/680、52度/720）。
4. 四、強弓と小弓: チャージ幅の両端を使い分け（33度/880、99度/470）。
5. 五、板越えの卒業試験: 障害板の導入+章1の総復習3本（126度/700ほか）。
6. 六、火種の初見: 初爆弾。低い直撃は火種に触れ、山なりなら安全（別解65度/660で床仕上げ）。
7. 七、お品書き三品: 左・右・床で三品を作る。右レーンは焼き/月見の選択（別解あり）。
8. 八、二枚板の窓: 最大チャージで二枚板の窓を撃ち抜く（52度/900）。左レーンに別解。
9. 九、火と板の間: 板越え+二つの火種の間の高さ読み。右レーンに床仕上げの別解。
10. 十、二章の大試験: 5本立て・爆弾2・三方向の壁でお品書きを揃える章末試験。
11. 十一、初めての揺れ: 縦揺れ1組を単独導入（待って撃つ）。静止3本は既習の軌道。
12. 十二、揺れの二重奏: 縦揺れ+横揺れの2組を先に処理してから静かな2本。
13. 十三、煙突くぐり: 真上90度で煙突に串を通し、落ちて月見になる新奇形。火種2つが欲張りを止める。
14. 十四、火門の刻み: 中空の火の門3つを縫う5本立て+揺れ1組。
15. 十五、大団円: 揺れ2組・板・火種2・三方向の壁の最終試験（6本、予備串1）。

### 検証

- `npm test`: 59テスト成功。全ステージの代表経路と、ステージ6〜15の別解経路
  （壁列が代表と異なること）を実シミュレーションで確認。
- `npm run build`: 成功（既存のチャンクサイズ警告のみ）。
- 静止時・移動周期中の団子間隔50px以上を全ステージで確認。
- 最大チャージ初手でクリアできるステージは4つ（4・8・12・15。いずれも強チャージが
  題意のステージ）で、共通解にはなっていない。代表射撃の初速は470〜900に分散。
- 移動団子の間隔テストが対象4ステージに増えて5秒を超えるため、
  該当テストにのみ timeout 60秒を指定した（ロジックは不変更）。
- 旧ステージファイル（straight-trio ほか）と choiceGroup.ts は削除。
  ステージIDが変わったため、旧セーブの最高スコアは引き継がれない。

### 未検証リスク（プレイテスト仮説）

- ステージ6で「低い直撃だと火種に当たる」ことを初見が1回の失敗で読み取れるか。
- ステージ11の揺れ1組について、待ってから撃つ行動を補助なしで発見できるか。
- ステージ13の90度真上撃ちを自力発見できるか（照準マーカーが真上を向く体験は初出）。
- 別解（別の壁で仕上げてお品書きを揃える）の発見率と、図鑑ボーナスの理解度。
- 章3の予備串1本が初見に厳しすぎないか（失敗リトライのテンポで許容できる想定）。

## 2026-06-23 GitHub Pages deployment automation

### Implementation
- Added a GitHub Actions workflow that builds the Vite app on every push to `main` and deploys the generated `dist` directory to GitHub Pages.
- Kept `dist/` out of git; deployment artifacts are produced by CI.

### Verification
- `npm run build`: succeeded locally before enabling the workflow.
