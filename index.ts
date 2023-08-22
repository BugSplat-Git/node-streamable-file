import { File } from 'buffer';
import { open } from 'node:fs/promises';
import { basename } from 'node:path';

export async function createStreamableFile(path: string): Promise<File> {
    const name = basename(path);
    const handle = await open(path);
    const { size } = await handle.stat();

    const file = new File([], name);
    file.stream = () => handle.readableWebStream();

    // Set correct size otherwise fetch will encounter UND_ERR_REQ_CONTENT_LENGTH_MISMATCH
    Object.defineProperty(file, 'size', { get: () => size });

    return file;
}