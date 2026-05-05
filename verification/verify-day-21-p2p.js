const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();

  // Create two separate contexts to simulate two "devices"
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();

  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  const filePath = 'file://' + path.resolve('day-21-realtime-chat/index.html');

  console.log('Loading Device A and Device B...');
  await pageA.goto(filePath);
  await pageB.goto(filePath);

  // Wait for Peer IDs to be generated
  await pageA.waitForFunction(() => document.getElementById('myId').textContent !== '----');
  await pageB.waitForFunction(() => document.getElementById('myId').textContent !== '----');

  const idA = await pageA.innerText('#myId');
  const idB = await pageB.innerText('#myId');

  console.log('Device A ID:', idA);
  console.log('Device B ID:', idB);

  // Connect A to B
  console.log('Connecting A to B...');
  await pageA.fill('#remoteId', idB);
  await pageA.click('#connectBtn');

  // Wait for connection to open on both ends
  await pageA.waitForFunction(() => !document.getElementById('chatInput').disabled);
  await pageB.waitForFunction(() => !document.getElementById('chatInput').disabled);

  console.log('Connection established.');

  // Send message from A to B
  console.log('Sending message A -> B...');
  await pageA.fill('#chatInput', 'Hello from Device A!');
  await pageA.press('#chatInput', 'Enter');

  // Verify B received it
  await pageB.waitForSelector('text=Hello from Device A!');
  console.log('Device B received message.');

  // Send message from B to A
  console.log('Sending message B -> A...');
  await pageB.fill('#chatInput', 'Received! Hello back from Device B.');
  await pageB.press('#chatInput', 'Enter');

  // Verify A received it
  await pageA.waitForSelector('text=Received! Hello back from Device B.');
  console.log('Device A received message.');

  await pageA.screenshot({ path: 'verification/day-21-p2p-A.png' });
  await pageB.screenshot({ path: 'verification/day-21-p2p-B.png' });

  console.log('Success!');
  await browser.close();
})();
