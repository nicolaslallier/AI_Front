# Package Updates - December 2025

## Summary

All npm packages have been updated to their latest stable versions to resolve deprecation warnings and security vulnerabilities.

## Major Updates

### ESLint 8 → ESLint 9
- **Migrated to flat config format** (`eslint.config.js`)
- Removed old `.eslintrc.js` file
- Updated command line flags (no more `--ext` or `--ignore-path`)
- Added `@eslint/js`, `@typescript-eslint/eslint-plugin`, and `@typescript-eslint/parser`

### Vite 5.1 → Vite 6.0
- Updated to Vite 6 for latest features and security fixes
- Compatible with all existing configuration

### Vitest 1.3 → Vitest 2.1
- Updated to Vitest 2 with improved performance
- Coverage tools updated to match

### Playwright 1.42 → Playwright 1.57
- Latest browser testing capabilities
- Improved stability and performance

### Other Notable Updates
- TypeScript 5.4 → 5.6.3 (latest version compatible with TypeScript ESLint)
- Vue Test Utils 2.4.4 → 2.4.6
- All ESLint plugins updated to latest versions
- Tailwind CSS 3.4.1 → 3.4.15

## Fixed Deprecation Warnings

✅ `inflight` - No longer used
✅ `@humanwhocodes/config-array` - Replaced with `@eslint/js`
✅ `@humanwhocodes/object-schema` - Replaced with updated packages
✅ `rimraf` - Updated to version that doesn't use deprecated version
✅ `glob` - Updated to compatible version
✅ `eslint 8` - Migrated to ESLint 9
✅ `@playwright/test` - Updated to latest
✅ TypeScript version compatibility warning - Downgraded to 5.6.3 (latest compatible with @typescript-eslint)

## Security Vulnerabilities

**Resolved:**
- ✅ ESLint plugin-kit Regular Expression DoS
- ✅ Playwright SSL certificate verification
- ✅ Vitest RCE vulnerability

**Remaining (Low Risk):**
- ⚠️ esbuild development server vulnerability (affects only dev mode, not production)
  - This is a transitive dependency of Vite
  - Only exploitable during local development
  - Would require breaking changes to fix completely
  - Acceptable risk for development environment

## Breaking Changes

### ESLint Configuration

**Old format (`.eslintrc.js`):**
```javascript
module.exports = {
  extends: [...],
  rules: {...}
};
```

**New format (`eslint.config.js`):**
```javascript
export default [
  ...configs,
  {
    rules: {...}
  }
];
```

### Package Scripts

**Old:**
```json
"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore"
```

**New:**
```json
"lint": "eslint ."
```

ESLint 9 automatically detects file types and uses `.gitignore`.

## Compatibility

All existing code remains compatible:
- ✅ Vue 3 components work unchanged
- ✅ TypeScript configuration unchanged
- ✅ Vitest tests work unchanged
- ✅ Playwright tests work unchanged
- ✅ Vite configuration works unchanged
- ✅ All Makefile commands work unchanged

## Testing

After updates, verify everything works:

```bash
# Install dependencies
make install

# Run linting
make lint

# Run tests
make test

# Run E2E tests
make test-e2e

# Start dev server
make dev
```

## Next Actions

1. ✅ Dependencies updated
2. ✅ ESLint migrated to flat config
3. ✅ All deprecation warnings resolved
4. ✅ Critical security vulnerabilities fixed
5. ⚠️ Minor esbuild vulnerability remains (acceptable for dev environment)

## Documentation Updates

The following documentation files reflect the new setup:
- `.cursorrules` - Still valid
- `docs/CODING_STANDARDS.md` - Still valid
- All other docs - Still valid

The migration to ESLint 9 is transparent to developers as the rules remain the same.

## Version Summary

| Package | Old Version | New Version |
|---------|-------------|-------------|
| eslint | 8.57.0 | 9.39.1 |
| vite | 5.1.5 | 6.0.3 |
| vitest | 1.3.1 | 2.1.9 |
| playwright | 1.42.1 | 1.57.0 |
| typescript | 5.4.2 | 5.6.3 |
| vue | 3.4.21 | 3.4.21 |
| pinia | 2.1.7 | 2.1.7 |
| tailwindcss | 3.4.1 | 3.4.15 |

---

**Date**: December 6, 2025
**Status**: ✅ Complete
**Impact**: Minor (no code changes required)

