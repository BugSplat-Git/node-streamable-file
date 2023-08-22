import { unlink, writeFile } from "fs/promises";
import { ReadableStream } from "node:stream/web";
import { createStreamableFile } from "../index";

describe('createStreamableFile', () => {
    const path = 'test.txt';
    const contents = 'Hello World! 🌎';

    beforeEach(async () => writeFile(path, contents));

    it('should read file correctly', async () => {
        const file = await createStreamableFile(path);
        const result = await streamToString(file.stream());
        expect(result).toEqual(contents);
    });

    afterEach(async () => unlink(path));
});

async function streamToString(stream: ReadableStream) {
    const chunks = [] as Buffer[];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}
