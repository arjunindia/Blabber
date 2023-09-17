import { Context } from "elysia";
import BaseHtml from "../../../BaseHTML";
import { SideColumn, Sidebar } from "../../../components/Sidebar";
import { auth } from "../../auth/lucia";
import { db } from "../../../db";
import { user } from "../../../db/schema/userSchema";
import { desc, eq } from "drizzle-orm";
import { Tweet, TweetProps } from "../../../components/Tweet";
import { tweets } from "../../../db/schema/tweetSchema";

type User = {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar: string | null;
  verified: boolean;
  verificationMessage: string | null;
};
export const get = async (context: Context) => {
  // user page
  const { request, params } = context;
  let authenticated: boolean = false;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (session) {
    authenticated = true;
  }
  const { id } = params as { id: string };
  try {
    const siteUser = (
      await db
        .select({
          username: user.username,
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          website: user.website,
          verified: user.verified,
          verificationMessage: user.verificationMessage,
        })
        .from(user)
        .where(eq(user.id, id))
    )[0];

    return (
      <BaseHtml>
        <body class="flex w-screen overflow-x-hidden min-h-screen justify-center bg-background">
          <Sidebar authenticated={authenticated} />
          <EditForm {...siteUser} />
          <SideColumn />
        </body>
      </BaseHtml>
    );
  } catch (e) {
    console.log(e);
    return new Response("User not found", {
      status: 404,
    });
  }
};

const EditForm = (props: User) => {
  //use tailwind forms
  return (
    <div class=" h-min my-auto p-5 flex-[2]">
      <h1 class="text-3xl text-text py-8">Edit profile</h1>
      <form
        class="grid grid-cols-3 place-content-center items-start justify-center gap-5 bg-secondary p-8 rounded-lg"
        hx-post={`/user/edit/${props.id}`}
        hx-target="this"
        hx-swap="outerHTML"
      >
        <label class="text-text text-lg self-center" for="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          class="col-span-2"
          placeholder="Name"
          name="name"
          value={props.name}
        />
        <label class="text-text text-lg self-center" for="bio">
          Bio
        </label>

        <textarea
          type="text"
          class="col-span-2 max-h-64"
          placeholder="A cool bio"
          id="bio"
          name="bio"
        >
          {props.bio || ""}
        </textarea>
        <label class="text-text text-lg self-center" for="location">
          Location
        </label>

        <input
          type="text"
          class="col-span-2"
          placeholder="Location"
          value={props.location || ""}
          id="location"
          name="location"
        />
        <label class="text-text text-lg self-center" for="website">
          Website
        </label>

        <input
          type="text"
          class="col-span-2"
          placeholder="Website"
          value={props.website || ""}
          id="website"
          name="website"
        />
        {/* <input type="text" class="" placeholder="Avatar"  /> */}
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-3 mt-8"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export const post = async (context: Context) => {
  const { request, params, body } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return "Unauthorized, please login again.";
  }
  const { id } = params as { id: string };
  if (session.user.id !== id) {
    return "Unauthorized, please login again.";
  }
  const { name, bio, location, website } = body as {
    name: string;
    bio: string;
    location: string;
    website: string;
  };
  try {
    await db
      .update(user)
      .set({
        name: name,
        bio: bio,
        location: location,
        website: website,
      })
      .where(eq(user.id, id));
    return new Response("redirect", {
      headers: {
        "HX-Redirect": `/user/${session.user.username}`,
      },
    });
  } catch (e) {
    console.log(e);
    return "Something went wrong, please try again later.";
  }
};
