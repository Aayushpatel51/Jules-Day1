const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('day-17-password-manager/index.html');

  await page.goto(filePath);

  // 1. Generate and save a password
  console.log('Testing password saving...');
  await page.fill('#passwordLabel', 'Test Label');
  const pwdValue = await page.inputValue('#passwordOutput');
  await page.click('#saveBtn');

  // 2. Verify vault entry
  const vaultText = await page.innerText('#passwordVault');
  console.log('Vault content:', vaultText);
  if (!vaultText.includes('TEST LABEL') || !vaultText.includes(pwdValue)) {
    throw new Error('Password not saved correctly in vault');
  }

  const vaultCount = await page.innerText('#vaultCount');
  if (vaultCount !== '1 Items') throw new Error('Vault count incorrect');

  await page.screenshot({ path: 'verification/day-17-vault.png', fullPage: true });

  // 3. Delete from vault
  console.log('Testing deletion...');
  await page.click('button[onclick*="deleteSaved"]');
  const emptyVault = await page.innerText('#passwordVault');
  if (!emptyVault.includes('Your vault is empty')) throw new Error('Deletion failed');

  console.log('Success!');
  await browser.close();
})();
