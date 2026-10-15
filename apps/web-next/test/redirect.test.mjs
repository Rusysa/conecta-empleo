import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeCallback } from '../src/lib/api.ts';

test('el callback de login solo permite rutas del mismo origen', () => {
  for (const url of [undefined, 'https://evil.example', '//evil.example', '/\\evil.example', '/\nevil.example']) {
    assert.equal(safeCallback(url), '/vacantes');
  }
  assert.equal(safeCallback('/vacantes/123?from=login#detalle'), '/vacantes/123?from=login#detalle');
});
