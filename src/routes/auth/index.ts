export const get = async () => {
  // redirect to login if not logged in using redirect header
  let header = new Headers();
  header.append("Location", "/auth/login");
  return new Response(
    `
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=/auth/login" />
      </head>
        <body>
            <p>Redirecting to <a href="/auth/login">/auth/login</a></p>
        </body>
    </html>
  `,
    {
      status: 301,
      headers: header,
    }
  );
};
