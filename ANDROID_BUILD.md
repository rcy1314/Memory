# Android 构建指南

本项目现在支持构建 Android APK 安装包。以下是构建和使用说明。

## 前置要求

### 本地开发环境

1. **安装 Android Studio** 或 **Android SDK**
   - 下载并安装 [Android Studio](https://developer.android.com/studio)
   - 或者单独安装 [Android SDK](https://developer.android.com/studio#command-tools)

2. **安装 Android NDK**
   ```bash
   # 通过 Android Studio SDK Manager 安装
   # 或使用 sdkmanager 命令行工具
   sdkmanager "ndk;25.2.9519653"
   ```

3. **安装 Java 17**
   ```bash
   # macOS (使用 Homebrew)
   brew install openjdk@17
   
   # Ubuntu/Debian
   sudo apt install openjdk-17-jdk
   
   # Windows
   # 下载并安装 OpenJDK 17
   ```

4. **安装 Rust Android 目标**
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   ```

5. **安装 Tauri CLI (Android 支持)**
   ```bash
   cargo install tauri-cli --version "^2.0" --features android
   ```

### 环境变量设置

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk  # 或你的 Android SDK 路径
export ANDROID_NDK_ROOT=$ANDROID_HOME/ndk/25.2.9519653
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

## 本地构建

### 1. 初始化 Android 项目

```bash
cd web
npm run tauri:android:init
```

### 2. 构建前端

```bash
npm ci
npm run build
```

### 3. 构建 Android APK

```bash
# 构建所有架构
npm run tauri:android:build

# 或构建特定架构
npm run tauri:android:build:aarch64  # ARM64 (推荐)
npm run tauri:android:build:armv7    # ARMv7
npm run tauri:android:build:x86_64   # x86_64 (模拟器)
```

### 4. 开发模式

```bash
# 在 Android 设备/模拟器上运行开发版本
npm run tauri:android:dev
```

## GitHub Actions 自动构建

项目已配置 GitHub Actions 工作流，会在以下情况自动构建 Android APK：

- 推送到 `main` 或 `master` 分支
- 创建 Pull Request
- 创建版本标签 (如 `v1.0.0`)
- 手动触发工作流

### 构建产物

- **开发构建**: APK 文件会作为 GitHub Actions 的 artifacts 上传
- **发布构建**: 当推送版本标签时，APK 会自动附加到 GitHub Release

## 支持的 Android 架构

- **aarch64** (ARM64): 现代 Android 设备的主要架构
- **armv7** (ARMv7): 较老的 Android 设备
- **x86_64**: Android 模拟器和部分 x86 设备

## 配置说明

### Android 版本要求

- **最低 SDK 版本**: Android 7.0 (API 24)
- **目标 SDK 版本**: Android 14 (API 34)
- **编译 SDK 版本**: Android 14 (API 34)

### 应用信息

- **应用名称**: Memory Photo Album
- **包名**: com.memory.app
- **版本**: 1.0.0

## 故障排除

### 常见问题

1. **NDK 未找到**
   ```
   确保设置了 ANDROID_NDK_ROOT 环境变量
   export ANDROID_NDK_ROOT=$ANDROID_HOME/ndk/25.2.9519653
   ```

2. **Java 版本不兼容**
   ```
   确保使用 Java 17
   java -version
   ```

3. **Rust 目标未安装**
   ```bash
   rustup target add aarch64-linux-android
   ```

4. **权限问题**
   ```
   确保 Android SDK 目录有正确的读写权限
   ```

### 调试技巧

1. **查看详细日志**
   ```bash
   npm run tauri:android:build -- --verbose
   ```

2. **清理构建缓存**
   ```bash
   cd web/src-tauri
   cargo clean
   ```

3. **检查 Android 项目**
   ```bash
   cd web/src-tauri/gen/android
   ./gradlew build
   ```

## 安装和测试

### 安装 APK

```bash
# 通过 ADB 安装
adb install path/to/your/app.apk

# 或直接传输到设备并手动安装
```

### 设备要求

- Android 7.0 (API 24) 或更高版本
- 至少 100MB 可用存储空间
- 允许安装未知来源应用 (开发版本)

## 发布准备

在发布生产版本前，建议：

1. 使用发布密钥签名 APK
2. 启用代码混淆和压缩
3. 测试不同设备和 Android 版本
4. 优化 APK 大小

更多详细信息，请参考 [Tauri Android 文档](https://tauri.app/v1/guides/building/android)。