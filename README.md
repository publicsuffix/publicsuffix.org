# publicsuffix.org
The publicsuffix.org website
---

Nothing to see here; this is the source for the [https://publicsuffix.org](https://publicsuffix.org) website, so that the volunteers can maintain it.

If you are seeing this, and you are not one of the maintainers, you've taken a left turn where you should have turned right.  

You're likely looking for the [Public Suffix List](https://github.com/publicsuffix/list).

## Maintaining the site

The site is plain static HTML. Pages are edited directly (`index.html`, `learn/`, `list/`, `submit/`).
The [deploy workflow](.github/workflows/deploy-site.yaml) publishes the repository as-is and adds
`list/public_suffix_list.dat` from [publicsuffix/list](https://github.com/publicsuffix/list); it runs no build step.

The styling uses Mozilla's [Protocol](https://protocol.mozilla.org/) design system
(`@mozilla-protocol/core`, pinned in `package.json`). The stylesheet is compiled from Sass:

- `src/scss/site.scss` selects the Protocol parts in use; `src/scss/_*.scss` holds site-specific styles.
- `npm run build` writes `styles.css` and copies the Protocol fonts it needs into `assets/protocol/`.
  Both are committed, so commit them whenever `src/scss/` or the Protocol version changes.

```
npm ci
npm run build
npm test
```

The footer copyright end year is filled in by `assets/js/current-year.js`; the year written in
the HTML is only a fallback for clients without JavaScript.

`npm test` validates the HTML and checks the stylesheet's assets, navigation and list link.
The [test workflow](.github/workflows/test-site.yaml) also fails if the committed `styles.css` is stale.
