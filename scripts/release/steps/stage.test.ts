import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { updatesMaster } from './stage.ts';
import { parseVersion } from '../lib/version.ts';

describe('stage', () => {
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
});
