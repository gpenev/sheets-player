import { expect } from '@playwright/test';

async function dateFormatted(date) {
    if (date === '' || date === undefined){
        return '';
    } else {
        const DateTimeZone = date.toLocaleString().toString().split(',')[0];
        const [month, day, year] = DateTimeZone.split('/'); // Split by "/"
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        return formattedDate;
    }   
}

async function drupalLogin(page) {
    await page.goto('/user/login');
    await page.locator('#edit-name').fill(process.env.DRUPALUSER);
    await page.locator('#edit-pass').fill(process.env.DRUPALPASS);
    await page.locator('#edit-submit').click();
    await page.waitForTimeout(10000);
    await expect.soft(page.locator('#toolbar-bar')).toBeVisible();
}

async function chosen(page, selector, value) {
    await page.locator(selector).click();
    await page.locator(`${selector} .chosen-search-input`).pressSequentially(value,{delay: 100});
    await page.locator(`${selector} .chosen-search-input`).press('Enter');
}
  
module.exports = { dateFormatted, drupalLogin, chosen };