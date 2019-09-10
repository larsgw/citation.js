const https = require('https')
const { promises: fs } = require('fs')
const path = require('path')
const semver = require('semver')
const { version: currentVersion } = require('../package')

const newVersion = process.argv
  .slice(2)
  .map(spec => spec.split('@')[2])
  .sort(semver.compare)
  .pop()

https.get('https://raw.githubusercontent.com/citation-js/citation-js/v0.5/CHANGELOG.md', res => {
  let data = ''
  res.on('data', d => { data += d })
  res.on('end', () => { amendChangelog(data).catch(console.error) })
}).on('err', console.error)

async function amendChangelog (data) {
  const changelog = extractChangelog(data, currentVersion)
  const date = (new Date()).toISOString().split('T')[0]
  const versionSlug = `${newVersion.replace(/\./g, '')}-${data.match(/^# .*? \((\d{4}-\d{2}-\d{2})\)/)[1]}`
  const filePath = path.join(__dirname, '..', 'CHANGELOG.md')
  const file = (await fs.readFile(filePath, 'utf8'))
    .replace(/# Changelog\n\n/, `$&## [\`${newVersion}\`](https://github.com/larsgw/citation.js/compare/v${currentVersion}...v${newVersion}) - ${date}

* Pin component versions to [\`${newVersion}\`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#${versionSlug}):

${changelog}\n\n`)
  await fs.writeFile(filePath, file)
}

const subheaderOrder = [
  undefined,
  '### Bug Fixes\n\n',
  '### Features\n\n',
  '### BREAKING CHANGES\n\n'
]

function extractChangelog (changelog, version) {
  return changelog
    // grab all recent versions
    .match(new RegExp(`^#.+\\n{3}([\\s\\S]+?)\\n{4}##? \\[${version}\\]`))[1]
    // split those
    .split(/\n{4}##? .+\n{3}/g)
    // split all subheaders
    .flatMap(version => {
      return version
        .split(/\n{3}/)
        .map(subheader => subheader
          .match(/^(### .+\n{2})?([\s\S]+)$/)
          .slice(1, 3))
    })
    // merge them
    .reduce((subheaders, [name, content]) => {
      const subheader = subheaders.find(subheader => subheader[0] === name)
      if (subheader) {
        subheader[1] += '\n' + content
      } else {
        subheaders.push([name, content])
      }
      return subheaders
    }, [])
    .sort(([a], [b]) => subheaderOrder.indexOf(a) - subheaderOrder.indexOf(b))
    // format
    .map(([name = '', content]) => name + content)
    .join('\n\n\n')
    // quote
    .replace(/^/mg, '> ')
}
