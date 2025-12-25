#!/usr/bin/env node
/**
 * Source Verification Script
 * Compares live primary source documents against archived versions
 * to detect any modifications or "rewriting of history"
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERIFICATION_FILE = path.join(__dirname, '../src/_data/sourceVerification.json');
const TIMEOUT_MS = 30000;
const MAX_REDIRECTS = 5;

/**
 * Fetch URL content with redirect following
 */
function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > MAX_REDIRECTS) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SourceVerifier/1.0; +https://github.com/piconate/website-civil-war)'
      },
      timeout: TIMEOUT_MS
    };

    const req = protocol.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const urlObj = new URL(url);
          redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
        }
        resolve(fetchUrl(redirectUrl, redirectCount + 1));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Check if text exists in content (case-insensitive, normalized whitespace)
 */
function containsText(content, searchText) {
  const normalizedContent = content
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");

  const normalizedSearch = searchText
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");

  return normalizedContent.includes(normalizedSearch);
}

/**
 * Verify a single source
 */
async function verifySource(source) {
  const result = {
    ...source,
    lastChecked: new Date().toISOString(),
    verified: null,
    warning: null
  };

  console.log(`\nChecking: ${source.name}`);
  console.log(`  Live URL: ${source.liveUrl}`);
  console.log(`  Archive URL: ${source.archiveUrl}`);

  try {
    // Fetch live content
    let liveContent;
    let liveHasText = false;
    try {
      liveContent = await fetchUrl(source.liveUrl);
      liveHasText = containsText(liveContent, source.searchText);
      console.log(`  Live content: ${liveHasText ? '✓ Quote found' : '✗ Quote NOT found'}`);
    } catch (err) {
      console.log(`  Live content: ⚠ Fetch failed (${err.message})`);
    }

    // Fetch archive content
    let archiveContent;
    let archiveHasText = false;
    try {
      archiveContent = await fetchUrl(source.archiveUrl);
      archiveHasText = containsText(archiveContent, source.searchText);
      console.log(`  Archive content: ${archiveHasText ? '✓ Quote found' : '✗ Quote NOT found'}`);
    } catch (err) {
      console.log(`  Archive content: ⚠ Fetch failed (${err.message})`);
    }

    // Determine verification status
    const liveFetchFailed = !liveContent;
    const archiveFetchFailed = !archiveContent;

    if (liveHasText && archiveHasText) {
      result.verified = true;
      console.log(`  Status: ✓ VERIFIED - Quote intact in both versions`);
    } else if (liveFetchFailed && archiveHasText) {
      // Live fetch failed but archive has quote - temporary issue, not tampering
      result.verified = null;
      result.warning = `Temporary issue: Live site returned an error. Will retry on next verification.`;
      console.log(`  Status: ⚠ TEMPORARY ISSUE - Live site unavailable, will retry`);
    } else if (!liveHasText && !liveFetchFailed && archiveHasText) {
      // Live loaded successfully but quote is missing - this IS tampering
      result.verified = false;
      result.warning = `TAMPERING DETECTED: The quote "${source.searchText.substring(0, 50)}..." has been REMOVED from the live document but exists in the archived version from 2023.`;
      console.log(`  Status: ⚠ TAMPERING DETECTED - Quote removed from live version`);
    } else if (liveHasText && !archiveHasText) {
      result.verified = true;
      result.warning = `Note: Quote found in live version but archive fetch may have failed.`;
      console.log(`  Status: ⚠ Archive issue - but live version intact`);
    } else {
      result.verified = null;
      result.warning = `Unable to verify: Quote not found in either version. May require manual review.`;
      console.log(`  Status: ⚠ REVIEW NEEDED - Quote not found in either version`);
    }

  } catch (err) {
    result.verified = null;
    result.warning = `Verification failed: ${err.message}`;
    console.log(`  Status: ⚠ ERROR - ${err.message}`);
  }

  return result;
}

/**
 * Main verification function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('PRIMARY SOURCE VERIFICATION');
  console.log('Comparing live documents against archived versions');
  console.log('='.repeat(60));

  // Read current verification data
  let data;
  try {
    data = JSON.parse(fs.readFileSync(VERIFICATION_FILE, 'utf8'));
  } catch (err) {
    console.error(`Failed to read ${VERIFICATION_FILE}: ${err.message}`);
    process.exit(1);
  }

  // Verify each source
  const results = [];
  for (const source of data.sources) {
    const result = await verifySource(source);
    results.push(result);
    // Rate limit to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Compile warnings
  const warnings = results
    .filter(r => r.verified === false)
    .map(r => ({
      sourceId: r.id,
      sourceName: r.name,
      warning: r.warning,
      detectedAt: r.lastChecked,
      liveUrl: r.liveUrl,
      archiveUrl: r.archiveUrl
    }));

  // Update verification data
  data.sources = results;
  data.lastVerified = new Date().toISOString();
  data.status = warnings.length > 0 ? 'tampering_detected' :
                results.every(r => r.verified === true) ? 'verified' : 'partial';
  data.warnings = warnings;

  // Write updated data
  fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(data, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60));

  const verified = results.filter(r => r.verified === true).length;
  const tampered = results.filter(r => r.verified === false).length;
  const unknown = results.filter(r => r.verified === null).length;

  console.log(`  Verified: ${verified}/${results.length}`);
  console.log(`  Tampered: ${tampered}/${results.length}`);
  console.log(`  Unknown:  ${unknown}/${results.length}`);
  console.log(`  Status:   ${data.status.toUpperCase()}`);

  if (warnings.length > 0) {
    console.log('\n⚠️  TAMPERING WARNINGS:');
    warnings.forEach(w => {
      console.log(`\n  ${w.sourceName}:`);
      console.log(`    ${w.warning}`);
    });
    console.log('\nVerification file updated with warnings.');
    process.exit(1); // Exit with error code for CI
  }

  console.log('\n✓ All sources verified successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
