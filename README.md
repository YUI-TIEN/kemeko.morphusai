# KEMEKO - 一場有溫度的未來對話

![KEMEKO Banner](public/images/俯視-03141708.png)

> **KEMEKO** 是一個先進的 AI Vtuber 概念網站，展示了現代 Web 技術與互動設計的完美結合。

## ✨ 特色功能

### 🎯 互動式箭頭背景
- **智能追蹤**: 箭頭跟隨滑鼠移動，營造動態視覺效果
- **上升模式**: 特定元素懸停時，箭頭指向中心創造聚焦效果
- **性能優化**: 使用 RequestAnimationFrame 和硬體加速

### 🔒 企業級安全
- **內容安全策略 (CSP)**: 防範 XSS 攻擊
- **郵件保護**: Base64 編碼隱藏真實郵件地址
- **資源完整性**: SRI 檢查確保第三方資源安全

### 📊 專業監控系統
- **性能監控**: Core Web Vitals、幀率、內存使用
- **錯誤追蹤**: 全局錯誤捕獲和記錄
- **系統健康**: 自動化健康檢查和警報

### ♿ 無障礙設計
- **鍵盤導航**: 完整的鍵盤操作支援
- **減少動畫**: 遵循 `prefers-reduced-motion` 偏好
- **ARIA 標籤**: 符合 WCAG 無障礙標準

## 🚀 技術架構

### 前端框架
- **Astro**: 現代靜態網站生成器
- **TypeScript**: 完整類型安全
- **CSS 設計系統**: 自定義屬性和組件化樣式

### 核心系統
- **ArrowManager**: 專業箭頭動畫管理
- **PerformanceMonitor**: 全面性能監控
- **ErrorHandler**: 統一錯誤處理
- **EmailProtection**: 智能郵件保護
- **SystemIntegration**: 系統整合管理

### 性能優化
- **硬體加速**: CSS `transform` 和 `will-change`
- **包含性能**: `contain` 屬性優化渲染
- **資源預載**: `preconnect` 和 `dns-prefetch`
- **防抖節流**: 優化事件處理性能

## 📁 專案結構

```
kemeko.morphusai/
├── src/
│   ├── components/          # Astro 組件
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/             # 版面配置
│   │   └── BaseLayout.astro
│   ├── pages/               # 頁面路由
│   │   └── index.astro
│   ├── styles/              # 樣式文件
│   │   └── global.css
│   ├── utils/               # 工具函式
│   │   ├── ArrowManager.ts
│   │   ├── performanceMonitor.ts
│   │   ├── errorHandler.ts
│   │   ├── emailProtection.ts
│   │   └── systemIntegration.ts
│   ├── config/              # 配置文件
│   │   └── animation.ts
│   └── types/               # TypeScript 類型
│       └── index.ts
├── public/                  # 靜態資源
│   ├── images/
│   └── favicon.svg
├── docs/                    # 文檔
│   ├── DEVELOPMENT.md
│   └── API.md
└── package.json
```

## 🛠️ 開發指南

### 環境需求
- Node.js 16+ 
- npm 或 yarn

### 快速開始
```bash
# 安裝依賴
npm install

# 開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

### 開發命令
| 命令 | 說明 |
|------|------|
| `npm run dev` | 開發服務器 (localhost:4321) |
| `npm run build` | 構建生產版本 |
| `npm run preview` | 預覽生產版本 |
| `npm run astro check` | 類型檢查 |

### 調試模式
開發環境中，系統會自動啟用調試模式：
```javascript
// 在瀏覽器控制台中
KemekoSystem.debugPerformance();    // 性能調試
KemekoSystem.getSystemStatus();     // 系統狀態
```

## 🎨 設計系統

### 顏色配置
```css
:root {
  --color-primary: #C2AFFF;     /* 主要色彩 */
  --color-secondary: #C18D8A;   /* 次要色彩 */
  --color-background: #202226;  /* 背景色 */
  --color-text-primary: #F6F7F8; /* 主要文字色 */
}
```

### 動畫配置
```typescript
const ANIMATION_CONFIG = {
  arrowSpacing: 70,           // 箭頭間距
  centerRadius: 350,          // 中心半徑
  fadeWidth: 100,             // 淡出寬度
  transitionDuration: 500,    // 過渡時間
  minOpacity: 0.15,           // 最小不透明度
  maxOpacity: 0.8,            // 最大不透明度
};
```

## 🔧 API 參考

### 主要類別
- **ArrowManager**: 箭頭動畫管理
- **PerformanceMonitor**: 性能監控
- **ErrorHandler**: 錯誤處理
- **EmailProtection**: 郵件保護
- **SystemIntegration**: 系統整合

詳細 API 文檔請參考 [API.md](API.md)。

## 📈 性能指標

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 優化措施
- 硬體加速動畫
- 資源預載和壓縮
- 智能緩存策略
- 響應式圖片處理

## 🔒 安全性

### 內容安全策略
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

### 安全標頭
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 郵件保護
- Base64 編碼隱藏真實地址
- 點擊時動態解碼
- 防止自動化收集

## 🧪 測試策略

### 性能測試
- Lighthouse 定期測試
- 真實用戶監控 (RUM)
- 內建性能監控工具

### 功能測試
- 箭頭動畫交互測試
- 無障礙功能測試
- 跨瀏覽器兼容性測試

### 安全測試
- CSP 策略驗證
- 郵件保護功能測試
- 資源完整性檢查

## 📚 文檔

- **[開發指南](DEVELOPMENT.md)**: 詳細的開發和架構說明
- **[API 文檔](API.md)**: 完整的 API 參考
- **[部署指南](DEPLOYMENT.md)**: 生產環境部署說明

## 🤝 貢獻指南

### 代碼標準
- 使用 TypeScript 嚴格模式
- 遵循 ESLint 配置
- 添加 JSDoc 註釋
- 包含單元測試

### 提交規範
```
feat: 新功能
fix: 修復問題
docs: 文檔更新
style: 代碼格式
refactor: 重構
test: 測試相關
```

### 開發流程
1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 創建 Pull Request

## 📄 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件。

## 🎉 致謝

感謝所有為 KEMEKO 專案做出貢獻的開發者和設計師。

---

**KEMEKO** - 探索 AI 與人類情感連結的未來。

🌟 [線上演示](https://kemeko.morphusai.com) | 📧 [聯絡我們](mailto:nick@morphusai.com) | 🐙 [GitHub](https://github.com/morphusai/kemeko)