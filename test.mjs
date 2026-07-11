import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5173/login');
  
  // login
  await page.type('input[type="email"]', 'orgadmin@demo.com');
  await page.type('input[type="password"]', 'password123'); // Assuming standard password
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation();
  
  await page.goto('http://localhost:5173/orgadmin/learners/create');
  
  await page.waitForSelector('input[placeholder="e.g. Jane"]');
  await page.type('input[placeholder="e.g. Jane"]', 'Test');
  await page.type('input[placeholder="e.g. Doe"]', 'User');
  await page.type('input[placeholder="jane.doe@example.com"]', 'test2@demo.com');
  
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if(b.textContent.includes('Continue')) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if(b.textContent.includes('Continue')) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if(b.textContent.includes('Continue')) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if(b.textContent.includes('Create Learner')) b.click();
    });
  });
  
  await new Promise(r => setTimeout(r, 3000));
  console.log("Done");
  await browser.close();
})();
