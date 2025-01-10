import { writeFile, readdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(`${uploadDir}/${file.name}`, buffer);
  return NextResponse.json({ success: true, filename: file.name });
}

export async function GET() {
  const files = await readdir(uploadDir);
  return NextResponse.json({ files });
}
