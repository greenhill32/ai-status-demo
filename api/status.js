export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;

  const repoOwner = "greenhill32";
  const repoName = "intent-site";
  const filePath = "status.json";

  const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "vercel-ai-status"
  };

  if (req.method === 'GET') {
    const getResponse = await fetch(getUrl, { headers });
    if (!getResponse.ok) {
      return res.status(500).json({ message: "Failed to get file", error: await getResponse.text() });
    }
    const fileData = await getResponse.json();
    const content = Buffer.from(fileData.content, 'base64').toString();
    const json = JSON.parse(content);
    return res.status(200).json(json);
  }

  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const data = JSON.parse(body);

    if (!data.status) {
      return res.status(400).json({ message: "Missing status" });
    }

    // Get SHA first
    const getResponse = await fetch(getUrl, { headers });
    const fileData = await getResponse.json();

    const newContent = Buffer.from(JSON.stringify({ status: data.status }, null, 2)).toString("base64");

    const putResponse = await fetch(getUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Update status to ${data.status}`,
        content: newContent,
        sha: fileData.sha
      })
    });

    if (!putResponse.ok) {
      return res.status(500).json({ message: "Failed to update file", error: await putResponse.text() });
    }

    return res.status(200).json({ message: `Status updated to ${data.status}` });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
