---
title: 处理 macOS 上 OpenClaw rescue 服务导致目录无法删除
date: 2026-02-13
description: 解决 OpenClaw rescue profile 目录无法删除的问题，需要先卸载 launchd 服务
author: Owen
email: zeyangyz@icloud.com
---

# 处理 macOS 上 OpenClaw `rescue` 服务导致 `~/.openclaw-rescue` 无法删除

## 背景现象
我尝试删除 OpenClaw 的 profile 目录：

```bash
sudo rm -rf ~/.openclaw-rescue
```

但目录一直无法彻底删除/删除后又出现，看起来像“删不掉”。

## 根因定位
最终确认原因是：`rescue` profile 对应的网关被 **launchd 作为服务加载**，服务仍在运行或会自动拉起，从而占用/重建该目录。

### 1) 检查是否有 OpenClaw 服务被加载
由于机器上没有 `rg`（ripgrep），用系统自带 `grep`：

```bash
launchctl list | grep -iE "openclaw|ai\.openclaw"
```

输出中能看到类似：

- `ai.openclaw.cto`
- `ai.openclaw.rescue`

说明服务仍然处于加载状态。

## 误区记录
- `bootout` 不是独立命令，直接执行会报错：`zsh: command not found: bootout`
- `launchctl bootout ai.openclaw.rescue` 也会报错，因为缺少 domain-target，会提示需要 `gui/<uid>/...` 这种格式。

## 正确卸载方式（最终解决）
使用当前用户 GUI 域 + service-id 的完整 target，并用 sudo 执行：

```bash
sudo launchctl bootout gui/$(id -u)/ai.openclaw.rescue
```

说明：
- `$(id -u)` 会返回当前用户的 UID（例如 501）
- 所以等价写法是：`sudo launchctl bootout gui/501/ai.openclaw.rescue`

## 验证卸载是否成功
再次检查列表，确认 `ai.openclaw.rescue` 不再出现：

```bash
launchctl list | grep -iE "openclaw|ai\.openclaw"
```

## 删除目录（卸载后再删除）
卸载服务后再删除目录：

```bash
sudo rm -rf ~/.openclaw-rescue
```

此时目录应可正常删除，且不会再被自动重建。

## 经验总结
当发现 OpenClaw 的 `~/.openclaw-<profile>` 目录“删不掉/会回来”时，优先检查是否有对应的 launchd 服务：
- 先 `launchctl list` 找到 `ai.openclaw.<profile>`
- 再用 `launchctl bootout gui/<uid>/ai.openclaw.<profile>` 卸载
- 最后再删目录
