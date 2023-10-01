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
export const EditForm = (props: User) => {
  //use tailwind forms
  return (
    <div class=" my-auto h-min flex-[2] p-5">
      <h1 class="text-text py-8 text-3xl">Edit profile</h1>
      <form
        class="bg-secondary grid grid-cols-3 items-start justify-center gap-5 rounded-lg p-8"
        hx-post={`/api/user/edit/${props.id}`}
        hx-target="this"
        hx-swap="outerHTML"
      >
        <label class="text-text self-center text-lg" for="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          class="col-span-2 rounded-md p-3 "
          placeholder="Name"
          name="name"
          value={props.name}
        />
        <label class="text-text self-center text-lg" for="bio">
          Bio
        </label>

        <textarea
          class="col-span-2 max-h-64  rounded-md p-3"
          placeholder="A cool bio"
          id="bio"
          name="bio"
        >
          {props.bio || ""}
        </textarea>
        <label class="text-text self-center text-lg" for="location">
          Location
        </label>

        <input
          type="text"
          class="col-span-2 rounded-md p-3 "
          placeholder="Location"
          value={props.location || ""}
          id="location"
          name="location"
        />
        <label class="text-text self-center text-lg" for="website">
          Website
        </label>

        <input
          type="text"
          class="col-span-2 rounded-md p-3 "
          placeholder="Website"
          value={props.website || ""}
          id="website"
          name="website"
        />
        {/* <input type="text" class="" placeholder="Avatar"  /> */}
        <button
          type="submit"
          class="col-span-3 mt-8 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
