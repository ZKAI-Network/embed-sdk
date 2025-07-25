# CONTRIBUTING

> You are reading the overall contributing guide. For each package's contribution guide, please check the specific CONTRIBUTING.md there.

The `@embed-ai` sdk and examples repository is setup as a monorepo using bun workspaces.
Philosophically you extend the existing packages everytime you intend a change.
For currently not supported technologies or framework specific code that is not generic enough
for inclusion into the core `embed-ai/sdk` package you use the existing framework package like
`embed-ai/react` or create a new package in the `/packages/` folder.

**Careful** there are dependencies between packages where the dependency tree's root is the
`embed-ai/types` package containing all API endpoint parameter types and return types.
Since we develop with this API we share these types across all packages. To then call the API
the `embed-ai/sdk` package contains all core functions abstracting complexity out of API calls
as it does retries, typed return values and unmarshalling for us already.
Above the core SDK framework specific packages provide helpers, utilities and UI components ready
to be used.

This results in the following

## File Structure

- examples
    - sdk usage
    - mini app
    - ai agent
- packages
    - types
    - sdk
    - react

The file structure dictates where you add your code. Unless you are working in examples you work on
packages. In regards to packages unless you update API types like parameters or return types, you
are working in the core `sdk` or framework packages like `react`.

Each of these packages has it's own CONTRIBUTING.md file where you can go to read instructions on
how they are laid out and work.

In general the rule is as follows:
- core types -> packages/types
- core function -> packages/sdk
- helpers, framework specifics, ui compontens -> packages/react and others

>The OAS spec of embed APIs is present in the types package. Please read [the types CONTRIBUTING.md](./packages/types/CONTRIBUTING.md).

## Coding Style

The codebase is written in Typescript with `effect` being an integral component to the packages.
When adding functions to the SDK package and types we rely heavily on `effect` and `effect/Schema`.
The framework specific packages then import this core functionality.

Make sure you always run the format checkers and linters with ```bun run lint```.

For effect we rely on the core `effect` which brings a lot of functionality like retries, error handling,
schedules and efficient datastructure implementations.

[Effect Docs](https://effect.website/docs)
