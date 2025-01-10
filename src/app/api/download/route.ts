import { createReadStream } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const SECURITY_CODE = 'V3DS3SA!';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const code = searchParams.get('code');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!code || code !== SECURITY_CODE) {
    return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);
  const fileStream = createReadStream(filePath);
  
  const headers = new Headers();
  headers.set('Content-Disposition', `attachment; filename=${filename}`);
  headers.set('Content-Type', 'application/octet-stream');

  return new NextResponse(fileStream as any, {
    headers,
  });
}
