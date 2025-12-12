# 首页交易预览区配置说明

## 📏 当前尺寸

### PC 端（屏幕宽度 ≥768px）
- **宽度**: 860px
- **高度**: 700px

### 移动端（屏幕宽度 <768px）
- **宽度**: 100%（全屏宽）
- **高度**: 500px

---

## 🎨 如何调整尺寸

打开 `app/styles/index.css` 文件，找到文件底部的配置部分（约在第 15-20 行）：

```css
:root {
  /* 🎨 PC 端尺寸配置 */
  --homepage-preview-width: 860px;          /* 修改这里调整 PC 宽度 */
  --homepage-preview-height: 700px;         /* 修改这里调整 PC 高度 */
  
  /* 🎨 移动端尺寸配置 */
  --homepage-preview-width-mobile: 100%;    /* 修改这里调整移动端宽度 */
  --homepage-preview-height-mobile: 500px;  /* 修改这里调整移动端高度 */
}
```

### 示例：

**如果想要更大的 PC 端预览区：**
```css
--homepage-preview-width: 1200px;   /* 从 860px 改为 1200px */
--homepage-preview-height: 800px;   /* 从 700px 改为 800px */
```

**如果想要更高的移动端预览区：**
```css
--homepage-preview-height-mobile: 600px;  /* 从 500px 改为 600px */
```

**如果想要移动端也固定宽度：**
```css
--homepage-preview-width-mobile: 95%;  /* 或者用具体像素值，如 360px */
```

---

## 📱 断点配置

当前断点设置：
- **PC 端**: 屏幕宽度 ≥768px
- **移动端**: 屏幕宽度 <768px

### 如何修改断点：

如果想在更大的屏幕才切换到 PC 布局（比如 1024px），在 `app/root.tsx` 中找到：

```css
@media (min-width: 768px) {  /* 改为 1024px */
```

和

```css
@media (max-width: 767px) {  /* 改为 1023px */
```

---

## ✅ 部署流程

修改配置后：

1. **保存文件**
2. **提交到 Git**：
   ```bash
   git add app/root.tsx
   git commit -m "调整首页交易预览区尺寸"
   git push origin main
   ```
3. **Vercel 自动部署**（约 2-3 分钟）
4. **访问线上地址查看效果**

---

## 🔍 故障排查

### 如果修改后尺寸没有变化：

1. **清除浏览器缓存**：Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)
2. **检查 Vercel 部署状态**：确认部署成功
3. **在浏览器控制台运行**：
   ```javascript
   const style = getComputedStyle(document.documentElement);
   console.log('Width:', style.getPropertyValue('--homepage-preview-width'));
   console.log('Height:', style.getPropertyValue('--homepage-preview-height'));
   ```
   应该显示您设置的值

### 如果显示了多余的交易模块：

检查 `app/components/landing/FirstPage.tsx` 中的 `disableFeatures` 配置是否正确。

---

## 📝 技术说明

这个解决方案通过在 `app/styles/index.css` 中添加样式来确保：
- ✅ 样式在任何环境下都能加载（包括 Vercel 生产环境）
- ✅ 不会被其他 CSS 覆盖（使用 `!important`）
- ✅ 响应式自动切换（基于媒体查询）
- ✅ 方便调整（只需修改 4 个变量）

### 为什么不使用 root.tsx 中的内联样式？

在 Remix 的 SSR 生产构建中，`dangerouslySetInnerHTML` 在 `<head>` 中注入的样式可能被优化掉或被 React hydration 清除。将样式直接添加到 CSS 文件中是更可靠的 Remix 标准做法。

---

**最后更新**: 2025年12月12日  
**状态**: 已重新部署（使用 index.css 方案）

