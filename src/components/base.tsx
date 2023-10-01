import { liveReloadScript } from "beth-stack/dev";
import { type PropsWithChildren } from "beth-stack/jsx";
import { config } from "../config";

const safeScript =
  config.env.NODE_ENV === "development" ? liveReloadScript() : "";

interface Props extends PropsWithChildren {
  className?: string;
}
export const BaseHtml = ({ children, className }: Props) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>THE BETH STACK</title>
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <link
        href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css"
        rel="stylesheet"
      />
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
      />
      <link rel="stylesheet" href="/public/dist/unocss.css" />
      <script>{safeScript}</script>
    </head>
    <body class={`${className}`}>{children}</body>

    <script>
      {`function displayImagePreviews(fileTarget,previewTarget) {
          console.log(fileTarget,previewTarget);
  const filesInput = document.getElementById(fileTarget);
  const imagePreviews = document.getElementById(previewTarget);
  const maxAllowedFiles = 4;
  imagePreviews.innerHTML = ''; // Clear existing previews
  if (filesInput.files.length > maxAllowedFiles) {
    alert('You can only upload a maximum of 4 files.');
    const excessFilesCount = filesInput.files.length - maxAllowedFiles;
    for (let i = 0; i < excessFilesCount; i++) {
      filesInput.value = ""; // Clear the file input
    }

  }

  for (const file of filesInput.files) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.classList.add('w-12', 'h-12', 'rounded-lg', 'object-cover');
        imagePreviews.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }
}
`}
    </script>
  </html>
);
