import { FetchClient, Config } from 'coze-coding-dev-sdk';

async function fetchPDF() {
  const config = new Config();
  const client = new FetchClient(config);

  const pdfUrl = 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2FChatbot_Design_Project.pdf&nonce=228c92cf-877e-45f5-99cf-bd7a6e8413a4&project_id=7622659851415568425&sign=91823e0114875f7d440b065714989257f971cf50488b786d12e9382ddaee7099';

  console.log('Fetching PDF content...\n');
  
  const response = await client.fetch(pdfUrl);

  console.log('Title:', response.title);
  console.log('File type:', response.filetype);
  console.log('Status:', response.status_code === 0 ? 'Success' : 'Failed');
  console.log('\n--- Content ---\n');

  for (const item of response.content) {
    if (item.type === 'text' && item.text) {
      console.log(item.text);
    }
  }
}

fetchPDF().catch(console.error);
