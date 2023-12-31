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
export const Profile = ({
  user,
  tweetList,
  owner,
}: {
  user: User;
  tweetList: any;
  owner: boolean;
}) => {
  return (
    <div class="flex-[2] px-6 py-6">
      <div class="bg-secondary mt-8 flex min-h-[250px] w-full flex-col gap-5 rounded-xl p-8">
        <div class="flex justify-between">
          <img
            src={
              user.avatar ||
              `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`
            }
            alt="profile"
            class="h-24 w-24 self-start rounded-full object-cover"
          />
          {owner && (
            <a
              href={`/user/edit/${user?.id}`}
              class="text-text hover:bg-primaryWhite hover:text-primaryWhiteText h-10 self-center rounded-full border border-white px-6  py-2"
            >
              Edit Profile
            </a>
          )}
        </div>
        <div class="ml-4 self-start">
          <div class="flex gap-3">
            <h1 class="text-text text-3xl font-bold">{user.name}</h1>
            {user.verified && (
              <div class="self-center">
                <div x-data={`{ tooltip: '${user.verificationMessage}' }`}>
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
          </div>
          <h2 class="text-text mt-2 text-base font-thin">@{user.username}</h2>
          <div class="flex-1">
            <p class="text-text text-base font-thin">{user.bio}</p>
          </div>
          <div className="text-text flex flex-1 flex-wrap gap-x-8">
            {user.location && (
              <p class="flex items-center gap-2 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span safe>{user.location}</span>
              </p>
            )}
            {user.website && (
              <a
                class="flex items-center gap-2 py-2"
                href={user.website}
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 w-5"
                >
                  <path d="M16.555 5.412a8.028 8.028 0 00-3.503-2.81 14.899 14.899 0 011.663 4.472 8.547 8.547 0 001.84-1.662zM13.326 7.825a13.43 13.43 0 00-2.413-5.773 8.087 8.087 0 00-1.826 0 13.43 13.43 0 00-2.413 5.773A8.473 8.473 0 0010 8.5c1.18 0 2.304-.24 3.326-.675zM6.514 9.376A9.98 9.98 0 0010 10c1.226 0 2.4-.22 3.486-.624a13.54 13.54 0 01-.351 3.759A13.54 13.54 0 0110 13.5c-1.079 0-2.128-.127-3.134-.366a13.538 13.538 0 01-.352-3.758zM5.285 7.074a14.9 14.9 0 011.663-4.471 8.028 8.028 0 00-3.503 2.81c.529.638 1.149 1.199 1.84 1.66zM17.334 6.798a7.973 7.973 0 01.614 4.115 13.47 13.47 0 01-3.178 1.72 15.093 15.093 0 00.174-3.939 10.043 10.043 0 002.39-1.896zM2.666 6.798a10.042 10.042 0 002.39 1.896 15.196 15.196 0 00.174 3.94 13.472 13.472 0 01-3.178-1.72 7.973 7.973 0 01.615-4.115zM10 15c.898 0 1.778-.079 2.633-.23a13.473 13.473 0 01-1.72 3.178 8.099 8.099 0 01-1.826 0 13.47 13.47 0 01-1.72-3.178c.855.151 1.735.23 2.633.23zM14.357 14.357a14.912 14.912 0 01-1.305 3.04 8.027 8.027 0 004.345-4.345c-.953.542-1.971.981-3.04 1.305zM6.948 17.397a8.027 8.027 0 01-4.345-4.345c.953.542 1.971.981 3.04 1.305a14.912 14.912 0 001.305 3.04z" />
                </svg>
                <span safe class="text-link">
                  {user.website}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
      <div class="mt-8">
        <div class="flex gap-3">
          <h1 class="text-text text-3xl font-bold">Tweets</h1>
        </div>
        <div class="mt-4 flex flex-col gap-4">{tweetList}</div>
      </div>
    </div>
  );
};
