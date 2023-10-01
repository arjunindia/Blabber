import { type PropsWithChildren } from "beth-stack/jsx";
import { db } from "../db";
import { tweets } from "../db/schema/tweets";
import { FileUpload } from "./FileUpload";

export interface TweetProps {
  id: string;
  name: string;
  username: string;
  content: string;
  createdAt: Date;
  verified: boolean;
  verificationMessage?: string | null;
  owner: boolean;
  noInteraction?: boolean;
  className?: string;
  ReplyMessage?: string | null;
  ReplyUser?: string | null;
  ReplyId?: string | null;
  images?:
    | [
        {
          url: string;
          deleteUrl: string;
          width: number;
          height: number;
        },
      ]
    | null;
}

const DropDown = ({ children }: PropsWithChildren) => (
  <>
    <div class="ml-auto flex justify-center">
      <div class="relative inline-block">
        <button
          type="button"
          class="text-text inline-flex gap-2 rounded-full p-1 text-center text-sm font-medium shadow-sm transition-all  focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
          _="on click toggle .hidden on the next .popover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>

        <div class="popover absolute left-0 z-10 mt-2 hidden w-fit rounded-lg border border-gray-100 text-left text-sm shadow-lg">
          <div class="p-1">{children}</div>
        </div>
      </div>
    </div>
  </>
);
function getTimeDifferenceDescription(timestamp: number): string {
  const now = Date.now();
  const difference = now - timestamp;

  if (difference <= 0) {
    return "now";
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate number of days in a month
  const years = Math.floor(months / 12);

  if (years >= 1) {
    return `${years}y`;
  } else if (months >= 1) {
    return `${months}mo`;
  } else if (days >= 1) {
    return `${days}d`;
  } else if (hours >= 1) {
    return `${hours}h`;
  } else if (minutes >= 1) {
    return `${minutes}min`;
  } else if (seconds < 5) {
    return `now`;
  } else {
    return `${seconds}s`;
  }
}

export const Tweet = ({
  id,
  name,
  username,
  content,
  createdAt,
  verified,
  verificationMessage,
  owner,
  noInteraction,
  className,
  ReplyMessage,
  ReplyUser,
  ReplyId,
  images,
}: TweetProps) => (
  <>
    <div
      class={`tweet bg-secondary flex h-min w-full flex-1 gap-6 rounded-2xl bg-opacity-30 p-3 sm:p-8 ${className} cursor-pointer`}
      data-id={id}
      onclick={`const t=["A","BUTTON","SVG","PATH","IMG"];t.includes(event.target.tagName.toUpperCase())||(window.location.href='/tweet/${id}')`}
    >
      <img
        class="h-8 w-8 rounded-full sm:h-16 sm:w-16"
        width="64"
        height="64"
        src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`}
      />
      <div class="flex w-full flex-col gap-2">
        {ReplyMessage && ReplyUser && (
          <div class="flex max-w-[70vw] flex-row items-baseline gap-2">
            <span class="text-text">Replying to: </span>
            <a class="text-text font-bold" href={`/user/${ReplyUser}`} safe>
              @{ReplyUser}
            </a>
            <a
              href={"/tweet/" + ReplyId}
              class="text-text max-w-[30vw] truncate break-all text-sm hover:underline"
              safe
            >
              {ReplyMessage}
            </a>
          </div>
        )}
        <div class="flex w-full flex-row flex-wrap items-baseline gap-2">
          <a class="text-text font-bold" href={`/user/${username}`} safe>
            {name}
          </a>
          {verified && (
            <div class="self-center">
              <div x-data={`{ tooltip: '${verificationMessage || ""}' }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="text-text h-6 w-6 "
                  x-tooltip="tooltip"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          <a
            class="text-text font-thin hover:underline"
            href={`/user/${username}`}
            safe
          >
            @{username}
          </a>
          <p class="text-text text-sm" safe>
            {/* hour, day, month or year only eg: 1h,2min,now,1d,1mo,12mo,1y */}
            {getTimeDifferenceDescription(createdAt.getTime())}
          </p>
          {owner && (
            <DropDown>
              <button
                class="btn rounded-md bg-red-900 px-4 py-2 text-slate-100"
                hx-delete={`/api/tweets/${id}`}
                _={`on htmx:confirm(issueRequest)
             halt the event
             call Swal.fire({
              title: 'Are you sure?',
              text: "Are you sure you want to delete this tweet? You won't be able to revert this action.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
             })
             if result.isConfirmed issueRequest()`}
              >
                Delete
              </button>
            </DropDown>
          )}
        </div>
        <p
          class="text-text mr-4 max-w-[15rem] break-words break-keep md:max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-prose"
          safe
        >
          {content}
        </p>

        {images && (
          <div class="flex flex-row flex-wrap gap-2">
            {images.map((image) => (
              <a href={image.url}>
                <img
                  src={image.url}
                  class="max-h-[20rem] max-w-[20rem] rounded-2xl object-cover object-center"
                />
              </a>
            ))}
          </div>
        )}

        {!noInteraction && (
          <div class="mt-4 flex flex-row gap-5">
            <button
              class="text-text"
              hx-trigger="load"
              hx-get={`/api/like/${id}`}
              hx-swap="outerHTML"
              hx-push-url="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                class="h-8 w-8 rounded-full p-1 hover:bg-pink-500 hover:bg-opacity-40 hover:text-pink-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
            </button>
            <button class="text-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                class="h-8 w-8 rounded-full p-1 hover:bg-green-500 hover:bg-opacity-40 hover:text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                />
              </svg>
            </button>
            <button
              class="text-text"
              hx-get={`/api/reply/${id}`}
              hx-swap="outerHTML"
              hx-target="#modal-holder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                class="h-8 w-8 rounded-full p-1 hover:bg-blue-500 hover:bg-opacity-40 hover:text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
    <div id="modal-holder"></div>
  </>
);
export const EditTweet = ({ currUser }: { currUser: any }) => (
  <div class="bg-secondary flex h-min w-full flex-1 gap-6 rounded-2xl p-8">
    <img
      class="h-8 w-8 rounded-full sm:h-16 sm:w-16"
      width="64"
      height="64"
      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${currUser.username}`}
    />
    <div class="flex w-full flex-col gap-2">
      <textarea
        class="text-text h-32 w-full resize-none rounded-xl bg-transparent p-3"
        placeholder="What's happening?"
        maxlength="300"
        required="true"
        name="content"
        {...{
          _: `
          on input set :contentvalue to 300 - me.value.length then log :contentvalue then put :contentvalue into #tweetlength
          if :contentvalue < 0 then
            add .text-red-500 to #tweetlength
            remove .text-green-500 from #tweetlength
          else
            remove .text-red-500 from #tweetlength
            add .text-green-500 to #tweetlength
          end
        `,
        }}
      />
      <p id="tweetlength" class="ml-auto text-green-500 text-red-500"></p>
      <div class="mt-4 flex flex-row items-end justify-between gap-5">
        <FileUpload fileIdString="files" prevIdString="image-preview" />
        <button
          class="text-text bg-primary rounded-full px-6 py-3"
          hx-post="/api/tweets"
          hx-swap="innerHTML"
          hx-include="textarea, input[type=file]"
          hx-encoding="multipart/form-data"
          hx-target="#tweet-error"
        >
          Post
        </button>
      </div>
      <p class="text-sm text-red-500" id="tweet-error"></p>
    </div>
  </div>
);
