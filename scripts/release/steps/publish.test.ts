import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  afterEach, beforeEach, describe, it,
} from 'node:test';
import { PUBLISHABLE_PACKAGES, getPublishDir } from '../config.ts';
import { parseVersion } from '../lib/version.ts';
import {
  assertBuiltVersion,
  assertPublishAllowed,
  getUnpublished,
  publishPackages,
  updatesMaster,
  waitUntilInstallable,
  waitUntilPublished,
} from './publish.ts';

describe('publish', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-publish-'));

    PUBLISHABLE_PACKAGES.forEach((pkg) => {
      fs.mkdirSync(path.join(root, pkg.dir), { recursive: true });
      fs.writeFileSync(
        path.join(root, pkg.dir, 'package.json'),
        JSON.stringify({ name: `@test/${path.basename(pkg.dir)}` })
      );
    });
  });

  afterEach(() => {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  });

  describe('getUnpublished', () => {
    it('returns the packages that are not published, in publishing order', () => {
      const published = new Set(['@test/core', '@test/engage']);

      const unpublished = getUnpublished(
        parseVersion('7.33.0'),
        root,
        name => published.has(name)
      );

      assert.equal(unpublished.length, PUBLISHABLE_PACKAGES.length - 2);
      assert.equal(unpublished.includes('@test/core'), false);
      assert.equal(unpublished.includes('@test/engage'), false);
      assert.deepEqual(
        unpublished,
        PUBLISHABLE_PACKAGES
          .map(pkg => `@test/${path.basename(pkg.dir)}`)
          .filter(name => !published.has(name))
      );
    });

    it('asks for the version that is released', () => {
      const versions = new Set<string>();

      getUnpublished(parseVersion('v7.33.0-beta.1'), root, (name, version) => {
        versions.add(version);
        return true;
      });

      assert.deepEqual([...versions], ['7.33.0-beta.1']);
    });

    it('returns nothing when everything is published', () => {
      assert.deepEqual(getUnpublished(parseVersion('7.33.0'), root, () => true), []);
    });
  });

  describe('publishPackages', () => {
    const version = parseVersion('7.33.0');

    /**
     * Writes a build with the given version for every package.
     * @param builtVersion The version of the builds.
     */
    const writeBuilds = (builtVersion: string) => {
      PUBLISHABLE_PACKAGES.forEach((pkg) => {
        const publishDir = getPublishDir(pkg, root);
        fs.mkdirSync(publishDir, { recursive: true });
        fs.writeFileSync(path.join(publishDir, 'package.json'), JSON.stringify({
          name: `@test/${path.basename(pkg.dir)}`,
          version: builtVersion,
        }));
      });
    };

    it('publishes the unpublished packages in publishing order with the dist-tag', () => {
      writeBuilds('7.33.0');
      const sent: [string, string, boolean][] = [];

      publishPackages(version, false, root, {
        check: name => name === '@test/core',
        send: (dir, tag, dryRun) => sent.push([dir, tag, dryRun]),
        distTag: 'latest',
      });

      assert.deepEqual(
        sent,
        PUBLISHABLE_PACKAGES.slice(1).map(pkg => [getPublishDir(pkg, root), 'latest', false])
      );
    });

    it('passes the dry run on', () => {
      writeBuilds('7.33.0');
      const dryRuns = new Set<boolean>();

      publishPackages(version, true, root, {
        check: () => false,
        send: (dir, tag, dryRun) => dryRuns.add(dryRun),
        distTag: 'beta',
      });

      assert.deepEqual([...dryRuns], [true]);
    });

    it('publishes nothing when one of the builds has another version', () => {
      writeBuilds('7.33.0');
      const last = PUBLISHABLE_PACKAGES[PUBLISHABLE_PACKAGES.length - 1];
      fs.writeFileSync(
        path.join(getPublishDir(last, root), 'package.json'),
        JSON.stringify({ version: '7.32.9' })
      );
      let sent = 0;

      assert.throws(() => publishPackages(version, false, root, {
        check: () => false,
        send: () => {
          sent += 1;
        },
        distTag: 'latest',
      }), /contains version 7\.32\.9, expected 7\.33\.0/);
      assert.equal(sent, 0);
    });

    it('does not check the build of a published package', () => {
      let sent = 0;

      publishPackages(version, false, root, {
        check: () => true,
        send: () => {
          sent += 1;
        },
        distTag: 'latest',
      });

      assert.equal(sent, 0);
    });
  });

  describe('assertPublishAllowed', () => {
    it('allows publishing in the GitHub workflow', () => {
      assert.doesNotThrow(() => assertPublishAllowed(false, { GITHUB_ACTIONS: 'true' }));
    });

    it('refuses publishing anywhere else', () => {
      assert.throws(() => assertPublishAllowed(false, {}), /only published by the "Publish packages" workflow/);
      assert.throws(() => assertPublishAllowed(false, { CI: 'true' }), /--dry-run/);
    });

    it('allows a dry run everywhere', () => {
      assert.doesNotThrow(() => assertPublishAllowed(true, {}));
    });
  });

  describe('waitUntilPublished', () => {
    const version = parseVersion('7.33.0');

    it('returns right away when all packages are published', async () => {
      let slept = 0;

      await waitUntilPublished(version, root, {
        lookup: () => [],
        sleep: async () => {
          slept += 1;
        },
      });

      assert.equal(slept, 0);
    });

    it('looks again until all packages are published', async () => {
      const states = [['@test/core', '@test/engage'], ['@test/engage'], []];
      let slept = 0;

      await waitUntilPublished(version, root, {
        lookup: () => states[slept],
        sleep: async () => {
          slept += 1;
        },
      });

      assert.equal(slept, 2);
    });

    it('keeps waiting when npm can\'t be asked', async () => {
      let lookups = 0;

      await waitUntilPublished(version, root, {
        lookup: () => {
          lookups += 1;

          if (lookups === 1) {
            throw new Error('npm view failed');
          }

          return [];
        },
        sleep: () => Promise.resolve(),
      });

      assert.equal(lookups, 2);
    });

    it('fails with the missing packages after the timeout', async () => {
      let time = 0;
      let slept = 0;

      await assert.rejects(
        waitUntilPublished(version, root, {
          lookup: () => {
            time += 20000;
            return ['@test/webpack'];
          },
          sleep: async (duration) => {
            time += duration;
            slept += 1;
          },
          now: () => time,
          timeout: 60000,
          interval: 30000,
        }),
        /Not published after 1 minutes: @test\/webpack\. Nothing was changed so far\. Open the run of the "Publish packages" workflow for releases\/v7\.33\.0: https:\/\/github\.com\/shopgate\/pwa\/actions\/workflows\/publish\.yml\?query=branch%3Areleases%2Fv7\.33\.0\. .* Then retry this job\./
      );

      assert.equal(slept, 1);
    });

    it('reports that it still waits while nothing changes', async (t) => {
      const log = t.mock.method(console, 'log', () => undefined);
      let time = 0;

      await assert.rejects(waitUntilPublished(version, root, {
        lookup: () => ['@test/webpack'],
        sleep: async (duration) => {
          time += duration;
        },
        now: () => time,
        timeout: 11 * 60000,
        interval: 30000,
        reminder: 5 * 60000,
      }));

      const lines = log.mock.calls.map(call => String(call.arguments[0]));

      assert.deepEqual(lines.filter(line => !line.includes('==>')).filter(Boolean), [
        'Waiting for: @test/webpack',
        'Still waiting after 5 minutes',
        'Still waiting after 10 minutes',
      ]);
    });
  });

  describe('waitUntilInstallable', () => {
    const version = parseVersion('7.33.0');

    it('returns right away when all packages are installable', async () => {
      let slept = 0;

      await waitUntilInstallable(version, root, {
        check: async () => true,
        sleep: async () => {
          slept += 1;
        },
      });

      assert.equal(slept, 0);
    });

    it('checks only the missing packages again until they are installable', async () => {
      const calls: Record<string, number> = {};
      let slept = 0;

      await waitUntilInstallable(version, root, {
        check: async (name) => {
          calls[name] = (calls[name] ?? 0) + 1;
          return name !== '@test/engage' || calls[name] >= 3;
        },
        sleep: async () => {
          slept += 1;
        },
      });

      assert.equal(slept, 2);
      assert.equal(calls['@test/engage'], 3);
      assert.equal(calls['@test/core'], 1);
    });

    it('asks for the released version', async () => {
      const versions = new Set<string>();

      await waitUntilInstallable(version, root, {
        check: async (name, checkedVersion) => {
          versions.add(checkedVersion);
          return true;
        },
      });

      assert.deepEqual([...versions], ['7.33.0']);
    });

    it('fails with the missing packages after the timeout', async () => {
      await assert.rejects(
        waitUntilInstallable(version, root, {
          check: async name => name !== '@test/webpack',
          sleep: () => Promise.resolve(),
          timeout: 30000,
          interval: 15000,
        }),
        /Not installable after 1 minutes: @test\/webpack\./
      );
    });
  });

  describe('updatesMaster', () => {
    it('leaves master unchanged with SKIP_MASTER_UPDATE without asking npm', () => {
      assert.equal(
        updatesMaster({
          version: parseVersion('7.33.0'),
          skipMasterUpdate: true,
        }, '/nonexistent'),
        false
      );
    });
  });

  describe('assertBuiltVersion', () => {
    const [pkg] = PUBLISHABLE_PACKAGES;

    it('accepts a build with the version to release', () => {
      const publishDir = getPublishDir(pkg, root);
      fs.mkdirSync(publishDir, { recursive: true });
      fs.writeFileSync(path.join(publishDir, 'package.json'), JSON.stringify({ version: '7.33.0' }));

      assert.doesNotThrow(() => assertBuiltVersion(pkg, parseVersion('7.33.0'), root));
    });

    it('rejects a build with another version', () => {
      const publishDir = getPublishDir(pkg, root);
      fs.mkdirSync(publishDir, { recursive: true });
      fs.writeFileSync(path.join(publishDir, 'package.json'), JSON.stringify({ version: '7.32.9' }));

      assert.throws(
        () => assertBuiltVersion(pkg, parseVersion('7.33.0'), root),
        /contains version 7\.32\.9, expected 7\.33\.0/
      );
    });

    it('rejects a missing build', () => {
      fs.rmSync(getPublishDir(pkg, root), {
        recursive: true,
        force: true,
      });

      assert.throws(
        () => assertBuiltVersion(pkg, parseVersion('7.33.0'), root),
        /Run the build first/
      );
    });
  });
});
