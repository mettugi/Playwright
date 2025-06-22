import { expect, test } from "@playwright/test";
import exp = require("constants");
import { readFileSync } from "fs";

test.describe('Upload files Tests', ()=> {
    test('User is able to upload file with "Choose file" button', async ({page}) => {
        await page.goto(`${process.env.BASE_URL}/upload`);
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('#file-upload').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles('./uploads/test.txt');
        await page.getByText('Upload', { exact: true }).click();
        await expect(page.getByText('File Uploaded!')).toBeVisible();
        await expect(page.getByText('test.txt')).toBeVisible();
    })

    test('User is able to upload file using drag and drop area', async ({page}) => {
        await page.goto(`${process.env.BASE_URL}/upload`);
        const buffer = readFileSync('./uploads/test.txt');
        const dataTransfer = await page.evaluateHandle((data) => {
            const dt = new DataTransfer();
            const file = new File([data.toString('hex')], 'test.txt', { type: 'text/plain'});
            dt.items.add(file);
            return dt;
        }, buffer);

        await page.dispatchEvent('#drag-drop-upload', 'drop', { dataTransfer });

        await expect(page.getByText('test.txt')).toBeVisible();
    })
});
