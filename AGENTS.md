# AGENTS.md

## Purpose
This file is for agentic coding assistants working in this repo.
It captures practical commands and repo-specific implementation conventions.

## Repo Snapshot
- Stack: React 18, Vite 6, React Router 7, Zustand, Ariakit.
- Language: JavaScript/JSX only (no TypeScript today).
- Package manager: Bun.
- Lockfile: `bun.lock`.
- Runtime in CI/dev commands: Bun (`bun`, `bun run`, `bunx`).

## Command Conventions
- Preferred form: `bun run <script>`.
- Use `bunx <bin>` for one-off binaries (eslint, vite, etc.) when needed.
- `npm run` can list scripts, but Bun is the source-of-truth workflow.

## Setup
```bash
bun install --frozen-lockfile
```
- Run this first on fresh checkouts.
- If lockfile drift occurs, run `bun install` and re-check `bun.lock`.

## Core Commands
```bash
# dev
bun run dev

# production build
bun run build

# preview built app
bun run preview

# lint whole repo
bun run lint

# lint one file
bunx eslint src/views/players.jsx

# deploy (build + rsync via deploy.sh)
bun run deploy
```

## Test Commands (Current State)
- No `test` script exists in `package.json` right now.
- No `*.test.*`/`*.spec.*` files exist in `src/` right now.
- `bun run test` currently fails because no `test` script is defined.

### Single-test guidance
- Single-test execution is currently unavailable (no test runner configured).
- If Vitest gets added, use:
```bash
bunx vitest run src/path/to/file.test.jsx
bunx vitest run src/path/to/file.test.jsx -t "case name"
```

- If Bun test runner gets adopted instead, use:
```bash
bun test src/path/to/file.test.jsx
bun test --test-name-pattern "case name" src/path/to/file.test.jsx
```

## Lint / Build Baseline
- ESLint config: `eslint.config.js`.
- Active plugins: `react`, `react-hooks`, `react-refresh`.
- Lint target: `**/*.{js,jsx}` (with `dist` ignored).
- Current baseline has existing lint errors/warnings; do not assume green lint.
- Build currently succeeds with `bun run build`.

## Project Layout
- Entry/bootstrap: `src/main.jsx`, `src/App.jsx`.
- Route views: `src/views/*.jsx`.
- Shared components: `src/components/*.jsx` and local CSS files.
- Global state store: `src/useGame.js`.
- Utilities: `src/helpers.js`.
- Static assets: `src/assets/**`, `public/**`.

## Code Style Guidelines

### Imports
- Keep imports at the top.
- Prefer one import block per file.
- Group order: external packages, internal relative modules, CSS imports last.
- Use relative paths (no path aliasing configured).
- Remove unused imports/variables before handoff.

### Formatting
- No Prettier config; ESLint is enforcement baseline.
- Existing files mix semicolon/quote styles.
- For new files, prefer single quotes and no semicolons.
- For edited files, follow nearby style and avoid drive-by reformatting.
- Keep JSX readable; extract helpers when blocks get dense.

### Types and Runtime Validation
- No TypeScript yet.
- Add `PropTypes` for components that receive props.
- Keep prop shapes explicit; avoid broad generic shapes.
- Validate/coerce user input at boundaries (forms, URL params, store actions).

### Naming
- Components: PascalCase (`GameStart`, `RoundTitle`).
- Hooks: `useX` (`useGame`, `useRoundNumber`).
- Functions/variables: camelCase.
- Booleans: use clear names (`isWinner`, `showMenu`, `hasScores`).
- True constants only: UPPER_SNAKE_CASE.
- Match neighboring file naming patterns when adding files.

### React Patterns
- Use function components + hooks only.
- Keep side effects in `useEffect`/`useLayoutEffect`.
- Keep hook dependency arrays correct; document intentional exceptions.
- Prefer guard clauses and early returns over nested conditionals.
- Keep state local unless multiple routes/components need it.

### Zustand Patterns (`src/useGame.js`)
- Keep updates immutable (`map`, `filter`, spreads).
- Keep store actions/selectors centralized unless adding a clear new domain store.
- Avoid storing derivable values when selectors/helpers can compute them.
- Preserve persistence compatibility when changing persisted keys.

### Error Handling
- Validate before mutating state.
- Use guard clauses for invalid input/state.
- For recoverable UI problems, prefer user-facing validation messages.
- Use `console.warn`/`console.error` with useful context, avoid noisy spam.
- Throw only for truly exceptional/unrecoverable flows.

### CSS / Styling
- Use plain CSS files imported by component/view.
- Reuse existing class conventions (`paper-*`, `menu-*`, etc.) where possible.
- Prefer CSS for static styling; use inline style for tiny dynamic values.
- Keep safe-area/responsive behavior intact (`--full-safe-height`, env insets).

## Working Rules for Agents
- Make minimal, targeted edits.
- Do not refactor unrelated areas for focused tasks.
- Preserve behavior unless task explicitly requests behavior changes.
- If routing/store logic changes, sanity-check related views.
- Before handoff, run relevant checks for changed scope (lint/build/tests if present).

## Cursor / Copilot Rules
Checked locations:
- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Status at time of writing: none of those files exist in this repo.
If they are added later, merge their directives here and follow stricter rules on conflicts.
