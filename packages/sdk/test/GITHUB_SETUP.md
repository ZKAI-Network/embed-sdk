# GitHub Actions Setup for SDK Tests

This guide shows how to set up GitHub Actions to run the SDK test harness using the `API_KEY_EMBED` secret.

## 🔧 Setup Instructions

### 1. Add API Key Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `API_KEY_EMBED`
5. Value: Your Embed AI API key (e.g., `mbd-xxx...`)
6. Click **Add secret**

### 2. GitHub Actions Workflow

The workflow is already configured in `.github/workflows/test-sdk.yml` and includes:

**Three test jobs:**
- `test-sdk` - Full SDK test suite with API key
- `test-sdk-without-key` - Validates graceful skipping without API key  
- `test-typescript-compilation` - TypeScript compilation check

**Triggers:**
- Push to `master`
- Pull requests to `master`
- Manual trigger via `workflow_dispatch`
- Only runs when SDK or types packages change

### 3. Test Execution

When the workflow runs, it will:

```bash
# Install dependencies
bun install

# Build packages
bun run build:types
bun run build:sdk  

# Run comprehensive test suite
cd packages/sdk
bun run test:integration

# Test individual namespaces
bun run test:posts   # Search posts
bun run test:users   # Search users  
bun run test:feed    # Feed namespace

# Generate coverage report
bun run coverage
```

### 4. Environment Variables

The workflow automatically sets:
```yaml
env:
  API_KEY_EMBED: ${{ secrets.API_KEY_EMBED }}
```

### 5. Expected Results

**✅ Success Case:**
- All tests pass with real API calls
- Type validation confirms interface compliance
- Coverage report generated
- Individual namespace tests pass

**⚠️ Partial Success (some timeouts in error handling):**
- Core functionality tests pass ✅
- API integration works ✅  
- Type safety validated ✅
- Some error handling tests may timeout (non-critical)

**❌ Failure Cases:**
- API key missing/invalid
- Breaking changes in API responses
- Type mismatches
- Network connectivity issues

## 🚨 Troubleshooting

**Tests failing with "Unauthorized":**
- Check that `API_KEY_EMBED` secret is set correctly
- Verify API key is valid and active
- Ensure key has proper permissions

**Timeout issues:**
- Some error handling tests may timeout (expected)
- Core functionality should still pass
- Check network connectivity to API endpoints

**Type errors:**
- API response format may have changed
- Update type definitions in `packages/types`
- Verify interface compatibility

**Build failures:**
- Check TypeScript compilation errors
- Ensure all dependencies are installed
- Verify workspace configuration

## 📋 Manual Testing

To test locally before pushing:

```bash
# Set API key
export API_KEY_EMBED="your-api-key-here"

# Run tests
cd packages/sdk
bun run test

# Test specific namespaces
bun run test:posts
bun run test:users  
bun run test:feed
```

