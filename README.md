[![bugsplat-github-banner-basic-outline](https://user-images.githubusercontent.com/20464226/149019306-3186103c-5315-4dad-a499-4fd1df408475.png)](https://bugsplat.com)
<br/>
# <div align="center">BugSplat</div> 
### **<div align="center">Crash and error reporting built for busy developers.</div>**
<div align="center">
    <a href="https://twitter.com/BugSplatCo">
        <img alt="Follow @bugsplatco on Twitter" src="https://img.shields.io/twitter/follow/bugsplatco?label=Follow%20BugSplat&style=social">
    </a>
    <a href="https://discord.gg/bugsplat">
        <img alt="Join BugSplat on Discord" src="https://img.shields.io/discord/664965194799251487?label=Join%20Discord&logo=Discord&style=social">
    </a>
</div>

<br/>

> ℹ️ This implementation is for Node.js prior to 19.8. For 19.8 or newer, please use [fs.openAsBlob](https://nodejs.org/api/fs.html#fsopenasblobpath-options).

# node-streamable-file

This repo contains a convenience function for creating a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object that can be appended by [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and uploaded via [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) using a [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Node.js has a maximum https://nodejs.org/api/buffer.html size of 2 GB. Uploading files that are larger than the [maximum Buffer size](https://nodejs.org/api/buffer.html#bufferconstantsmax_length) will result in an [ERR_FS_FILE_TOO_LARGE](https://nodejs.org/api/errors.html#err_fs_file_too_large) error. The implementation in this repo was inspired by this [StackOverflow](https://stackoverflow.com/a/76026397/2993077) post.

## ⚙️ Installation

Install this package

```bash
npm i node-streamable-file
```

If you're using Node.js prior to 18.13, you'll also need to install a polyfill for [File](https://nodejs.org/dist/latest-v20.x/docs/api/buffer.html#new-bufferfilesources-filename-options).

```bash
npm i @web-std/file
```

## 🧑‍💻 Usage

Import `createStreamableFile` from `node-streamable-file` and `open` from `node:fs/promises`.

```ts
import { createStreamableFile } from 'node-streamable-file';
import { open } from 'node:fs/promises';
```

Call `open` with the path to your file to create a `FileHandle` and pass it to `createStreamableFile`. The result of `createStreamableFile` can be appended to a `FormData` object and uploaded via `Fetch`. Be sure to call `handle.close` when you're done with the file.

```ts
const path = 'path/to/file.txt';
const name = basename(path);
const handle = await open(path);
const file = await createStreamableFile(name, handle);

const formData = new FormData();
formData.append('file', file, name);

await fetch(url, {
  method: 'POST',
  body: formData
});

handle.close();
```

## 💥 Known Issues

You might run into the following 

```
Argument of type 'File' is not assignable to parameter of type 'Blob'
```

This issue is a result of a bug in TypeScript. You can read more about it [here](https://github.com/microsoft/TypeScript/issues/52166) and [here](https://github.com/remix-run/remix/issues/4371). You can silence this error by casting to `unknown` and then to `Blob`.

```ts
formData.append('file', file as unknown as Blob);
```

Alternatively, the warning can be fixed by setting `"skipLibCheck": true,` in your `tsconfig.json` file.

## 🐛 About

[BugSplat](https://bugsplat.com) is a software crash and error reporting service with support for [Node.js](https://docs.bugsplat.com/introduction/getting-started/integrations/cross-platform/node.js), [Electron](https://docs.bugsplat.com/introduction/getting-started/integrations/cross-platform/electron), [Web](https://docs.bugsplat.com/introduction/getting-started/integrations/web/javascript) applications, and many more. BugSplat automatically captures critical diagnostic data such as stack traces, log files, and other runtime information. BugSplat also provides automated incident notifications, a convenient dashboard for monitoring trends and prioritizing engineering efforts, and integrations with popular development tools to maximize productivity and ship more profitable software.
