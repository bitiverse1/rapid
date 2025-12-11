# Troubleshooting Autocomplete

## The autocomplete is properly configured. If it's not working, try these steps:

### 1. Restart TypeScript Server
- Open Command Palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type: "TypeScript: Restart TS Server"
- Press Enter

### 2. Reload VS Code Window
- Open Command Palette: `Cmd+Shift+P` or `Ctrl+Shift+P`
- Type: "Developer: Reload Window"
- Press Enter

### 3. Check TypeScript Version
- Open Command Palette
- Type: "TypeScript: Select TypeScript Version"
- Choose "Use Workspace Version" (should be 5.7.2)

### 4. Verify Setup
Open `apps/user-service/test-autocomplete.ts` and:
1. Place cursor between the quotes on line 20: `configCtrl.get('')`
2. Press `Ctrl+Space` (or `Cmd+Space` on Mac)
3. You should see all config properties

### 5. Manual Test
In `apps/user-service/lib/user-service-stack.ts`:
```typescript
// Place cursor here ↓ and press Ctrl+Space
configCtrl.get('')
```

Expected autocomplete suggestions:
- ✅ `stage`
- ✅ `project`  
- ✅ `awsAccountId`
- ✅ `awsRegion`
- ✅ `logLevel`
- ✅ `app1SpecificSetting`
- ✅ `app1MaxUsers`
- ✅ `app1EnableNotifications`
- ✅ `userTableName`
- ✅ `jwtSecret`
- ✅ ... and more

### 6. Test Partial Matching
Type inside the quotes:
```typescript
configCtrl.get('app1')  // Shows: app1SpecificSetting, app1MaxUsers, app1EnableNotifications
configCtrl.get('user')  // Shows: userTableName, userTableReadCapacity, userTableWriteCapacity
configCtrl.get('jwt')   // Shows: jwtSecret, jwtExpirationMinutes
```

### 7. Verify Type Inference
Hover over a variable to see its inferred type:
```typescript
const maxUsers = configCtrl.get('app1MaxUsers');
// Hover over 'maxUsers' → should show: const maxUsers: number
```

### 8. Check for Errors
If you see TypeScript errors, run:
```bash
cd apps/user-service
pnpm tsc --noEmit
```

Should show no errors.

### 9. ESLint Interference
If ESLint is slow or causing issues:
- Disable ESLint temporarily
- Or add to `.vscode/settings.json`:
```json
{
  "eslint.enable": false
}
```

### 10. Still Not Working?
The types are correctly configured. The issue is likely:
- VS Code's TypeScript server is cached
- Wrong TypeScript version selected
- ESLint extension interfering
- Need to close and reopen the file

Try the nuclear option:
1. Close all editor tabs
2. Delete `apps/user-service/.tsbuildinfo` if it exists
3. Run `pnpm build` again
4. Restart VS Code completely
5. Open `apps/user-service/lib/user-service-stack.ts`
6. Test autocomplete

## Confirmation
If you can see this in `test-autocomplete.ts` on line 20:
```typescript
const test1 = configCtrl.get(''); // ← cursor here, press Ctrl+Space
```

And you see a dropdown with all the properties listed above, **it's working!**
