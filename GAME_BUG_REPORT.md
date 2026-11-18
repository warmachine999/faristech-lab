# FarisTech Lab — Studio Games Bug Report

**Date:** 2026-11-18  
**Scope:** `studio/games.html`, `studio/app.js`, `studio/styles.css`, homepage game navigation, and game regression tests.  
**Affected games:** Component Memory, Ohm's Law Challenge, Reaction Test.  
**Release policy:** FarisTech Lab only. FarisTech X production is not modified.

## Executive summary

This audit found real state/timer defects in the three Studio games, along with accessibility, presentation, and navigation weaknesses. The game fixes are committed to the Lab upgrade branch and checked by `node scripts/check-studio-games.cjs`. Browser/device rendering and GitHub Pages deployment require separate verification; source and simulated tests do not prove that every browser works.

## Findings addressed

| ID | Severity | Game/area | Bug or issue found | Fix |
| --- | --- | --- | --- | --- |
| G-01 | Medium | Memory | Random shuffle used `sort(() => Math.random() - .5)`, which does not provide a reliable uniform shuffle. | Fisher–Yates shuffle. |
| G-02 | High | Memory | A mismatch `setTimeout` kept running after Restart and could change old cards or interfere with timing. | Cancel timeout and invalidate the old board round. |
| G-03 | Medium | Memory | Restart did not reset the previous completion/error status text. | Clear game state, move count and messages on Restart. |
| G-04 | Low | Memory | No attempt/move feedback; hidden/matched card buttons lacked descriptive accessible labels. | Add move counter, localized per-tile labels, and disable completed pairs. |
| G-05 | High | Ohm's Law | Clicking the correct choice repeatedly could queue more than one future question. | Lock all answers on the first correct click and schedule only one timer. |
| G-06 | High | Ohm's Law | Clicking New Question while an auto-next timer was pending could allow the old timer to replace the new question. | Clear scheduled callbacks and use a per-question generation token. |
| G-07 | Medium | Ohm's Law | Old correct/wrong feedback could remain visible after starting a new round. | Reset feedback for each question and mark chosen answers. |
| G-08 | Medium | Ohm's Law | Answers were rounded to two decimals but instructions did not explain the rounding requirement. | Explicitly request two decimal places and format answer choices consistently. |
| G-09 | Low | Ohm's Law | Question progress was not displayed, and choices were shuffled with a biased comparator. | Add a solved/question counter, Fisher–Yates shuffle and unique option generation. |
| G-10 | High | Reaction Test | Hidden/background browser tabs could disrupt reaction timing or start the signal while the player was away. | Cancel in-progress tests on `visibilitychange` and clear pending timers. |
| G-11 | Medium | Reaction Test | UI state could be overwritten by a language toggle during the waiting/green phase. | Restore labels/status using the actual reaction state after localization. |
| G-12 | Medium | All games | The language switch rewrote dynamic status elements with default translations, losing in-progress messages. | Register game-state-aware EN/AR refresh callbacks. |
| G-13 | Low | Reaction Test | No stored best result to help players compare attempts. | Show and save a personal best reaction time in this browser. |
| G-14 | Medium | Navigation | The homepage Play & Learn section had no direct entry to the Studio games page. | Add a bilingual Learning Games link from the homepage. |
| G-15 | Low | Accessibility | Live feedback and keyboard focus states were not consistently announced/shown. | Add live status announcements, focus indicators, descriptive labels and mobile-friendly controls. |
| G-16 | Low | Studio integration | `renderPage()` was called twice during initial startup. | Remove the redundant render and keep one initialization pass. |

### Additional bug caught during the fix

- **G-17 (Low, fixed before merge):** The new wrong-answer highlight initially referenced a missing CSS token (`--bad`). It now uses an explicit error color, so the feedback remains visible under every theme.

## Tests

The new `scripts/check-studio-games.cjs` uses built-in Node.js APIs only and simulates real button interactions without adding npm dependencies.

- Parses the Studio application script and verifies that the game page exposes required status and score elements.
- Checks the memory shuffle's input preservation and permutation; restarts a game while the mismatch timer is pending; completes all eight pairs; and checks a fresh board after Restart.
- Checks Ohm's Law for **99 voltage/resistance combinations**, verifying the mathematical answer, exactly four distinct positive choices, correct-answer locking and absence of stale auto-next callbacks.
- Switches between English and Arabic without losing the current game state.
- Tests early taps, correct signal timing, reaction results, saved personal bests, hidden-tab cancellation and language switching during the Reaction Test.
- GitHub Actions now runs both `check-site.cjs` and `check-studio-games.cjs` on pull requests and merges to `main`.

**Validation boundary:** The above checks are simulated runtime/static checks. Real touch devices, screen reader behavior and GitHub Pages publication have not been independently verified by this report.

## Remaining limitations and findings outside the game fixes

| ID | Status | Finding |
| --- | --- | --- |
| R-01 | Manual QA needed | Verify touch interactions on a real phone and test all four seasons/themes where applicable; the simulation does not replace mobile browser QA. |
| R-02 | By design | Memory and Ohm's Law scores are per page session. Reaction personal best is saved in local storage on the current device only; there is no account-based leaderboard. |
| R-03 | By design | Reaction times are estimates of input latency in a web browser, not calibrated hardware measurements. |
| S-01 | Resolved on Lab homepage | Removed the obsolete client-only password and localStorage chat preview; actual chat link continues to the separate API-based chat site. |
| S-02 | Backend not verified | The active chat page uses a separate server API. Its authorization implementation is not included in the Lab static source and still requires an independent backend review. |

## URLs

- [Play the games in Lab](https://warmachine999.github.io/faristech-lab/studio/games.html)
- [FarisTech Lab homepage](https://warmachine999.github.io/faristech-lab/)
- [Game source](https://github.com/warmachine999/faristech-lab/blob/main/studio/app.js)

**Caution:** This is a scoped game audit and a limited source scan of surrounding pages, not a claim that every bug across all repositories and live pages has been found.

## Follow-up: "No game yet" — homepage availability and deployment verification

The initial Studio game fixes were shipped in PR #11, but the user still could not find a game from the main website, and the real Node 22 validation workflow failed. A subsequent source and GitHub Actions audit identified and addressed these additional issues:

| ID | Severity | Status | Finding / remediation |
| --- | --- | --- | --- |
| G-18 | High | Fixed in Lab | Games were buried under Play & Learn and absent from top navigation. Added a prominent Games nav link, hero CTA, and a full **playable four-pair memory game on the homepage**, with links to all three Studio games. |
| G-19 | Medium | Fixed in Lab | Game URLs had no convenient short route and could not deep-link directly to a game. Added `games.html` shortcut and `#memory`, `#ohm`, `#reaction` anchors in Studio. |
| G-20 | High | Fixed in Lab | GitHub's actual Node 22 validation failed because the test used nonexistent `assert.notMatch`. Replaced it with supported `assert.doesNotMatch`; tests now run in the real GitHub Actions runner rather than relying only on a simulated in-chat Node environment. |
| G-21 | Medium | Fixed in Lab | Two independent GitHub Pages workflows were competing, leading to canceled Jekyll runs. Removed the duplicate Jekyll workflow and retained the successfully used static deployment workflow. |
| G-22 | Medium | Added verification | Earlier releases were merged without browser confirmation. Validation workflow now includes a headless Chromium render of the Studio page and homepage; the deployment workflow checks the published HTTP pages. Results are verified from GitHub Actions after merge. |
| S-01 | High | Fixed on homepage | Removed dead client-only password and localStorage demo chat code, which had no associated HTML controls; preserved the real chat link to `chat.html`. The live chat uses a separately hosted API. |
| S-02 | Advisory | Manual backend review remains | The actual `chat-v2.html` client authenticates via the remote chat API, but server-side enforcement and token handling are outside the source available in the Lab static repository; they cannot be claimed secure without an API audit. |

**Game entry points:** [Play on the homepage](https://warmachine999.github.io/faristech-lab/#games) · [Simple game URL](https://warmachine999.github.io/faristech-lab/games.html) · [Full Studio games](https://warmachine999.github.io/faristech-lab/studio/games.html).

**Remaining:** Mobile touch/device QA and security verification of the remote chat backend. These are not established by repository-only inspection. The production FarisTech X repository was not modified.
