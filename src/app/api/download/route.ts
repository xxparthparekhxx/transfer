import { createReadStream } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
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
