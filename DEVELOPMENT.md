# KEMEKO Development Documentation

## 系統架構概述

KEMEKO 是一個基於 Astro 的現代化網站，採用 TypeScript 開發，集成了多個專業級系統組件：

### 核心組件

#### 1. ArrowManager (箭頭管理器)
- **位置**: `src/utils/ArrowManager.ts`
- **功能**: 專業的箭頭動畫管理系統
- **特色**: 支持滑鼠跟隨、上升模式、性能監控
- **使用方式**:
  ```typescript
  const arrowManager = new ArrowManager(containerElement, targetElement);
  ```

#### 2. PerformanceMonitor (性能監控)
- **位置**: `src/utils/performanceMonitor.ts`
- **功能**: 全面的性能監控和優化系統
- **監控內容**: Core Web Vitals、幀率、內存使用、網絡狀態
- **使用方式**:
  ```typescript
  const monitor = PerformanceMonitor.getInstance();
  monitor.startMonitoring();
  ```

#### 3. ErrorHandler (錯誤處理)
- **位置**: `src/utils/errorHandler.ts`
- **功能**: 全局錯誤處理和日誌記錄
- **特色**: 自動捕獲 JavaScript 錯誤、Promise 拒絕、資源加載錯誤
- **使用方式**:
  ```typescript
  const errorHandler = ErrorHandler.getInstance();
  errorHandler.logError('錯誤描述', error, context);
  ```

#### 4. EmailProtection (郵件保護)
- **位置**: `src/utils/emailProtection.ts`
- **功能**: 郵件地址混淆和保護
- **特色**: Base64 編碼、點擊保護、表單保護
- **使用方式**:
  ```typescript
  const protection = EmailProtection.getInstance();
  const protectedLink = protection.createProtectedMailtoLink(email);
  ```

#### 5. SystemIntegration (系統整合)
- **位置**: `src/utils/systemIntegration.ts`
- **功能**: 協調所有系統組件的初始化和管理
- **特色**: 系統健康監控、自動化初始化、調試工具
- **使用方式**:
  ```typescript
  await initializeKemekoSystem();
  ```

### 配置管理

#### 動畫配置
- **位置**: `src/config/animation.ts`
- **內容**: 動畫參數、性能閾值、無障礙設置、安全配置

#### 類型定義
- **位置**: `src/types/index.ts`
- **內容**: 完整的 TypeScript 接口定義

### 性能優化

#### CSS 優化
- **硬體加速**: 使用 `transform: translateZ(0)` 和 `will-change`
- **包含性能**: 使用 `contain` 屬性優化渲染
- **自定義屬性**: 集中管理 CSS 變量

#### JavaScript 優化
- **防抖和節流**: 實現了性能優化的事件處理
- **RequestAnimationFrame**: 優化動畫性能
- **內存管理**: 自動清理和監控

### 安全性

#### 內容安全策略 (CSP)
- **位置**: `src/layouts/BaseLayout.astro`
- **功能**: 防止 XSS 攻擊、資源完整性檢查

#### 郵件保護
- **混淆技術**: Base64 編碼隱藏真實郵件地址
- **點擊保護**: 防止自動化工具收集郵件

### 無障礙功能

#### 鍵盤導航
- **空格鍵**: 切換上升模式
- **Escape**: 重置為閒置模式
- **Tab**: 正常的焦點導航

#### 減少動畫
- **媒體查詢**: 支持 `prefers-reduced-motion`
- **自動調整**: 根據用戶偏好禁用動畫

### 開發工具

#### 調試模式
- **開啟方式**: 在開發環境中自動啟用
- **功能**: 全局 `KemekoSystem` 對象用於調試
- **性能報告**: `KemekoSystem.debugPerformance()`

#### 監控工具
- **性能指標**: 實時監控幀率和內存使用
- **錯誤日誌**: 自動記錄和分類錯誤
- **系統健康**: 定期檢查系統狀態

### 部署注意事項

#### 生產環境
- **性能監控**: 僅在開發環境中啟用詳細監控
- **錯誤上報**: 生產環境需要配置錯誤收集服務
- **CSP 策略**: 確保 CSP 策略適合生產環境

#### 資源完整性
- **CDN 完整性**: 使用 SRI (Subresource Integrity) 檢查
- **字體優化**: 使用 `font-display: swap` 提升載入性能

### 維護指南

#### 性能優化
1. 定期檢查 Core Web Vitals
2. 監控內存使用情況
3. 優化動畫幀率

#### 安全更新
1. 定期更新 CSP 策略
2. 檢查第三方資源完整性
3. 更新安全標頭

#### 代碼維護
1. 保持 TypeScript 類型定義更新
2. 定期重構和優化代碼
3. 更新依賴包版本

### 測試策略

#### 性能測試
- **Lighthouse**: 定期進行 Lighthouse 測試
- **WebPageTest**: 真實用戶環境測試
- **性能監控**: 使用內建的性能監控工具

#### 功能測試
- **箭頭動畫**: 測試各種交互模式
- **無障礙**: 鍵盤導航和屏幕閱讀器測試
- **郵件保護**: 確保郵件保護功能正常

#### 兼容性測試
- **瀏覽器**: Chrome、Firefox、Safari、Edge
- **設備**: 桌面、平板、手機
- **性能**: 低端設備和慢速網絡

### 故障排除

#### 常見問題
1. **箭頭不顯示**: 檢查容器元素是否正確初始化
2. **性能問題**: 使用性能監控工具診斷
3. **郵件保護失效**: 檢查 JavaScript 模組載入

#### 調試技巧
1. **控制台日誌**: 開發環境中查看詳細日誌
2. **性能面板**: 使用瀏覽器性能面板分析
3. **全局對象**: 使用 `KemekoSystem` 進行調試

### 貢獻指南

#### 代碼標準
- **TypeScript**: 使用嚴格的類型檢查
- **JSDoc**: 為所有公共 API 添加文檔
- **錯誤處理**: 使用統一的錯誤處理機制

#### 提交規範
- **類型**: feat、fix、docs、style、refactor、test
- **範例**: `feat: 添加新的箭頭動畫模式`
- **測試**: 確保所有測試通過

---

*此文檔描述了 KEMEKO 專案的完整技術架構和開發指南。*