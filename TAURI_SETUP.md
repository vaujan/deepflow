# Tauri Integration Setup Guide

This guide will help you complete the Tauri integration for your Next.js project.

## Prerequisites

1. **Install Rust** (when you have sufficient disk space):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Install system dependencies** (Ubuntu/Debian):
   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.0-dev \
       build-essential \
       curl \
       wget \
       libssl-dev \
       libgtk-3-dev \
       libayatana-appindicator3-dev \
       librsvg2-dev
   ```

## Current Setup Status

✅ Tauri CLI installed  
✅ Tauri project initialized  
✅ Next.js configured for static export  
✅ Package.json scripts added  
✅ Tauri API package installed  

## Configuration Files

### Next.js Config (next.config.ts)
- Static export enabled
- Trailing slash enabled
- Images unoptimized for Tauri compatibility

### Tauri Config (src-tauri/tauri.conf.json)
- App name: deepflow-click
- Window title: DeepFlow Click
- Development server: http://localhost:3000
- Build output: ../out directory

## Available Scripts

```bash
# Development
pnpm dev              # Start Next.js dev server
pnpm tauri:dev        # Start Tauri development (requires Rust)

# Building
pnpm build            # Build Next.js for production
pnpm tauri:build      # Build Tauri app (requires Rust)

# Tauri CLI
pnpm tauri            # Access Tauri CLI directly
```

## Next Steps

1. **Free up disk space** (at least 5-10GB recommended)
2. **Install Rust** using the command above
3. **Install system dependencies**
4. **Test the integration**:
   ```bash
   pnpm tauri:dev
   ```

## Troubleshooting

### Common Issues

1. **"No space left on device"**: Free up disk space before installing Rust
2. **Missing system dependencies**: Install the required packages listed above
3. **Rust not found**: Ensure Rust is installed and `~/.cargo/bin` is in your PATH

### Verification Commands

```bash
# Check Rust installation
rustc --version
cargo --version

# Check Tauri CLI
pnpm tauri --version

# Check available disk space
df -h
```

## Development Workflow

1. **Start development**: `pnpm tauri:dev`
   - This will start Next.js dev server and Tauri app
   - Changes to Next.js code will hot-reload
   - Changes to Rust code require restart

2. **Build for production**: `pnpm tauri:build`
   - Creates distributable packages for your platform
   - Outputs to `src-tauri/target/release/bundle/`

## Additional Resources

- [Tauri Official Documentation](https://tauri.app/v2/)
- [Tauri + Next.js Guide](https://tauri.app/v2/guides/frontend/nextjs/)
- [Rust Installation Guide](https://rustup.rs/)
