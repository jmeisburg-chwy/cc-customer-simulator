# Simple Guide: Using Codex With Chewy GitHub

This is the simple version for a nontechnical team.

## What GitHub Is For

GitHub is where the project lives online.

It helps your team:

- save work
- track changes
- share the repo
- go back if something breaks

## Before You Start

Each person needs:

- Codex Desktop on their computer
- a GitHub account that is part of `Chewy-Inc`
- access to the right Chewy team or repo

## Important: Codex Access And GitHub Access Are Not The Same

There are two separate things:

1. Codex being connected to GitHub
2. your computer being able to push code to GitHub

Both need to be set up.

## One-Time Setup

### 1. Sign into GitHub in Codex Desktop

How to do it:

1. Open Codex Desktop.
2. Find the GitHub connection option in Codex and choose `Connect to GitHub` or `Sign in to GitHub`.
3. A browser window should open.
4. Sign into the GitHub account that your team uses for `Chewy-Inc`.
5. Approve the connection when GitHub asks.

If Codex is connected to the wrong GitHub account, it may not be able to see or create org repos.

### 2. Make sure Codex has access to the Chewy org

How to do it:

1. During GitHub connection, GitHub may ask where to install or authorize the GitHub app.
2. Choose `Chewy-Inc`, not a personal account.
3. If GitHub asks which repositories to allow, choose the repos your team should use, or allow all if that is your normal Chewy process.
4. If `Chewy-Inc` does not appear as an option, or GitHub says approval is required, send the request to a Chewy GitHub admin.
5. The admin may need to approve or install the GitHub app for the `Chewy-Inc` org before Codex can create or see org repos.

If that is already set up, your team can skip this.

### 3. Set up GitHub login for pushing code

To push updates from the computer to GitHub, each person should sign in with GitHub CLI.

First, open the terminal in Codex Desktop:

1. Click `View`
2. Click `Toggle Terminal`

Use:

```bash
gh auth login
```

This is the easiest option for a nontechnical team.

Important:

- GitHub does not use your normal website password for `git push`
- usually you should use `gh auth login`
- other methods like SSH keys or tokens exist, but they are more advanced

## Simple Workflow

### 1. Start your project in Codex

Ask Codex to create the project.

Example:

```text
Help me create a simple app for [your idea].
Please keep the structure clean and easy to understand.
```

### 2. Ask Codex to turn on version control

Ask Codex to initialize Git and add the basic files.

Example:

```text
Please initialize Git for this project and add a simple README and .gitignore.
```

### 3. Save the first checkpoint

Ask Codex to help save the first commit.

A commit is just a saved version of the project.

### 4. Create the repo in `Chewy-Inc`

There are two ways:

- create it on GitHub.com first
- or create it from Codex if Codex has org access

If your team is unsure, the easiest path is:

1. go to GitHub.com
2. create a new repo inside `Chewy-Inc`
3. leave it empty if the project already exists on the computer

Then ask Codex:

```text
I created an empty repo in the Chewy-Inc org. Help me connect this project to it and push the code.
```

### 5. Push updates

Once the repo is connected, pushing updates is just sending the latest saved changes to GitHub.

If `gh auth login` was already done on that computer, this should usually work without extra passwords.

## Do They Need A Password, Token, Or Key?

For most teammates, the simplest answer is:

- use `gh auth login`
- sign in once
- after that, pushing usually works

They should not need to type their normal GitHub website password into Git.

Advanced options like SSH keys or personal access tokens are possible, but they are usually not the easiest choice for a nontechnical team.

## How To Get The Repo Into `customer-care-l-d`

Creating a repo in `Chewy-Inc` does not automatically add it to the team.

Someone with the right GitHub permissions needs to add the team to the repo.

On GitHub.com:

1. open the repo
2. click `Settings`
3. click `Collaborators & teams`
4. click `Add teams`
5. choose `customer-care-l-d`
6. give the team `Write` access

That gives the team access to work in the repo.

## If Someone Cannot Create A Repo

Usually the reason is one of these:

- they are signed into the wrong GitHub account
- Codex is not connected to the Chewy org
- they do not have permission to create repos in `Chewy-Inc`
- GitHub CLI login was not set up on their computer

## Best Habit

Do not wait until the project is finished to save it.

Save often.

Ask Codex for small changes, then save those changes to GitHub.

## Simple Team Rules

1. Use the Chewy GitHub account in Codex.
2. Run `gh auth login` once on each computer.
3. Save work often.
4. Never upload passwords or API keys.
5. Add the right team to the repo on GitHub.com.

## Copy/Paste Prompt For Your Team

```text
I am starting a new project for Chewy.
Please help me:
- initialize Git
- add a README
- add a .gitignore
- save the first commit
- connect this project to a repo in the Chewy-Inc GitHub org
- explain the steps simply
```
