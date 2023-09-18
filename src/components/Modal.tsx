import { PropsWithChildren } from "@elysiajs/html";
import { Tweet } from "./Tweet";
import { db } from "../db";
import { tweets } from "../db/schema/tweetSchema";
import { user } from "../db/schema/userSchema";
import { eq } from "drizzle-orm";

interface ModalProps extends PropsWithChildren {
  title: string;
}
export const Modal = ({ title, children }: ModalProps) => {
  return (
    <div id="modal-holder">
      <div
        x-data="{ showModal: true }"
        {...{ "x-on:keydown.window.escape": "showModal = false" }}
      >
        <div
          x-cloak
          x-show="showModal"
          {...{ "x-transition.opacity": true }}
          class="fixed inset-0 z-10 bg-secondary-700/50"
        ></div>
        <div
          x-cloak
          x-show="showModal"
          x-transition
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
        >
          <div class="mx-auto overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-xl">
            <div class="relative p-6">
              <button
                type="button"
                x-on:click="showModal = false"
                class="absolute top-4 right-4 rounded-lg p-1 text-center font-medium text-secondary-500 transition-all hover:bg-secondary-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-6 w-6"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
              <h3 class="text-lg font-medium text-secondary-900">{title}</h3>
              <div class="mt-2 text-sm text-secondary-500 flex flex-col gap-5">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const EditTweet = ({
  currUser,
  replyId,
}: {
  currUser: any;
  replyId: string;
}) => (
  <div class="flex flex-1 gap-6 w-full h-min p-8 rounded-2xl bg-secondary">
    <img
      class="rounded-full hidden sm:block w-0 h-0 sm:w-8 sm:h-8"
      width="32"
      height="32"
      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${currUser.username}`}
    />
    <div class="flex flex-col gap-2 w-full">
      <textarea
        type="text"
        class="w-full bg-transparent text-text h-32 rounded-xl"
        placeholder="What's happening?"
        maxlength="300"
        required="true"
        name="content"
        id="replyArea"
        _={`
              on input set :contentvalue to 300 - me.value.length then log :contentvalue then put :contentvalue into #tweetlength
              if :contentvalue < 0 then
                add .text-red-500 to #tweetlength
                remove .text-green-500 from #tweetlength
              else
                remove .text-red-500 from #tweetlength
                add .text-green-500 to #tweetlength
              end
            `}
      />
      <p id="tweetlength" class="ml-auto"></p>
      <div class="flex flex-row gap-5 mt-4 justify-between">
        <button class="text-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </button>
        <button
          class="text-text px-6 py-3 bg-primary rounded-full"
          hx-post={`/tweets/reply/${replyId}`}
          hx-swap="outerHTML"
          hx-include="#replyArea"
          hx-target="#tweet-error"
        >
          Post
        </button>
      </div>
      <p class="text-red-500 text-sm" id="tweet-error"></p>
    </div>
  </div>
);
type ReplyModalProps = {
  tweetId: string;
  currUser: any;
};
export const ReplyModal = async ({ tweetId, currUser }: ReplyModalProps) => {
  const tweetFetch = (
    await db
      .select({
        id: tweets.id,
        content: tweets.content,
        createdAt: tweets.createdAt,
        name: user.name,
        username: user.username,
        verified: user.verified,
        verificationMessage: user.verificationMessage,
      })
      .from(tweets)
      .where(eq(tweets.id, tweetId))
      .innerJoin(user, eq(tweets.authorId, user.id))
      .limit(1)
  )[0];
  return (
    <Modal title="Reply">
      <Tweet
        className="bg-opacity-90"
        noInteraction={true}
        {...tweetFetch}
        owner={false}
      />
      <EditTweet currUser={currUser} replyId={tweetId} />
    </Modal>
  );
};
