import { FileHandle } from 'node:fs/promises';

export async function createStreamableFile(name: string, handle: FileHandle): Promise<File> {
    const { size } = await handle.stat();

    const file = new File([], name);
    file.stream = () => handle.readableWebStream() as ReadableStream<Uint8Array>;

    // Set correct size otherwise fetch will encounter UND_ERR_REQ_CONTENT_LENGTH_MISMATCH
    Object.defineProperty(file, 'size', { get: () => size });

    return file;
}