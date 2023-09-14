declare namespace JSX {
  interface HtmlTag {
    _?: string;
  }
}
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  type DatabaseUserAttributes = {};
  type DatabaseSessionAttributes = {};
}
