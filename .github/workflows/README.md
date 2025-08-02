# GitHub Actions 构建工作流

本目录包含用于自动构建桌面应用程序的 GitHub Actions 工作流文件。

## 工作流文件

### 1. `build-windows.yml`
专门用于构建 Windows 平台的桌面应用程序。

**触发条件：**
- 推送到 `main` 或 `master` 分支
- 创建以 `v` 开头的标签
- 手动触发
- Pull Request

**构建产物：**
- MSI 安装包
- NSIS 便携版安装程序
- 可执行文件 (.exe)

### 2. `build-multiplatform.yml`
用于构建多平台（Windows、macOS、Linux）的桌面应用程序。

**支持平台：**
- **Windows**: MSI 安装包、NSIS 安装程序、可执行文件
- **macOS**: DMG 安装包、.app 应用包（Universal Binary）
- **Linux**: AppImage、DEB 包、可执行文件

## 配置要求

### 必需的 Secrets

在 GitHub 仓库设置中添加以下 secrets：

1. **TAURI_PRIVATE_KEY** (可选)
   - Tauri 应用签名的私钥
   - 用于代码签名和应用验证
   
2. **TAURI_KEY_PASSWORD** (可选)
   - 私钥的密码
   - 与 TAURI_PRIVATE_KEY 配套使用

3. **GITHUB_TOKEN** (自动提供)
   - GitHub 自动提供，用于创建 Release
   - 无需手动配置

### 生成 Tauri 签名密钥

```bash
# 生成新的签名密钥对
npx @tauri-apps/cli signer generate -w ~/.tauri/myapp.key

# 查看公钥
npx @tauri-apps/cli signer sign -k ~/.tauri/myapp.key --password YOUR_PASSWORD
```

## 使用方法

### 自动构建

1. **推送代码触发构建**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin main
   ```

2. **创建标签触发发布**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **手动触发构建**
   - 在 GitHub 仓库页面
   - 进入 "Actions" 标签
   - 选择对应的工作流
   - 点击 "Run workflow"

### 下载构建产物

1. **从 Actions 页面下载**
   - 进入 "Actions" 标签
   - 选择对应的构建任务
   - 在 "Artifacts" 部分下载

2. **从 Releases 页面下载**
   - 当推送标签时，会自动创建 Release
   - 在 "Releases" 页面下载对应平台的安装包

## 构建时间

预估构建时间：
- **Windows**: 15-20 分钟
- **macOS**: 20-25 分钟
- **Linux**: 10-15 分钟
- **多平台并行**: 25-30 分钟

## 故障排除

### 常见问题

1. **构建失败：依赖安装错误**
   ```
   解决方案：检查 package.json 中的依赖版本
   确保 Node.js 和 Rust 版本兼容
   ```

2. **Windows 构建失败：缺少 Visual Studio Build Tools**
   ```
   解决方案：GitHub Actions 的 windows-latest 已包含必要工具
   如果仍有问题，可能需要更新工作流中的依赖
   ```

3. **macOS 构建失败：签名问题**
   ```
   解决方案：检查 TAURI_PRIVATE_KEY 和 TAURI_KEY_PASSWORD
   或者在 tauri.conf.json 中禁用签名
   ```

4. **Linux 构建失败：系统依赖缺失**
   ```
   解决方案：检查工作流中的 apt install 命令
   确保安装了所有必需的系统库
   ```

### 调试技巧

1. **启用详细日志**
   ```yaml
   - name: Build Tauri app
     run: npm run tauri build -- --verbose
   ```

2. **缓存问题**
   ```yaml
   # 清理缓存后重新构建
   - name: Clear cache
     run: |
       rm -rf ~/.cargo/registry
       rm -rf target
   ```

3. **本地测试**
   ```bash
   # 在本地运行相同的构建命令
   cd web
   npm ci
   npm run build
   npm run tauri build
   ```

## 自定义配置

### 修改构建目标

在工作流文件中修改 `targets` 配置：

```yaml
- name: Install Rust
  uses: dtolnay/rust-toolchain@stable
  with:
    targets: x86_64-pc-windows-msvc,i686-pc-windows-msvc  # 添加 32 位支持
```

### 添加代码签名

```yaml
- name: Import Code Signing Certificate (Windows)
  if: matrix.platform == 'windows-latest'
  run: |
    echo "${{ secrets.WINDOWS_CERTIFICATE }}" | base64 --decode > certificate.p12
    # 配置证书导入命令
```

### 自定义发布说明

```yaml
- name: Create Release
  uses: softprops/action-gh-release@v1
  with:
    body_path: CHANGELOG.md  # 使用 CHANGELOG 作为发布说明
    files: |
      artifacts/**/*
```

## 性能优化

1. **启用缓存**
   - Rust 编译缓存
   - Node.js 依赖缓存
   - 前端构建缓存

2. **并行构建**
   - 多平台并行执行
   - 前后端并行构建

3. **增量构建**
   - 只在相关文件变更时触发构建
   - 使用 `paths` 过滤器

```yaml
on:
  push:
    paths:
      - 'web/**'
      - '.github/workflows/**'
```