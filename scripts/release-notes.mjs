import { readFile } from 'node:fs/promises';

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const heading = `## [${version}]`;
const start = changelog.indexOf(heading);
if (start < 0) throw new Error(`Missing changelog entry for ${version}`);
const end = changelog.indexOf('\n## [', start + heading.length);
process.stdout.write(`${changelog.slice(start, end < 0 ? undefined : end).trim()}\n\n`);
process.stdout.write('Read the [documentation and changelog](https://adminator.colorlib.com/docs/changelog/) or try the [live demo](https://preview.colorlib.com/theme/adminator/).\n');
