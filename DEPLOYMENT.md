# KEMEKO 部署指南

## 環境配置

### 開發環境
- **URL**: http://localhost:4321/kemeko.morphusai/
- **CSP**: 寬鬆的安全策略以支援開發工具
- **圖像路徑**: /kemeko.morphusai/images/
- **熱重載**: 啟用

### 生產環境
- **URL**: https://your-domain.com/kemeko.morphusai/
- **CSP**: 嚴格的安全策略
- **圖像路徑**: /kemeko.morphusai/images/
- **最佳化**: 啟用（代碼壓縮、Tree-shaking）

## 部署流程

### 1. 構建
```bash
npm run build
```

### 2. 部署到 GitHub Pages
```bash
npm run deploy
```

### 3. 部署到 Heroku
```bash
git push heroku main
```

## 安全標頭配置

### 通過 _headers 檔案（推薦）
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: [詳細配置]
```

### 通過 Web Server 配置
#### Nginx
```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

#### Apache
```apache
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

## 故障排除

### CSP 錯誤
1. 檢查 CSP 策略是否包含所需的域名
2. 確認 `'unsafe-inline'` 和 `'unsafe-eval'` 只在開發環境使用
3. 生產環境應使用 nonce 或 hash 替代 unsafe-inline

### 圖像載入問題
1. 確認圖像路徑正確：`/kemeko.morphusai/images/filename.png`
2. 檢查 base URL 設定
3. 確認圖像文件存在於 public/images/ 目錄

### 字體載入問題
1. 確認 CSP 包含 `font-src https://fonts.gstatic.com`
2. 確認 `style-src` 包含 `https://fonts.googleapis.com`

## 效能最佳化

### 圖像最佳化
- 使用 WebP 格式（已實現）
- 響應式圖像（已實現）
- 適當的圖像壓縮

### 程式碼最佳化
- Terser 代碼壓縮（已啟用）
- Tree-shaking（已啟用）
- Bundle 分析（可用）

### 快取策略
- 靜態資源長期快取
- HTML 短期快取
- API 響應適當快取

## 監控與分析

### 可用的工具
```bash
# Bundle 分析
npm run analyze

# 依賴檢查
npm run analyze:deps

# 測試覆蓋率
npm run test:coverage

# 類型檢查
npm run type-check
```

### 效能監控
- Core Web Vitals
- Lighthouse 評分
- 內建的 ArrowManager 效能監控

## 備份與復原

### 關鍵文件
- `src/styles/global.css` - 主要樣式
- `src/utils/ArrowManager.ts` - 動畫系統
- `src/layouts/BaseLayout.astro` - 基礎佈局
- `public/images/` - 圖像資源

### 復原步驟
1. 從 Git 恢復代碼
2. 恢復 `public/images/` 目錄
3. 重新執行 `npm install`
4. 重新構建 `npm run build`

## 聯絡支援

如有部署問題，請聯絡開發團隊或提交 GitHub Issue。