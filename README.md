/firebase
===
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

`cli` for [firebase-admin](https://www.npmjs.com/package/firebase-admin).

**Available Features**  
- Select project credential (`fb-admin project`)
- List users (`fb-admin users`)
- Update custom claims for user (`fb-admin claims`)

## Installation
```bash
# npm
npm install -g @e2fyi/firebase-admin
# yarn
yarn global add @e2fyi/firebase-admin
```

## Project credentials
The `cli` connects to a firebase project by loading the environment variable `FIREBASE_SERVICE_ACCOUNT` from `.env`. The `.env` can be automatically generate with the `fb-admin project <PATH_TO_PROJECT_CRED>` command.

**Creating a service account and getting the project credentials**
- Navigate to the `Service Accounts tab` in your project's settings page.
- Click the `Generate New Private Key` button at the bottom of the Firebase Admin SDK section of the Service Accounts tab.
- Download and keep the JSON file in a secure location.

Example
```bash
# setup current project to
# `~/.firebase/firebase_service_account.json`
fb-admin project ~/.firebase/firebase_service_account.json
```

Additional resources:
- https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app

## CLI
```bash
# run cli and see help
fb-admin -h
```
```
usage: fb-admin [-h] [-v] {project,claims,users} ...

cli command to manage custom claims for firebase users.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.

subcommands:
  {project,claims,users}
    project             Setup credential for a firebase project.
    claims              Update the custom claims of a firebase user.
    users               List firebase users.
```

###  SUBCOMMAND `PROJECT`
Select a project by providing the path to the service account credentials.
```
usage: fb-admin project [-h] cred

Positional arguments:
  cred        Path to the JSON credential for firebase project.

Optional arguments:
  -h, --help  Show this help message and exit.
```
Example
```bash
fb-admin project ~/.firebase/firebase_service_account.json
```

### SUBCOMMAND `CLAIMS`
Update the [customClaims](https://firebase.google.com/docs/auth/admin/custom-claims) of a user.
```
usage: fb-admin claims [-h] [-d DATA] [-f FLAGS] email

Positional arguments:
  email                 ptnet user email

Optional arguments:
  -h, --help            Show this help message and exit.
  -d DATA, --data DATA  Set the custom claims with the JSON string. e.g.
                        '{"admin":1}'
  -f FLAGS, --flags FLAGS
                        Set a flag in custom claims with semicolon-delimited
                        <field=value> pairs. e.g. -f admin=1;scope=all;
```
Examples
```bash
# equivalent to -d {"admin": 1, "scope": "all"}
fb-admin claims someone@email.com -f admin=1;scope=all;
```
```bash
# equivalent to -f admin=1
fb-admin claims someone@email.com -d '{"admin":1}';
```


### SUBCOMMAND `USERS`
List or search users based on email.
```
usage: fb-admin users [-h] [-m MATCH]

Optional arguments:
  -h, --help            Show this help message and exit.
  -m MATCH, --match MATCH
                        List only users with email matching the provided
                        minimatch pattern. e.g. *@email.com
```
Examples
```bash
# list all users
fb-admin users
```
```bash
# list all users with email domain "email.com"
fb-admin users -m *@email.com;
```
