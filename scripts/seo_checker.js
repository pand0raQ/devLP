import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

console.log('===================================================');
console.log('  GEO & SEO AUDIT RUNNER (Powered by CC Skills)');
console.log('===================================================\n');

let issuesFound = 0;
let passes = 0;

function logPass(message) {
    console.log(`[PASS] ${message}`);
    passes++;
}

function logWarning(message) {
    console.log(`[WARN] ${message}`);
    issuesFound++;
}

function logFail(message) {
    console.log(`[FAIL] ${message}`);
    issuesFound++;
}

// 1. Audit robots.txt
const robotsPath = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    logPass('robots.txt exists in build output.');
    
    if (robots.includes('GPTBot') && robots.includes('ClaudeBot') && robots.includes('PerplexityBot')) {
        logPass('robots.txt contains rules allowing AI crawlers.');
    } else {
        logWarning('robots.txt might be missing specific AI crawler user-agents.');
    }
    
    if (robots.includes('Sitemap:')) {
        logPass('robots.txt points to Sitemap.xml.');
    } else {
        logWarning('robots.txt does not declare Sitemap path.');
    }
} else {
    logFail('robots.txt is missing from build output (dist/robots.txt).');
}

// 2. Audit sitemap.xml
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    logPass('sitemap.xml exists in build output.');
    
    if (sitemap.includes('/hourd/') && sitemap.includes('/timecostify/')) {
        logPass('sitemap.xml correctly references both timecostify and legacy hourd endpoints.');
    } else if (sitemap.includes('/timecostify/')) {
        logPass('sitemap.xml contains timecostify.');
    } else {
        logWarning('sitemap.xml is missing timecostify reference.');
    }
} else {
    logFail('sitemap.xml is missing from build output (dist/sitemap.xml).');
}

// Helper to audit HTML pages
function auditHtmlPage(pageName, relativePath) {
    const filePath = path.join(distDir, relativePath, 'index.html');
    console.log(`\nAuditing Page: ${pageName} (${relativePath})`);
    
    if (!fs.existsSync(filePath)) {
        logFail(`index.html not found at ${filePath}`);
        return;
    }
    
    const html = fs.readFileSync(filePath, 'utf8');
    logPass(`index.html exists.`);

    // Check title tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        const title = titleMatch[1].trim();
        if (title.length > 10 && title.length < 70) {
            logPass(`Title is optimized (${title.length} chars): "${title}"`);
        } else {
            logWarning(`Title tag length (${title.length} chars) is outside the 10-70 recommended range.`);
        }
    } else {
        logFail('Title tag is missing.');
    }

    // Check meta description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || 
                      html.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
    if (descMatch) {
        const desc = descMatch[1].trim();
        if (desc.length > 50 && desc.length < 160) {
            logPass(`Meta description is optimized (${desc.length} chars).`);
        } else {
            logWarning(`Meta description length (${desc.length} chars) is outside the 50-160 range.`);
        }
    } else {
        logFail('Meta description tag is missing.');
    }

    // Check canonical link
    if (html.includes('rel="canonical"') || html.includes("rel='canonical'")) {
        logPass('Canonical link relation present.');
    } else {
        logWarning('Canonical link relation is missing.');
    }

    // Check JSON-LD schema markup
    if (html.includes('application/ld+json')) {
        logPass('JSON-LD structured schema script present.');
        
        if (html.includes('SoftwareApplication') || html.includes('MobileApplication')) {
            logPass('Schema contains SoftwareApplication/MobileApplication definitions.');
        } else {
            logWarning('Schema is missing standard app classifications.');
        }
    } else {
        logFail('Structured JSON-LD schema markup is missing.');
    }

    // Check head elements (h1 check)
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    if (h1Count === 1) {
        logPass('Exactly one H1 element exists.');
    } else if (h1Count > 1) {
        logWarning(`Multiple H1 tags found (${h1Count}). Recommended limit is 1.`);
    } else {
        logFail('No H1 tag found.');
    }
}

// Audit homepage
auditHtmlPage('Homepage', '.');

// Audit Couplestatus page
auditHtmlPage('Couple Status', 'couplestatus');

// Audit Timecostify page
auditHtmlPage('Timecostify', 'timecostify');

// Audit search-intent landing pages
auditHtmlPage('Couples Mood Tracker Widget', 'couples-mood-tracker-widget');
auditHtmlPage('Long-Distance Couple App', 'long-distance-couple-app');
auditHtmlPage('Partner Availability App', 'partner-availability-app');
auditHtmlPage('Price in Work Hours Calculator', 'price-in-work-hours-calculator');

console.log('\n===================================================');
console.log(` Audit Complete: ${passes} Checks Passed, ${issuesFound} Suggestions/Issues.`);
console.log('===================================================');
process.exit(issuesFound > 0 ? 1 : 0);
