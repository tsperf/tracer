// Verifies challenge-origin doc exists with Algora URL (discrete test for #24 checkbox 1)
import * as fs from 'fs'; import * as path from 'path';
const docPath = path.join(__dirname, '../docs/algora-challenge.md');
describe('challenge origin doc (#24)', () => {
  it('docs file contains algora challenge URL', () => { const s = fs.readFileSync(docPath, 'utf8'); expect(s).toContain('console.algora.io/challenges/tsperf'); });
  it('docs file references issue 24', () => { const s = fs.readFileSync(docPath, 'utf8'); expect(s).toContain('issues/24'); });
});
