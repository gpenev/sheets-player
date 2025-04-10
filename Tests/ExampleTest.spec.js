import { test, expect } from '@playwright/test';
const { dateFormatted } = require('../utils.js');
import xlsx from 'xlsx';

test('Example test - Search with data from the ExampleSheet file', async ({ page }) => {
  // Load the spreadsheet
  const filePath = 'Tests/ExampleSheet.xlsx'; // Ensure you have downloaded the file
  const workbook = xlsx.readFile(filePath, {cellDates: true}); // Read the file; cellDates: true is needed for reading dates correctly

  const sheetName = workbook.SheetNames[0]; // Select first sheet
  const sheet = workbook.Sheets[sheetName]; //Access the sheet using the name

  // Convert the sheet to JSON
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Extract a specific column (e.g., column 'A')
  const columnBird = 0; // 'A' = 0, 'B' = 1, 'C' = 2, etc.
  const Bird = data.map(row => row[columnBird] ?? '');
  console.log (`${Bird.length - 1} birds in the spreadsheet`);

  const columnLocation = 1;
  const Location = data.map(row => row[columnLocation] ?? '');

  const columnDate = 2;
  const Date = data.map(row => row[columnDate]);

  // Go to the website to perform searches with the data from the spreadsheet
  for (let i = 1; i < Bird.length; i++) {
    //Entering data from table
    console.log(`---------- Bird ${i}, Line ${i + 1}: ----------`);

    await page.goto('/observations');
    await expect.soft(page).toHaveTitle('Observations ·  iNaturalist');

    console.log(`Bird: ${Bird[i]}`);
    await page.getByPlaceholder('Species').pressSequentially(Bird[i]); // pressSequentially() imitates real typing
    await page.locator('li.ac-result .title').getByText(Bird[i], { exact: true }).click();

    console.log(`Location: ${Location[i]}`);
    await page.getByPlaceholder('Location').pressSequentially(Location[i]);
    await page.locator('.pac-container .pac-item').first().click();

    //Wait a request for getting data to end before to vierify results
    const response = await page.request.get('https://api.inaturalist.org/v1/observations/observers?verifiable=true&spam=false&iconic_taxa%5B%5D=Aves&place_id=8241&taxon_id=5366&locale=en-GB&per_page=0');
    await expect(response).toBeOK();
    await page.waitForTimeout(1000);

    await expect.soft(page.locator('.observation-grid-cell .display-name').getByText(Bird[i]).first()).toBeVisible();

    const Observations = await page.locator('#obsstatcol .stat-value').innerText();
    console.log(`${Observations} observations of ${Bird[i]} in ${Location[i]}!`)

    //Just a verification the Date is taken and dateFormatted() works even with empty cells
    const DateFormatted = await dateFormatted(Date[i]);
    console.log(`Date: ${DateFormatted}`);
  }
});
