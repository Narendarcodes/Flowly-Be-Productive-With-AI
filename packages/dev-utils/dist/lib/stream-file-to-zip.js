import { AsyncZipDeflate } from 'fflate';
import { createReadStream } from 'node:fs';
export const streamFileToZip = (absPath, relPath, zip, onAbort, onError) => {
    const data = new AsyncZipDeflate(relPath, { level: 1 });
    void zip.add(data);
    createReadStream(absPath)
        .on('data', (chunk) => typeof chunk === 'string' ? data.push(Buffer.from(chunk), false) : data.push(chunk, false))
        .on('end', () => data.push(new Uint8Array(0), true))
        .on('error', error => {
        onAbort();
        onError(error);
    });
};
