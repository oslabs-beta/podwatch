import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const infoDirectory = path.join(process.cwd(), 'info');
  const errorInfoContents = await fs.readFile(
    path.join(infoDirectory, 'kerror-desc-info.json'),
    'utf8'
  );
  response.status(200).json(errorInfoContents);
}
