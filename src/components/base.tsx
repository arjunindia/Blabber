import { liveReloadScript } from "beth-stack/dev";
import { type PropsWithChildren } from "beth-stack/jsx";
import { config } from "../config";

const safeScript =
  config.env.NODE_ENV === "development" ? liveReloadScript() : "";

interface Props extends PropsWithChildren {
  className?: string;
  title?: string | undefined;
  description?: string | undefined;
  keywords?: string | undefined;
  image?: string | undefined;
  url?: string | undefined;
}
export const BaseHtml = ({
  children,
  className,
  title = "Blabber | The best place to share your thoughts with others!",
  description = "Blabber is a social media platform where you can share your thoughts with others!",
  keywords = "blabber, social media, twitter, facebook, instagram, social network, share, thoughts",
  image = "https://blabber.fly.dev/public/icon.jpg",
  url = "https://blabber.fly.dev",
}: Props) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>
        {title} | {description}
      </title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="twitter:title"
        content={title}
        data-tippy-content={title}
      />
      <meta
        property="twitter:description"
        content={description}
        data-tippy-content={description}
      />
      <meta property="og:image" content={`${image}`} />
      <meta property="twitter:image" content={`${image}`} />
      <meta property="og:url" content={url} />
      <meta property="twitter:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="twitter:site" content="@Blabber" />
      <meta name="twitter:creator" content="@Blabber" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="icon" href="/public/icon.ico" />
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <link href="/public/swal.css" rel="stylesheet" />
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
