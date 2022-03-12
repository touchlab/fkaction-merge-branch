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

  await fetch(`https://api.touchlab.dev/gh/mergeBranch/${owner}/${repo}`)
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
