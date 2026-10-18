const puppeteer = require('C:/Users/Windows User/.gemini/antigravity-ide/brain/144e5134-e54d-4a3f-9139-fb9cd09fd05a/scratch/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const execPath = fs.existsSync(edgePath) ? edgePath : chromePath;

  console.log('Launching browser with:', execPath);
  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 576 });

  const htmlUrl = 'file:///' + path.join(__dirname, 'party.html').replace(/\\/g, '/');
  console.log('Opening:', htmlUrl);
  await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

  // 1. Take screenshot of Screen 1: CREATE / JOIN screen
  await page.screenshot({ path: path.join(__dirname, 'screenshot_menu.png') });
  console.log('Saved screenshot_menu.png');

  // 2. Click "CREATE" button to transition to Screen 2: YOUR PARTY
  await page.click('#btnCreate');
  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot of Screen 2: YOUR PARTY screen with CHAT button at bottom right
  await page.screenshot({ path: path.join(__dirname, 'screenshot_party.png') });
  console.log('Saved screenshot_party.png');

  // 3. Click the "CHAT" button to open the Party Chat Drawer
  await page.click('#btnPartyChat');
  await new Promise(r => setTimeout(r, 400));

  // Type and send a message
  await page.type('#chatInput', 'READY FOR GEOMETRY RUSH!');
  await page.click('#btnSendChat');
  await new Promise(r => setTimeout(r, 300));

  // Take screenshot of open Chat Drawer
  await page.screenshot({ path: path.join(__dirname, 'screenshot_chat.png') });
  console.log('Saved screenshot_chat.png');

  // 4. Verify clicking on avatar does NOT open any icon picker
  const avatar = await page.$('.grp-me .grp-icon-wrapper');
  if (avatar) {
    await avatar.click();
    await new Promise(r => setTimeout(r, 300));
    const modal = await page.$('.grp-icon-modal');
    console.log('Icon modal exists?', !!modal); // should be false
  }

  await browser.close();
  console.log('All previews and checks complete!');
})();
