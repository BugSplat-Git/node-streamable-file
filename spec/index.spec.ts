import { FileHandle, unlink, writeFile, open } from 'node:fs/promises';
import { ReadableStream } from 'node:stream/web';
import { createStreamableFile } from '../index';
import { basename } from 'node:path';

describe('createStreamableFile', () => {
    const path = 'test.txt';
    const contents = 'Hello World! 🌎';
    let handle: FileHandle;

    beforeEach(async () => {
        await writeFile(path, contents);
        handle = await open(path);
    });

    it('should read file correctly', async () => {
        const name = basename(path);
        const file = await createStreamableFile(name, handle);
        const stream = file.stream() as ReadableStream;
        const result = await streamToString(stream);
        expect(result).toEqual(contents);
    });

    afterEach(async () => {
        await handle.close();
        await unlink(path);
    });
});

async function streamToString(stream: ReadableStream) {
    const chunks = [] as Buffer[];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString('utf-8');
}
