import { getGoogleAccessToken } from './_google-auth.mjs';
import { getEnvValue } from './_shared.mjs';

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

async function main() {
  try {
    const propertyId = getEnvValue('SEO_GA4_PROPERTY_ID');
    if (!propertyId) {
      console.error('Error: Missing SEO_GA4_PROPERTY_ID in .env.seo.local');
      return;
    }
    const accessToken = await getGoogleAccessToken(SCOPE);
    const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

    const body = {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' }
      ],
      dimensions: [{ name: 'pagePath' }],
      limit: 25
    };

    console.log(`Querying GA4 Property ID: ${propertyId}...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`GA4 Query failed with status ${response.status}:`);
      console.error(await response.text());
      return;
    }

    const data = await response.json();
    console.log('\n--- GA4 Traffic Summary (Last 30 Days) ---');
    
    if (!data.rows || data.rows.length === 0) {
      console.log('No GA4 events or traffic logged in this date range.');
      return;
    }

    console.log(
      'Page Path'.padEnd(45) + ' | ' +
      'Views'.padEnd(8) + ' | ' +
      'Active Users'.padEnd(12)
    );
    console.log('-'.repeat(70));

    data.rows.forEach(row => {
      const page = row.dimensionValues[0].value || '/';
      const views = row.metricValues[1].value || '0';
      const users = row.metricValues[0].value || '0';
      console.log(
        page.substring(0, 45).padEnd(45) + ' | ' +
        views.padEnd(8) + ' | ' +
        users.padEnd(12)
      );
    });

  } catch (error) {
    console.error('Error querying GA4 API:', error);
  }
}

await main();
