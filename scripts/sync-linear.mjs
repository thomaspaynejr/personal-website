import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/LINEAR_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

const TEAM_ID = 'bcd1b747-fb05-4137-a966-532968cc3c7b';
const PROJECT_ID = '7d3dd8c4-0237-48de-987e-f084687e1444';
const STATE_DONE = '2c4e8584-9876-45ce-ae68-304886873c6f';
const STATE_TODO = 'e197b8a1-4382-45b1-aff1-0162563c65ff';

export async function createPWLinearIssue({ title, description, isDone = false }) {
  const query = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const formattedTitle = title.startsWith('[PW]') ? title : `[PW] ${title}`;

  const variables = {
    input: {
      teamId: TEAM_ID,
      projectId: PROJECT_ID,
      title: formattedTitle,
      description,
      stateId: isDone ? STATE_DONE : STATE_TODO
    }
  };

  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();
  return data;
}

if (process.argv[1].endsWith('sync-linear.mjs')) {
  console.log('🚀 Linear PW Sync Utility Ready.');
}
