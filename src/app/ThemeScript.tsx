/**
 * Inline script that sets `data-fr-theme` on <html> before first paint.
 * Prevents FOUC by detecting dark mode preference synchronously.
 *
 * Reads the DSFR localStorage key "scheme" for compatibility with tenant
 * DSFR pages (shared storage). Falls back to system `prefers-color-scheme`.
 *
 * NOTE: dangerouslySetInnerHTML is intentional — this is a static trusted
 * string, not user input. Required for blocking script before React hydration.
 */
export const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var s=localStorage.getItem("scheme");var d=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.setAttribute("data-fr-theme",d?"dark":"light")}catch(e){}})()`,
    }}
  />
);
