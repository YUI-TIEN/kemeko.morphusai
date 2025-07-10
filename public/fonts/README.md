# 🎨 源泉圓體字體設置說明

## ⚠️ 目前狀況
- 暫時使用 Google Fonts 的 Noto Sans TC（避免404錯誤）
- 源泉圓體 @font-face 已暫時註解
- 等待字體文件放置後即可啟用

## 📥 下載步驟

### 方式一：直接使用 OTF 文件 ⭐ 推薦
1. **下載 OTF 字體**：
   - 前往：https://github.com/ButTaiwan/gensen-font/releases
   - 下載 `GenSenRoundedTW-M.otf`
   - 直接放置在 `public/fonts/` 目錄，無需轉換！

### 方式二：轉換為 WOFF（更好的網頁性能）
1. **下載原始字體**：
   - 前往：https://github.com/ButTaiwan/gensen-font/releases
   - 下載 `GenSenRoundedTW-M.otf`

2. **轉換為 WOFF**：
   - 前往：https://convertio.co/otf-woff/
   - 上傳 OTF 文件
   - 下載轉換後的 WOFF 文件
   - **重要**：重新命名為 `GenSenRounded2TW-M.woff`

### 其他轉換工具
- Squirrel Font Generator: https://www.fontsquirrel.com/tools/webfont-generator
- CloudConvert: https://cloudconvert.com/otf-to-woff

## 📁 放置位置（任選一種）
```
方式一：public/fonts/GenSenRoundedTW-M.otf
方式二：public/fonts/GenSenRounded2TW-M.woff
```

## 🔍 驗證安裝
放置後在瀏覽器開發者工具 Network 標籤中應該看到：
- ✅ `GenSenRounded2TW-M.woff` 載入成功（200 status）
- ❌ 不應該有 404 錯誤

## 🎯 檔案檢查清單
- [ ] 下載完整的 OTF 文件（應該大於 10MB）
- [ ] 放置在正確位置：`public/fonts/GenSenRoundedTW-M.otf`
- [ ] 取消註解 CSS 中的 @font-face 聲明
- [ ] 更新 font-family 優先順序
- [ ] 重啟開發伺服器 `npm run dev`

## 🔄 啟用源泉圓體的步驟
1. **放置字體文件**到 `public/fonts/`
2. **取消註解** `src/styles/global.css` 中的 @font-face
3. **更新** body 的 font-family 為：
   ```css
   font-family: 'GenSenRoundedTW', 'Noto Sans TC', ...
   ```

## 📄 授權資訊
源泉圓體基於 SIL Open Font License 1.1 授權，可免費用於個人和商業用途。