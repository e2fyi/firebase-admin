'use strict';

// load environment variables in .env
require('dotenv').config({path: `${__dirname}/.env`});
const chalk = require('chalk');
const admin = require('firebase-admin');

// env variables
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;

// guards
if (!FIREBASE_SERVICE_ACCOUNT) {
  console.error(chalk`{yellow WARN: environment variable {bold FIREBASE_SERVICE_ACCOUNT} not found!}`);
  console.error(chalk`{yellow WARN: Please run {bold \`fb-admin project <PATH_TO_CRED>\`} to setup project credentials!}`);
  console.error(chalk`{yellow WARN: firebase app not initialized!}`);
  return;
}
try {
  const cred = require(FIREBASE_SERVICE_ACCOUNT);
  const {project_id} = cred;
  console.log(chalk`{green INFO: CURRENT PROJECT<${project_id}>}`);
  admin.initializeApp({
    credential: admin.credential.cert(cred),
    databaseURL: `https://${project_id}.firebaseio.com`
  });
} catch (error) {
  console.error(chalk`{red ERROR: ${error}}`);
  return;
}

function setCustomClaims(uid, customClaims) {
  // Set admin privilege on the user corresponding to uid.
  return admin.auth().setCustomUserClaims(uid, customClaims);
}

function listCustomClaims(uid) {
  // Lookup the user associated with the specified uid.
  return admin
    .auth()
    .getUser(uid)
    .then(userRecord => userRecord.customClaims);
}

function verifyCustomClaims(idToken, predicate) {
  // Verify the ID token first.
  return admin
    .auth()
    .verifyIdToken(idToken)
    .then(claims => predicate(claims));
}

async function listAllUsers(nextPageToken, n=1000) {
  // List batch of users, 1000 at a time.
  var listUsersResult = await admin.auth().listUsers(n, nextPageToken);
  var list = listUsersResult.users.map(function({uid, email, emailVerified, customClaims}) {
    return {uid, email, emailVerified, customClaims};
  });
  return {list, pageToken: listUsersResult.pageToken};
}

function end() {
  return admin.app().delete();
}

module.exports = {
  listAllUsers,
  setCustomClaims,
  listCustomClaims,
  verifyCustomClaims,
  end
};
