import { PropsWithChildren } from "@elysiajs/html";

const BaseHtml = ({ children }: PropsWithChildren) => (
  <>
    {`<!DOCTYPE html>`}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          Blabber | The best place to share your thoughts with others!
        </title>
        <link rel="icon" href="/public/icon.ico" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://unpkg.com/@ryangjchandler/alpine-tooltip@1.2.0/dist/cdn.min.js"></script>
        <script
          defer="true"
          src="https://unpkg.com/alpinejs@3.10.5/dist/cdn.min.js"
        ></script>
        <link
          rel="stylesheet"
          href="https://unpkg.com/tippy.js@6.3.7/dist/tippy.css"
        />
        <link href="/styles.css" rel="stylesheet" />
      </head>

      {children}
    </html>
  </>
);

export default BaseHtml;
