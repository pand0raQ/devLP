import { getGoogleAccessToken, getGscSiteUrl } from './_google-auth.mjs';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

async function main() {
  try {
    const siteUrl = getGscSiteUrl();
    const accessToken = await getGoogleAccessToken(SCOPE);
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const startDate = formatDate(thirtyDaysAgo);
    const endDate = formatDate(today);

    console.log(`Querying Google Search Console for: ${siteUrl}`);
    console.log(`Date range: ${startDate} to ${endDate}\n`);

    // 1. Fetch Aggregates
    const aggResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        rowLimit: 1
      })
    });

    if (aggResponse.ok) {
      const aggData = await aggResponse.json();
      if (aggData.rows && aggData.rows.length > 0) {
        const row = aggData.rows[0];
        console.log('--- Site Performance Summary (Last 30 Days) ---');
        console.log(`Total Clicks:       ${row.clicks}`);
        console.log(`Total Impressions:  ${row.impressions}`);
        console.log(`Average CTR:        ${(row.ctr * 100).toFixed(2)}%`);
        console.log(`Average Position:   ${row.position.toFixed(1)}`);
        console.log('----------------------------------------------\n');
      } else {
        console.log('No aggregate performance rows returned.');
      }
    } else {
      console.error(`Aggregate query failed: ${await aggResponse.text()}`);
    }

    // 2. Fetch Top Queries + Pages
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query', 'page'],
        rowLimit: 50
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Queries fetch failed (${response.status}): ${errorText}`);
      return;
    }

    const data = await response.json();
    
    if (!data.rows || data.rows.length === 0) {
      console.log('--- No keyword queries detected yet ---');
      console.log('Search Console data generally has a 2-3 day processing delay.');
      return;
    }

    console.log('--- Top 50 Keywords & Pages ---');
    console.log(
      '#'.padEnd(3) + ' | ' +
      'Query'.padEnd(30) + ' | ' +
      'Page Path'.padEnd(35) + ' | ' +
      'Clicks'.padEnd(6) + ' | ' +
      'Imps'.padEnd(6) + ' | ' +
      'CTR'.padEnd(6) + ' | ' +
      'Pos'.padEnd(5)
    );
    console.log('-'.repeat(105));

    data.rows.forEach((row, idx) => {
      const query = row.keys[0] || '';
      const page = (row.keys[1] || '').replace(siteUrl, '') || '/';
      const clicks = row.clicks;
      const impressions = row.impressions;
      const ctr = (row.ctr * 100).toFixed(1) + '%';
      const position = row.position.toFixed(1);

      console.log(
        String(idx + 1).padEnd(3) + ' | ' +
        query.substring(0, 30).padEnd(30) + ' | ' +
        page.substring(0, 35).padEnd(35) + ' | ' +
        String(clicks).padEnd(6) + ' | ' +
        String(impressions).padEnd(6) + ' | ' +
        ctr.padEnd(6) + ' | ' +
        String(position).padEnd(5)
      );
    });
    
  } catch (error) {
    console.error('Error querying Google Search Console API:', error);
  }
}

await main();
