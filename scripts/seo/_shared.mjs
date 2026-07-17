import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, '..', '..');

async function parseEnvFile(relativePath) {
  const envPath = path.join(repoRoot, relativePath);
  const values = new Map();

  try {
    const raw = await fs.readFile(envPath, 'utf8');

    for (const line of raw.split('\n')) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      let value = trimmedLine.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      values.set(key, value);
    }
  } catch {
    return values;
  }

  return values;
}

const envExampleValues = await parseEnvFile('.env.seo.example');
const seoLocalEnvValues = await parseEnvFile('.env.seo.local');
const rootEnvValues = await parseEnvFile('.env');
const functionsEnvValues = await parseEnvFile('functions/.env');

export async function readJsonLikeYaml(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  const raw = await fs.readFile(absolutePath, 'utf8');
  return JSON.parse(raw);
}

export async function fileExists(relativePath) {
  try {
    await fs.access(path.join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(relativePath) {
  await fs.mkdir(path.join(repoRoot, relativePath), { recursive: true });
}

export async function writeTextFile(relativePath, content) {
  const absolutePath = path.join(repoRoot, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf8');
}

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getEnvValue(name) {
  const runtimeValue = process.env[name];

  if (typeof runtimeValue === 'string' && runtimeValue.trim().length > 0) {
    return runtimeValue.trim();
  }

  const seoLocalValue = seoLocalEnvValues.get(name);
  if (typeof seoLocalValue === 'string' && seoLocalValue.trim().length > 0) {
    return seoLocalValue.trim();
  }

  const rootEnvValue = rootEnvValues.get(name);
  if (typeof rootEnvValue === 'string' && rootEnvValue.trim().length > 0) {
    return rootEnvValue.trim();
  }

  const functionsEnvValue = functionsEnvValues.get(name);
  if (typeof functionsEnvValue === 'string' && functionsEnvValue.trim().length > 0) {
    return functionsEnvValue.trim();
  }

  const exampleValue = envExampleValues.get(name);
  return typeof exampleValue === 'string' ? exampleValue.trim() : '';
}

export function isEnvSet(name) {
  return getEnvValue(name).length > 0;
}

export function isPemPrivateKeyValid(name) {
  const rawValue = getEnvValue(name);
  if (!rawValue) {
    return false;
  }

  try {
    const normalized = rawValue.replace(/\\n/g, '\n').trim();
    crypto.createPrivateKey({
      key: normalized,
      format: 'pem',
    });
    return true;
  } catch {
    return false;
  }
}

export function statusLabel(ok) {
  return ok ? 'ready' : 'missing';
}

export function buildAbsoluteUrl(domain, pathname) {
  const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
  return `${normalizedDomain}${pathname}`;
}
