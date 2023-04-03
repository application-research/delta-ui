import * as Server from '@common/server';

export default async function apiIndex(req, res) {
  await Server.cors(req, res);

  res.json({
    'commit_hash': require('child_process')
      .execSync('git log --pretty=format:"%h" -n1')
      .toString()
      .trim()
  });
}
