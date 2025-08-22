const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const DEPLOYMENT_URL = 'https://gogumafarm-landing3.vercel.app';
const CHECK_INTERVAL = 5000; // 5초마다 체크
const MAX_ATTEMPTS = 30; // 최대 30번 시도 (2.5분)

let checkCount = 0;

async function checkDeploymentStatus() {
  return new Promise((resolve) => {
    https.get(DEPLOYMENT_URL, (res) => {
      console.log(`[${new Date().toISOString()}] Status Code: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        console.log('✅ Deployment successful!');
        resolve(true);
      } else if (res.statusCode === 404) {
        console.log('❌ 404 Error - Site not found');
        resolve(false);
      } else {
        console.log(`⚠️ Unexpected status code: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      resolve(false);
    });
  });
}

async function getVercelLogs() {
  try {
    const { stdout } = await execPromise('vercel logs --limit 10');
    console.log('\n📋 Recent Vercel Logs:');
    console.log(stdout);
  } catch (error) {
    console.log('Could not fetch Vercel logs:', error.message);
  }
}

async function monitorDeployment() {
  console.log(`🚀 Starting deployment monitoring for ${DEPLOYMENT_URL}`);
  console.log('=' .repeat(60));
  
  const interval = setInterval(async () => {
    checkCount++;
    console.log(`\n🔍 Check #${checkCount}/${MAX_ATTEMPTS}`);
    
    const isSuccessful = await checkDeploymentStatus();
    
    if (isSuccessful || checkCount >= MAX_ATTEMPTS) {
      clearInterval(interval);
      
      if (!isSuccessful) {
        console.log('\n⏱️ Maximum attempts reached. Fetching logs...');
        await getVercelLogs();
      }
      
      console.log('\n' + '=' .repeat(60));
      console.log('Monitoring complete.');
      process.exit(isSuccessful ? 0 : 1);
    }
  }, CHECK_INTERVAL);
}

// 시작
monitorDeployment();