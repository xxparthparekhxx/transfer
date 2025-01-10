import { unlink } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);
  await unlink(filePath);
  
  return NextResponse.json({ success: true });
}
