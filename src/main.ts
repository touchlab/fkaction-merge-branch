import * as core from '@actions/core'
import * as github from '@actions/github'
import fetch from 'node-fetch'

async function run(): Promise<void> {
  try {
    await mergeBranch()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function mergeBranch() {
  const owner = github.context.repo.owner
  const repo = github.context.repo.repo
  const faktorySecretKey: string = core.getInput('FAKTORY_SECRET_KEY')
  const buildBranch: string = core.getInput('build_branch')
  const params = `buildBranch=${encodeURIComponent(buildBranch)}`

  await fetch(
    `https://api.touchlab.dev/gh/mergeBranch/${owner}/${repo}?${params}`, {
      headers: {"faktorySecretKey": faktorySecretKey}
    }
  ).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text)
        })
      } else {
        return response
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      if (error instanceof Error) {
        core.setFailed(error.message)
      } else {
        core.setFailed(error)
      }
    })
}

run()
