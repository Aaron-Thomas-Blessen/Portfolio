# Make this site unmistakably yours

All personal content lives in `src/content.json`. Empty values intentionally render useful instructions instead of fake content or broken links.

## First five edits

1. **Replace the portrait.** Add a professional photo to `public/images/aaron-portrait.webp`; use a dark or neutral background and at least 1200 × 1200 pixels. Change `hero.portrait.src` to `images/aaron-portrait.webp`, update its `alt` text and `caption`, and rewrite the replacement note once the asset is final. Your actual existing photo is used in the meantime.
2. **Replace the résumé.** Add `public/documents/aaron-blessen-resume.pdf`; update `hero.resume.url`. Set `hero.resume.note` to an accurate version label, such as a date you have actually reviewed it. Update `hero.resumeReplacement`. The included older résumé has unresolved dates and a conflicting Hackverse venue.
3. **Fill the six current-mission cards.** Set each `missions[].title.value` and `missions[].detail.value`. Use one actual current priority per card. The introductory update notice disappears when all titles are filled.
4. **Add real project screenshots.** Set each `projects[].image.src` and `alt`. Each placeholder explains which screen or photograph belongs there. Do not pass concept art off as a working product screenshot.
5. **Complete project ownership and status.** Fill `contribution.value`, `outcome.value`, and `status.value` wherever blank. Add 2–3 sentences explaining the problem, what you built, your own technical contribution, and the result. Keep team credits explicit.

## Resolve these source conflicts

| Record          | What needs your confirmation                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hackverse       | Your current site and request say **VIT Chennai**; the existing résumé says **SRM Chennai**. Use the certificate/result announcement to resolve this. |
| CODE@Saintgits  | Your site says **Core Committee**, while the résumé says **President**. Confirm both role history and dates.                                          |
| ISRO internship | The site says completed; the older résumé says **Oct 2024–Present**. Add the end date.                                                                |
| Education       | The résumé lists **2021–2025**. Confirm final degree status and graduation date.                                                                      |
| Skill Sync      | `SkillSync` documents the Aptos/Move DApp; `Skill-Sync` is a separate Solidity repository. Confirm whether that represents a later version.           |

## Assets to collect

| Content                    | Where to edit                              | What to add                                                                                                     |
| -------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Certificates               | `receipts[].certificate.src`               | A legible image of the real credential. Use public/redacted copies where appropriate.                           |
| Proof links                | `receipts[].link.url`                      | The official scorecard, certificate, result, paper, or announcement.                                            |
| Research paper             | Paper receipt + `archive[]` research entry | The actual paper PDF or DOI; confirm the final title and publication year.                                      |
| Project demos              | `projects[].demo.url`                      | A working deployment; leave blank if there is none. Do not reuse a GitHub repository URL as a “live demo.”      |
| Project video              | `projects[].video.url`                     | A 30–60 second demonstration showing a real workflow. Existing README video links are retained where available. |
| Project year               | `projects[].year`                          | The actual project date, not the repository creation timestamp.                                                 |
| Testimonials               | `testimonial.value`                        | An approved quote with the person's name, role, and collaboration context.                                      |
| Articles, talks, and decks | `archive[]`                                | Actual material, plus a concise description replacing the instructional copy.                                   |
| Press kit                  | Press-kit archive entry                    | A PDF or ZIP with a portrait, short bio, approved images, and contact information.                              |
| Contact email              | `person.email`                             | Currently `aaronthomas232200@gmail.com`, verified in your site and résumé.                                      |
| Future social channel      | `person.futureSocial`                      | Platform name and your exact active profile URL.                                                                |
| Timeline                   | `timeline[]`                               | Confirmed dates, role titles, current work, and clearly labeled intentions.                                     |

Run `npm run audit:content` for the remaining empty slots and a local-file check. After making edits, run `npm run build` before pushing.

The design includes visible replacement notes by request. When an asset is final, update its note or remove that specific note in the content file. Do not replace missing information with unsupported claims.
