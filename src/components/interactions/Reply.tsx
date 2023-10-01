import { PropsWithChildren } from "beth-stack/jsx";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user } from "../../db/schema/auth";
import { tweets } from "../../db/schema/tweets";
import { FileUpload } from "../FileUpload";
import { Tweet } from "../tweets";

interface ModalProps extends PropsWithChildren {
  title: string;
}
export const Modal = ({ title, children }: ModalProps) => {
  return (
    <>
      <div
        id="modal"
        _="on closeModal remove me"
        class="fixed inset-0 z-[1000] flex flex-col items-center bg-[rgba(0,0,0,0.5)]"
      >
        <div
          class="absolute inset-0 z-[-1]"
          _="on click trigger closeModal"
        ></div>
        <div class="bg-background mt-[10vh] w-4/5 max-w-[600px] rounded-lg border-[#999] border-[solid] bg-[white] p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.3)]">
          <h1 class="text-text text-2xl">{title}</h1>
          <br />
          {children}
          <br />
          <br />
          <button
            _="on click trigger closeModal"
            class="text-text mr-auto bg-[rgba(0,0,0,0.5)]"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
const EditTweet = ({
  currUser,
  replyId,
}: {
  currUser: any;
  replyId: string;
}) => (
  <div class="bg-secondary flex h-min w-full flex-1 gap-6 rounded-2xl p-8">
    <img
      class="hidden h-0 w-0 rounded-full sm:block sm:h-8 sm:w-8"
      width="32"
      height="32"
      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${currUser.username}`}
    />
    <div class="flex w-full flex-col gap-2">
      <textarea
        class="text-text h-32 w-full rounded-xl bg-transparent p-4"
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
      <p id="tweetlength" class="ml-auto text-sm text-green-500 " />
      <div class="mt-4 flex flex-row justify-between gap-5">
        <FileUpload fileIdString="modal-file" prevIdString="modal-preview" />
        <button
          class="text-text bg-primary h-min rounded-full px-6 py-3"
          hx-post={`/api/reply/${replyId}`}
          hx-swap="outerHTML"
          hx-target="#tweet-error"
          hx-include="#replyArea, #modal-file"
          hx-encoding="multipart/form-data"
        >
          Post
        </button>
      </div>
      <p class="text-sm text-red-500" id="tweet-error"></p>
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
  if (!tweetFetch) {
    return <p class="text-red-500">Tweet not found</p>;
  }
  return (
    <Modal title="Reply">
      <Tweet
        {...tweetFetch}
        className="bg-opacity-90"
        noInteraction={true}
        owner={false}
      />
      <br />
      <EditTweet currUser={currUser} replyId={tweetId} />
    </Modal>
  );
};
