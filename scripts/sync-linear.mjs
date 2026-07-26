import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/LINEAR_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

export const TEAM_PW_ID = '1609f9eb-8e93-43b9-b034-4bdc918e591e';
export const PROJECT_PW_ID = '249d6358-419a-445a-b71f-180b213d56ca';
export const STATE_DONE = '794ea5ff-2a4e-469b-9b37-3fe1a3037a31';
export const STATE_TODO = '53892a6c-e6ee-4126-80b4-aade959635d2';
export const STATE_IN_PROGRESS = '5db9cf95-a73f-44bd-9490-08ce1f6de9ad';

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

  const variables = {
    input: {
      teamId: TEAM_PW_ID,
      projectId: PROJECT_PW_ID,
      title,
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

if (process.argv[1] && process.argv[1].endsWith('sync-linear.mjs')) {
  console.log('🚀 Linear PW Team Sync Utility Ready.');
}
