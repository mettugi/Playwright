import { test,  expect } from "@playwright/test";
import * as fs from 'fs'

test('User should be able to download a file', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/download`);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', {name: 'zero_bytes_file.txt' , exact: true}).click(); 
  const download = await downloadPromise;
  const filePath = '../downloads/' + download.suggestedFilename()
  await download.saveAs(filePath);
  
  expect(fs.existsSync(filePath)).toBeTruthy();
});
