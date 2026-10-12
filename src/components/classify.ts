// Plain-English explanations for items that have no visual output of their own.
export const logicOnly: Record<string, string> = {
  'elements/CloseModalOnRouteChange': 'Closes any open pop-up window when you navigate to another page. It works in the background and draws nothing.',
  'elements/HydrateAuthProvider': 'Passes the logged-in user’s details into the admin when a page loads. Background data only.',
  'elements/HydratePreferences': 'Loads the user’s saved admin preferences (column order, collapsed panels…) into memory. Background data only.',
  'elements/RenderComponent': 'A helper that decides which component to draw from the Payload config. It has no look of its own.',
  'elements/RenderCustomComponent': 'A helper that draws your custom component if you configured one, or Payload’s default otherwise. No look of its own.',
  'elements/RenderIfInViewport': 'Waits until something scrolls into view before drawing it (a speed optimisation). No look of its own.',
  'elements/RenderServerComponent': 'A helper that renders server-side components from the Payload config. No look of its own.',
  'elements/Translation': 'Inserts translated words into a sentence (for multi-language admin). It outputs plain text only.',
  'elements/WindowInfo': 'Tracks the browser window size so other components can adapt to mobile/desktop. Background logic only.',
  'elements/WithServerSideProps': 'Adds server data to a component before it renders. Background logic only.',
  'elements/withMergedProps': 'A code helper that combines settings for a component. Background logic only.',
  'fields/Hidden': 'A hidden form field: it stores a value but is intentionally invisible.',
  'fields/Null': 'A placeholder that renders nothing — used when a field type should not appear.',
  'fields/UI': 'Lets developers place their own custom component into a form. It has no default look.',
  'fields/shared': 'Shared helper code used by many fields (e.g. right-to-left text detection, row focus). No visual.',
}
