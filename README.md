# Did the Parties Switch?

Primary sources from 1861 to 2024 proving the party realignment. Secession documents, strategy memos, and the words of the men who did it.

**Live site:** [didthepartiesswitch.com](https://didthepartiesswitch.com)

---

## What This Is

A static reference site tracing the unbroken line from Fort Sumter to the present day. Every claim links to a primary source. No paraphrasing where a direct quote exists.

The site covers:
- Why the South seceded (their own declarations)
- How Reconstruction was destroyed
- Jim Crow's legal architecture
- The Lost Cause as deliberate myth
- The Southern Strategy in the architects' own words
- Where the voters who opposed civil rights ended up

## Stack

- **[Eleventy 3](https://www.11ty.dev/)** — static site generator
- **Nunjucks** — templating
- **[Pagefind](https://pagefind.app/)** — static search (lazy-loaded)
- **Vercel** — hosting and edge CDN
- Vanilla JS, no frameworks

## Development

```bash
npm install
npm start        # dev server at localhost:8080
npm run build    # production build → /dist
```

The build runs Eleventy then Pagefind to index the output. Both steps are required for search to work.

## Structure

```
src/
  _data/          # JSON data files (sources, quiz questions, timeline, etc.)
  _includes/
    components/   # Nunjucks partials (quiz, bingo, primary sources, etc.)
    layouts/      # base.njk shell
  assets/
    css/site.css
    js/main.js
  pages/          # One .njk per content page
  index.njk       # Homepage
```

Content pages follow a reading-nav chain:
**Reconstruction → Jim Crow → Monuments → Convict Leasing → Lost Cause → Racial Terror → Tulsa → Redlining → Great Migration → Civil Rights → Southern Strategy → Voting Access**

## Content Pages

| Page | Path |
|------|------|
| Home | `/` |
| Reconstruction | `/reconstruction/` |
| Jim Crow | `/jim-crow/` |
| Monuments | `/monuments/` |
| Convict Leasing | `/convict-leasing/` |
| Lost Cause | `/lost-cause/` |
| Racial Terror | `/lynching/` |
| Tulsa 1921 | `/tulsa/` |
| Redlining | `/redlining/` |
| Great Migration | `/great-migration/` |
| Civil Rights | `/civil-rights/` |
| Southern Strategy | `/southern-strategy/` |
| Voting Access | `/voting-access/` |
| Party Realignment | `/party-realignment/` |
| Archive | `/sources/` |
| Quiz | `/quiz/` |
| Bingo | `/bingo/` |
| About | `/about/` |

## Source Standards

- Primary sources preferred over secondary
- Every source has a live link; most have a Wayback Machine archive backup
- Government documents and court records flagged with `isGovernment: true`
- Sources with sensitive content flagged with `contentWarning: true`

## License

Site content is free to use with attribution. Primary source documents are public domain. Code is MIT.
