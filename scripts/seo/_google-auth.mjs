import crypto from 'node:crypto';
import { getEnvValue } from './_shared.mjs';

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function getRequiredEnv(name) {
  const value = getEnvValue(name);
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getGscSiteUrl() {
  return getRequiredEnv('SEO_GSC_SITE_URL');
}

export async function getGoogleAccessToken(scope) {
  const clientEmail = getRequiredEnv('SEO_GSC_CLIENT_EMAIL');
  const privateKeyPem = getRequiredEnv('SEO_GSC_PRIVATE_KEY').replace(/\\n/g, '\n').trim();
  const privateKey = crypto.createPrivateKey({
    key: privateKeyPem,
    format: 'pem',
  });
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: clientEmail,
    scope,
    aud: TOKEN_ENDPOINT,
    exp: now + 3600,
    iat: now,
  };

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey, 'base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/g, '');

  const assertion = `${unsignedToken}.${signature}`;
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Google access token (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Google access token response did not include access_token.');
  }

  return data.access_token;
}
