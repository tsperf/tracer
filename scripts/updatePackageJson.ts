import { readFileSync, writeFileSync } from 'node:fs'
import { contributesForPackageJson } from '../src/genPackageContributions'

const str = readFileSync('./package.json').toString()
const json = JSON.parse(str)

json.contributes = contributesForPackageJson

const outStr = JSON.stringify(json, null, 2)

writeFileSync('./package.json', outStr)
