# 个人网站

一个简洁优雅的个人网站，支持播客和文章发布。

## 功能

- 🎙️ 播客展示
- 📝 文章系统（支持 Markdown）
- 📎 文件下载（PDF、Word、Excel 等）
- 🌙 深色主题
- 📱 响应式设计

## 开发

```bash
npm install
npm run dev
```

## 部署

推送到 GitHub 后，在 Vercel 导入仓库即可自动部署。

## 添加文章

将 Markdown 文件放入 `articles/` 目录：

```
articles/
├── 我的第一篇文章.md
├── 产品设计思考.pdf
└── images/
    └── cover.png
```

Markdown 文件格式：

```markdown
---
title: 文章标题
date: 2024-03-11
description: 文章描述
---

文章内容...
```