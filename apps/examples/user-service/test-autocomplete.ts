import { ConfigController } from '@rapid/config';

import type { UserServiceConfig } from './config/types';
import { getConfig } from './config';

/**
 * Test file to verify autocomplete functionality
 * 
 * INSTRUCTIONS TO TEST AUTOCOMPLETE:
 * 
 * 1. Place your cursor inside the quotes on line 17 or 20
 * 2. Press Ctrl+Space (Windows/Linux) or Cmd+Space (Mac)
 * 3. You should see a list of all available config properties
 * 
 * Expected properties include:
 * - stage, project, awsAccountId, awsRegion, logLevel (from BaseConfig)
 * - app1SpecificSetting, app1MaxUsers, app1EnableNotifications
 * - userTableName, jwtSecret, maxLoginAttempts, etc.
 */

const config = getConfig('dev');
const configCtrl = new ConfigController<UserServiceConfig>(config);

// Test 1: Place cursor inside quotes and press Ctrl+Space to see ALL available keys
// Delete the text below and start typing to see autocomplete suggestions
const stage = configCtrl.get('stage');

// Test 2: Start typing 'app1' - you'll see: app1SpecificSetting, app1MaxUsers, app1EnableNotifications
const app1Setting = configCtrl.get('app1SpecificSetting');

// Test 3: Hover over variables to see their inferred types
const app1MaxUsers = configCtrl.get('app1MaxUsers'); // number
const userTableName = configCtrl.get('userTableName'); // string

console.log('Autocomplete test:', stage, app1Setting, app1MaxUsers, userTableName);

// Test 4: TypeScript will show an error for invalid keys (uncomment to test)
// const invalid = configCtrl.get('nonExistentProperty'); // ❌ Error!

console.log('If you can see autocomplete suggestions, it works!');
console.log('Stage:', stage);
console.log('App1 Setting:', app1Setting);
console.log('App1 Max Users:', app1MaxUsers);
