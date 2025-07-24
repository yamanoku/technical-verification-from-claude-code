# ARIA Notify API仕様調査と活用方法

## 概要

ARIA Notify APIは、ウェブアクセシビリティを改善するためにMicrosoft Edgeチームが提案している新しいAPIです。現在のARIA live regionsの問題を解決し、スクリーンリーダーユーザーに対してより確実で予測可能な通知機能を提供することを目的としています。

**調査対象**: [Microsoft Edge Explainer - ARIA Notify](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Accessibility/AriaNotify/explainer.md)

## ARIA Notify APIとは

### 背景と課題

現在のウェブアクセシビリティでは、動的なコンテンツ変更をスクリーンリーダーに通知するためにARIA live regionsが使用されています。しかし、以下の問題があります：

- **スクリーンリーダー間での実装の不一致**
- **開発者にとっての使いにくさ**
- **予測不可能な動作**
- **本来の用途とは異なる使用による誤動作**

### 解決策

ARIA Notify APIは、開発者がスクリーンリーダーに対して**直接的に何を読み上げるべきか**を指示できる命令型APIを提供します。

## API仕様

### 基本構文

```javascript
// ドキュメントレベルでの通知
document.ariaNotify("John Doeが接続されました");

// 特定の要素に関連した通知
document.querySelector("#textEditor")
        .ariaNotify("選択されたテキストが青く光っています");
```

### 優先度システム

```javascript
// 通常優先度（デフォルト）
document.ariaNotify("バックグラウンドタスクが完了しました", 
    { "priority": "normal" });

// 高優先度 - キューの先頭に挿入
document.ariaNotify("サーバーとの接続が失われたため、変更を保存できません",
    { "priority": "high" });
```

### パラメータ仕様

#### 現在の仕様
- **method**: `element.ariaNotify(message, options)`
- **parameters**:
  - `message` (string): 読み上げられるテキスト
  - `options` (object, オプション):
    - `priority`: "normal" (デフォルト) | "high"

#### 将来的な拡張予定
- **`braille`**: 点字ディスプレイ用の別の文字列
- **`SSML`**: 発音制御のためのSpeech Synthesis Markup Language対応
- **`interrupt`**: 割り込み動作の制御 ("none", "all", "pending")
- **`type`**: スクリーンリーダーのカスタマイズ用分類

## 実装ステータス

### 現在の状況
- **提案段階** - まだブラウザには実装されていません
- Microsoft Edgeのアクセシビリティ研究開発の一環
- W3C ARIA Working Groupを通じて標準化を進行中

### 検出とフォールバック

```javascript
// 機能検出
if ("ariaNotify" in element) {
    // ARIA Notify APIが利用可能
    element.ariaNotify("モダンな通知");
} else {
    // ARIA live regionsにフォールバック
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.style.position = "absolute";
    liveRegion.style.left = "-10000px";
    liveRegion.textContent = "フォールバック通知";
    document.body.appendChild(liveRegion);
    
    setTimeout(() => {
        document.body.removeChild(liveRegion);
    }, 1000);
}
```

## 実用的な活用事例

### 1. キーボードアクション確認

```javascript
// ユーザーがShift+Alt+Yを押してテキストを青く光らせる
function handleTextGlow() {
    // テキストの見た目を変更
    applyGlowEffect();
    
    // スクリーンリーダーに通知
    document.querySelector("#textEditor")
            .ariaNotify("選択されたテキストが青く光っています");
}
```

### 2. 失敗またはエラー通知

```javascript
// ネットワーク遅延の通知
function notifyNetworkDelay() {
    document.ariaNotify("メッセージの送信に通常より時間がかかっています");
}

// 貼り付け操作の失敗
function handlePasteFailed() {
    document.ariaNotify("貼り付けるものがありません");
}
```

### 3. 自動操作の確認

```javascript
// スプレッドシートでの自動入力確認
function notifyAutofill(range) {
    document.querySelector("#spreadsheet")
            .ariaNotify(`セル${range}に値が自動入力されました`);
}

// フォームの自動保存
function notifyAutoSave() {
    document.ariaNotify("フォームが自動保存されました", 
                       { "priority": "normal" });
}
```

### 4. チャットアプリケーション

```javascript
// 新しいメッセージ受信
function handleNewMessage(sender, isCurrentChannel) {
    if (isCurrentChannel) {
        // 現在のチャンネルの場合は即座に通知
        document.ariaNotify(`${sender}からの新しいメッセージ`, 
                           { "priority": "high" });
    } else {
        // 他のチャンネルの場合は控えめに通知
        document.ariaNotify(`${sender}が他のチャンネルにメッセージを送信`);
    }
}
```

### 5. データ読み込みとエラーハンドリング

```javascript
// 非同期データ読み込み完了
async function loadUserData() {
    try {
        const data = await fetchUserData();
        document.ariaNotify("ユーザーデータの読み込みが完了しました");
        renderUserData(data);
    } catch (error) {
        document.ariaNotify("ユーザーデータの読み込みに失敗しました", 
                           { "priority": "high" });
    }
}
```

## プログレッシブエンハンスメントの実装例

### 汎用的な通知ヘルパー関数

```javascript
class AccessibilityNotifier {
    constructor() {
        this.supportsAriaNotify = "ariaNotify" in document.documentElement;
        this.liveRegions = new Map();
    }
    
    notify(message, options = {}) {
        const { priority = "normal", element = document } = options;
        
        if (this.supportsAriaNotify) {
            element.ariaNotify(message, { priority });
        } else {
            this.fallbackNotify(message, priority);
        }
    }
    
    fallbackNotify(message, priority) {
        const ariaLive = priority === "high" ? "assertive" : "polite";
        let liveRegion = this.liveRegions.get(ariaLive);
        
        if (!liveRegion) {
            liveRegion = this.createLiveRegion(ariaLive);
            this.liveRegions.set(ariaLive, liveRegion);
        }
        
        // 既存のコンテンツをクリアしてから新しいメッセージを設定
        liveRegion.textContent = "";
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
    
    createLiveRegion(ariaLive) {
        const region = document.createElement("div");
        region.setAttribute("aria-live", ariaLive);
        region.setAttribute("aria-atomic", "true");
        region.style.position = "absolute";
        region.style.left = "-10000px";
        region.style.width = "1px";
        region.style.height = "1px";
        region.style.overflow = "hidden";
        document.body.appendChild(region);
        return region;
    }
}

// 使用例
const notifier = new AccessibilityNotifier();
notifier.notify("操作が完了しました");
notifier.notify("エラーが発生しました", { priority: "high" });
```

## ベストプラクティス

### 1. 適切な使用頻度

```javascript
// ❌ 悪い例：過度な通知
function badExample() {
    document.ariaNotify("ボタンをクリックしました");
    document.ariaNotify("データを処理中です");
    document.ariaNotify("処理が50%完了しました");
    document.ariaNotify("処理が75%完了しました");
    document.ariaNotify("処理が完了しました");
}

// ✅ 良い例：必要な時のみ通知
function goodExample() {
    // 重要な状態変化のみ通知
    document.ariaNotify("データの処理が完了しました");
}
```

### 2. コンテキストに応じた通知

```javascript
// フォーカス管理と組み合わせた通知
function handleFormSubmission() {
    const form = document.querySelector("#userForm");
    
    if (validateForm(form)) {
        submitForm(form);
        // 成功時は控えめな通知
        document.ariaNotify("フォームが正常に送信されました");
    } else {
        // エラー時は高優先度で通知し、エラー箇所にフォーカス
        const firstError = form.querySelector(".error");
        firstError.focus();
        document.ariaNotify("フォームにエラーがあります。入力内容を確認してください", 
                           { priority: "high" });
    }
}
```

### 3. 国際化対応

```javascript
// 言語に応じた通知メッセージ
const messages = {
    ja: {
        saveSuccess: "ファイルが正常に保存されました",
        saveError: "ファイルの保存に失敗しました"
    },
    en: {
        saveSuccess: "File saved successfully",
        saveError: "Failed to save file"
    }
};

function localizedNotify(messageKey, options = {}) {
    const lang = document.documentElement.lang || "en";
    const message = messages[lang]?.[messageKey] || messages.en[messageKey];
    
    if ("ariaNotify" in document) {
        document.ariaNotify(message, options);
    } else {
        // フォールバック実装
        fallbackNotify(message, options.priority);
    }
}
```

## セキュリティとプライバシー

### プライバシー保護
- APIには外部から観察可能な副作用がありません
- 支援技術の存在を検出するために使用することはできません
- 戻り値がないため、情報漏洩のリスクが低減されています

### セキュリティ対策
- **スパム防止**: User Activationプリミティブによる制限率制限の可能性
- **スクリーンリーダー制御**: サイト固有のフィルタリング機能
- **Permissions Policy**: iframe内での制御のための新しい`aria-notify`権限

## 技術的考慮事項

### パフォーマンス影響

```javascript
// 通知頻度の制御
class ThrottledNotifier {
    constructor(delay = 1000) {
        this.delay = delay;
        this.lastNotification = 0;
        this.pendingMessage = null;
        this.timeoutId = null;
    }
    
    notify(message, options = {}) {
        const now = Date.now();
        
        if (now - this.lastNotification >= this.delay) {
            // 即座に通知
            this.sendNotification(message, options);
            this.lastNotification = now;
        } else {
            // 遅延通知
            this.pendingMessage = { message, options };
            
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            
            this.timeoutId = setTimeout(() => {
                if (this.pendingMessage) {
                    this.sendNotification(
                        this.pendingMessage.message, 
                        this.pendingMessage.options
                    );
                    this.pendingMessage = null;
                    this.lastNotification = Date.now();
                }
            }, this.delay - (now - this.lastNotification));
        }
    }
    
    sendNotification(message, options) {
        if ("ariaNotify" in document) {
            document.ariaNotify(message, options);
        } else {
            // フォールバック実装
            fallbackNotify(message, options.priority);
        }
    }
}
```

### クロスブラウザー対応

```javascript
// 機能検出とポリフィル
(function() {
    if (!("ariaNotify" in Element.prototype)) {
        // ポリフィル実装
        Element.prototype.ariaNotify = function(message, options = {}) {
            const priority = options.priority || "normal";
            const ariaLive = priority === "high" ? "assertive" : "polite";
            
            // 既存のlive regionを使用または作成
            let liveRegion = document.querySelector(`[data-aria-notify-${ariaLive}]`);
            
            if (!liveRegion) {
                liveRegion = document.createElement("div");
                liveRegion.setAttribute("aria-live", ariaLive);
                liveRegion.setAttribute("aria-atomic", "true");
                liveRegion.setAttribute(`data-aria-notify-${ariaLive}`, "true");
                liveRegion.style.position = "absolute";
                liveRegion.style.left = "-10000px";
                liveRegion.style.width = "1px";
                liveRegion.style.height = "1px";
                liveRegion.style.overflow = "hidden";
                document.body.appendChild(liveRegion);
            }
            
            // メッセージを設定
            liveRegion.textContent = "";
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        };
        
        // documentにも同じメソッドを追加
        document.ariaNotify = Element.prototype.ariaNotify.bind(document.documentElement);
    }
})();
```

## テスト戦略

### 単体テスト

```javascript
describe("ARIA Notify API", () => {
    let mockAriaNotify;
    
    beforeEach(() => {
        mockAriaNotify = jest.fn();
        Element.prototype.ariaNotify = mockAriaNotify;
        document.ariaNotify = mockAriaNotify;
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    test("基本的な通知が呼び出される", () => {
        document.ariaNotify("テストメッセージ");
        
        expect(mockAriaNotify).toHaveBeenCalledWith("テストメッセージ");
    });
    
    test("優先度オプションが正しく渡される", () => {
        document.ariaNotify("高優先度メッセージ", { priority: "high" });
        
        expect(mockAriaNotify).toHaveBeenCalledWith(
            "高優先度メッセージ", 
            { priority: "high" }
        );
    });
});
```

### E2Eテスト（将来のブラウザ実装用）

```javascript
// Playwright/Puppeteerを使用したテスト例
test("スクリーンリーダーとの統合テスト", async ({ page }) => {
    await page.goto("/test-page");
    
    // アクセシビリティツリーの監視
    const accessibilityTree = await page.accessibility.snapshot();
    
    // ボタンクリックで通知が発生
    await page.click("#notify-button");
    
    // アクセシビリティイベントの確認
    // （実際のスクリーンリーダーテストが必要）
});
```

## 導入ロードマップ

### Phase 1: 準備（現在）
- [ ] 仕様の理解と技術検証
- [ ] ポリフィル/フォールバック実装の準備
- [ ] チーム内でのアクセシビリティ知識の共有

### Phase 2: 実験的導入
- [ ] 小規模なプロジェクトでのポリフィル実装
- [ ] ユーザビリティテストの実施
- [ ] パフォーマンス影響の測定

### Phase 3: 本格導入（ブラウザ実装後）
- [ ] プロダクション環境での段階的導入
- [ ] スクリーンリーダーユーザーからのフィードバック収集
- [ ] 他の開発チームへの知見共有

## 参考リンク

- [Microsoft Edge Explainer - ARIA Notify](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Accessibility/AriaNotify/explainer.md)
- [W3C ARIA Working Group](https://www.w3.org/WAI/ARIA/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM - Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

## まとめ

ARIA Notify APIは、ウェブアクセシビリティの分野において重要な進歩を表しています。現在のARIA live regionsの制限を克服し、開発者により信頼性の高いツールを提供することで、より包括的なウェブ体験の構築が可能になります。

提案段階の技術ではありますが、今から理解を深めて準備を進めることで、将来的な実装時にスムーズに導入できるでしょう。特に、アクセシビリティを重視するプロダクトにおいては、この技術の動向を注視し、適切なタイミングでの導入を検討することが重要です。