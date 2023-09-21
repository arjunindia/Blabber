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
      <div
        id="tweetDeleteToast"
        class="flex space-x-4 text-text bottom-2 left-2 rounded-xl bg-primary p-4 absolute slide-in-from-left-full translate-x-0 animate-in hidden slide-out-to-left-full"
      >
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
        <div class="flex-1">
          <div class="mt-1 text-secondary-500">
            Your tweet has been deleted.
          </div>
        </div>
      </div>
      <script>
        {`document.body.addEventListener("tweetDelete", function(evt){
          var toast = document.getElementById("tweetDeleteToast");
          toast.classList.remove("hidden");
          toast.classList.add("animate-in");
          setTimeout(function(){
            toast.classList.remove("animate-in");
            toast.classList.add("animate-out");
            setTimeout(function(){
              toast.classList.remove("animate-out");
              toast.classList.add("hidden");
            }, 140);
          }, 3000);
        })`}
      </script>
    </html>
  </>
);

export default BaseHtml;
