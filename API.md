# KEMEKO API Documentation

## 核心 API 參考

### ArrowManager 類別

箭頭動畫管理器，提供專業的箭頭背景動畫效果。

#### 建構函式
```typescript
constructor(container: HTMLElement, targetElement?: HTMLElement)
```

**參數**:
- `container`: 箭頭容器元素
- `targetElement`: 目標元素（可選，用於上升模式）

#### 公共方法

##### `getState(): ArrowManagerState`
獲取當前箭頭管理器狀態。

**回傳**: `ArrowManagerState` 物件，包含模式、動畫狀態、滑鼠位置等資訊。

##### `getErrorLog(): ErrorLog[]`
獲取錯誤日誌記錄。

**回傳**: `ErrorLog[]` 陣列，包含所有錯誤記錄。

##### `destroy(): void`
銷毀箭頭管理器，清理資源。

#### 事件處理

- **滑鼠移動**: 自動進入滑鼠跟隨模式
- **滑鼠離開**: 回復到閒置模式
- **目標懸停**: 進入上升模式
- **鍵盤導航**: 空格鍵切換模式，Escape 重置

---

### PerformanceMonitor 類別

性能監控系統，提供全面的性能追蹤和優化建議。

#### 靜態方法

##### `getInstance(): PerformanceMonitor`
獲取性能監控器的單例實例。

**回傳**: `PerformanceMonitor` 實例。

#### 公共方法

##### `startMonitoring(): void`
開始性能監控。

自動監控以下項目：
- Core Web Vitals (LCP, FID, CLS)
- 幀率和幀時間
- 內存使用
- 網絡狀態

##### `stopMonitoring(): void`
停止性能監控。

##### `getMetrics(): PerformanceMetrics`
獲取當前性能指標。

**回傳**: `PerformanceMetrics` 物件。

```typescript
interface PerformanceMetrics {
  frameRate: number;
  lastFrameTime: number;
  frameCount: number;
  averageFrameTime: number;
}
```

##### `measureFunction<T>(func: () => T, name: string): T`
測量函式執行時間。

**參數**:
- `func`: 要測量的函式
- `name`: 函式名稱（用於日誌）

**回傳**: 函式執行結果。

##### `measureAsyncFunction<T>(func: () => Promise<T>, name: string): Promise<T>`
測量非同步函式執行時間。

**參數**:
- `func`: 要測量的非同步函式
- `name`: 函式名稱（用於日誌）

**回傳**: Promise 包裝的函式執行結果。

##### `getRecommendations(): string[]`
獲取性能優化建議。

**回傳**: 字串陣列，包含優化建議。

##### `logSummary(): void`
在控制台輸出性能摘要。

---

### ErrorHandler 類別

全域錯誤處理系統，提供錯誤捕獲、記錄和管理功能。

#### 靜態方法

##### `getInstance(): ErrorHandler`
獲取錯誤處理器的單例實例。

**回傳**: `ErrorHandler` 實例。

#### 公共方法

##### `logError(message: string, error: any, context?: Record<string, any>): void`
記錄錯誤資訊。

**參數**:
- `message`: 錯誤描述
- `error`: 錯誤物件
- `context`: 額外的上下文資訊（可選）

##### `getErrorLog(): ErrorLog[]`
獲取錯誤日誌。

**回傳**: `ErrorLog[]` 陣列。

```typescript
interface ErrorLog {
  timestamp: number;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}
```

##### `clearErrorLog(): void`
清除錯誤日誌。

#### 輔助函式

##### `safeQuerySelector<T>(selector: string, context?: Document | HTMLElement): T | null`
安全的 DOM 查詢選擇器。

**參數**:
- `selector`: CSS 選擇器
- `context`: 查詢上下文（可選）

**回傳**: 匹配的元素或 null。

##### `safeDOMOperation<T>(operation: () => T, fallback: T, context?: string): T`
安全的 DOM 操作。

**參數**:
- `operation`: 要執行的操作
- `fallback`: 失敗時的回退值
- `context`: 操作描述（可選）

**回傳**: 操作結果或回退值。

##### `retryOperation<T>(operation: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>`
重試操作。

**參數**:
- `operation`: 要重試的非同步操作
- `maxRetries`: 最大重試次數（預設 3）
- `delay`: 重試延遲（預設 1000ms）

**回傳**: Promise 包裝的操作結果。

##### `debounce<T>(func: T, wait: number): (...args: Parameters<T>) => void`
防抖函式。

**參數**:
- `func`: 要防抖的函式
- `wait`: 等待時間（毫秒）

**回傳**: 防抖後的函式。

##### `throttle<T>(func: T, limit: number): (...args: Parameters<T>) => void`
節流函式。

**參數**:
- `func`: 要節流的函式
- `limit`: 節流間隔（毫秒）

**回傳**: 節流後的函式。

---

### EmailProtection 類別

郵件保護系統，提供郵件地址混淆和保護功能。

#### 靜態方法

##### `getInstance(): EmailProtection`
獲取郵件保護器的單例實例。

**回傳**: `EmailProtection` 實例。

##### `handleEmailClick(element: HTMLElement): boolean`
處理保護郵件的點擊事件。

**參數**:
- `element`: 被點擊的元素

**回傳**: 總是回傳 false（防止預設行為）。

#### 公共方法

##### `obfuscateEmail(email: string): string`
混淆郵件地址。

**參數**:
- `email`: 原始郵件地址

**回傳**: 混淆後的郵件地址。

##### `deobfuscateEmail(encodedEmail: string): string`
解混淆郵件地址。

**參數**:
- `encodedEmail`: 混淆的郵件地址

**回傳**: 原始郵件地址。

##### `createProtectedMailtoLink(email: string, subject?: string, body?: string, className?: string): string`
創建保護的郵件鏈接。

**參數**:
- `email`: 郵件地址
- `subject`: 郵件主題（可選）
- `body`: 郵件內容（可選）
- `className`: CSS 類名（可選）

**回傳**: HTML 鏈接字串。

##### `initializeEmailProtection(): void`
初始化郵件保護。

自動處理頁面中的 `mailto:` 鏈接。

##### `protectContactForms(): void`
保護聯絡表單。

自動處理標有 `data-protect-email` 的表單。

#### 輔助函式

##### `initializeEmailProtection(): void`
初始化郵件保護系統。

在 DOM 準備就緒時自動調用。

---

### SystemIntegration 類別

系統整合管理器，協調所有系統組件的初始化和管理。

#### 靜態方法

##### `getInstance(): SystemIntegration`
獲取系統整合器的單例實例。

**回傳**: `SystemIntegration` 實例。

#### 公共方法

##### `initialize(): Promise<void>`
初始化所有系統組件。

包括：
- 性能監控
- 郵件保護
- 箭頭管理器
- 系統健康監控

##### `getSystemStatus(): any`
獲取系統狀態。

**回傳**: 系統狀態物件，包含：
- 初始化狀態
- 箭頭管理器列表
- 性能指標
- 錯誤計數
- 內存使用

##### `getArrowManagerState(sectionId: string): ArrowManagerState | null`
獲取特定區域的箭頭管理器狀態。

**參數**:
- `sectionId`: 區域 ID

**回傳**: 箭頭管理器狀態或 null。

##### `cleanup(): void`
清理所有系統資源。

##### `debugPerformance(): void`
輸出性能調試報告。

#### 輔助函式

##### `initializeKemekoSystem(): Promise<void>`
初始化完整的 KEMEKO 系統。

這是主要的初始化函式，應該在 DOM 準備就緒時調用。

---

## 配置選項

### ANIMATION_CONFIG
```typescript
interface AnimationConfig {
  readonly arrowSpacing: number;        // 箭頭間距
  readonly centerRadius: number;        // 中心半徑
  readonly fadeWidth: number;           // 淡出寬度
  readonly transitionDuration: number;  // 過渡時間
  readonly minOpacity: number;          // 最小不透明度
  readonly maxOpacity: number;          // 最大不透明度
  readonly maxDistance: number;         // 最大距離
  readonly scaleRange: {                // 縮放範圍
    min: number;
    max: number;
  };
}
```

### COMPONENT_CONFIG
```typescript
interface ComponentConfig {
  enableAnimations: boolean;            // 啟用動畫
  enableAccessibility: boolean;         // 啟用無障礙
  enablePerformanceMonitoring: boolean; // 啟用性能監控
  debugMode: boolean;                   // 調試模式
}
```

### SECURITY_CONFIG
```typescript
interface SecurityConfig {
  readonly enableCSP: boolean;          // 啟用 CSP
  readonly emailObfuscation: boolean;   // 郵件混淆
  readonly integrityChecks: boolean;    // 完整性檢查
}
```

---

## 使用範例

### 基本使用
```typescript
// 初始化系統
await initializeKemekoSystem();

// 創建箭頭管理器
const container = document.getElementById('arrow-container');
const arrowManager = new ArrowManager(container);

// 監控性能
const monitor = PerformanceMonitor.getInstance();
monitor.startMonitoring();

// 處理錯誤
const errorHandler = ErrorHandler.getInstance();
errorHandler.logError('範例錯誤', new Error('測試'), { component: 'demo' });
```

### 高級使用
```typescript
// 測量函式性能
const result = monitor.measureFunction(() => {
  // 執行耗時操作
  return complexCalculation();
}, 'complexCalculation');

// 安全 DOM 操作
const element = safeQuerySelector('#my-element');
if (element) {
  safeDOMOperation(() => {
    element.style.display = 'block';
  }, undefined, 'showElement');
}

// 防抖處理
const debouncedHandler = debounce(() => {
  console.log('處理事件');
}, 300);

// 重試操作
const data = await retryOperation(async () => {
  return await fetch('/api/data');
}, 3, 1000);
```

### 調試和監控
```typescript
// 獲取系統狀態
const system = SystemIntegration.getInstance();
const status = system.getSystemStatus();
console.log('系統狀態:', status);

// 性能調試
system.debugPerformance();

// 獲取錯誤日誌
const errors = ErrorHandler.getInstance().getErrorLog();
console.log('錯誤日誌:', errors);
```

---

*此 API 文檔涵蓋了 KEMEKO 系統的所有主要功能和接口。*