#!/usr/bin/env node

const fs = require('fs')
const { spawn } = require('child_process')
const { program } = require('commander')
const { description, version } = require('./package.json')

program
  .version(version)
  .description(description)
  .option('-p, --preid <id>', 'pre-release id', 'develop')
  .option('-g, --git-tag-version', 'commit and tag the version change', false)
  .option(
    '-t, --tag <tag>',
    'registers the published package with the given tag',
    'next',
  )

program.parse(process.argv)

fs.writeFileSync(
  '.npmrc',
  `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`,
)

spawn(
  'npm',
  [
    'version',
    'prerelease',
    '--preid',
    program.preid,
    '--git-tag-version',
    program.gitTagVersion,
  ],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
  },
)

spawn('npm', ['publish', '--tag', program.tag], {
  cwd: process.cwd(),
  stdio: 'inherit',
})
