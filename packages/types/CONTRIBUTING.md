# CONTRIBUTING

Welcome to the `embed-ai/types` package.

>The OAS spec of embed APIs is present in this types package. When updating API versions, please update the OAS file [here](./src/types/api-spec/embed-farcaster-api-oas.json).
>Autogenerating the types based on the API is possible with `bun run oas-types` which uses the OAS spec to create Effect Schema definitions.
>**NOTICE** you will need to adjust the output files as some types in the OAS are less strict then existing SDK types. Make sure there are
>no type strictness regressions.

## Updating types

Do you have an updated OAS file?

### Yes, update OAS file and types

With a new OAS file you want to replace the existing file in ```./src/types/api-spec/embed-farcaster-api-oas.json``` to update it. 

From there run ```bun run oas-types``` to have the `src/types/` directory populated with newly generated Schemas.

We then add the type interference and ensure we add back custom adjustments like limiting the input parameters array length and
making sure strings that can only allow specific values are back to being literals. These overwrites can't be inferred from the
OAS spec if they are not present. Here is where adding tests for these adjustments we are adding and unifications to share types
that are the same across the OAS spec are important. These you'll add manually.

Please add tests for the endpoints you added or adjusted and run the existing ones to ensure you have not broke any types.

### No, update types without a new OAS file

Without a new OAS file you'll be working in the `src/types` package and update types manually.
Adjust the Effect Schema and see how the inferred types change automatically.

**Type adjustments are done by updating the respective Effect Schema**.

Please add tests for the endpoints you added or adjusted and run the existing ones to ensure you have not broke any types.

## Updating return types

Since the OAS spec does not include return types, we develop the return types manually. You want to query the respective API endpoints multiple times with
differnt input values (e.g. get only one back, get multiple responses back) and input that to an LLM which can generate types for you. Especially if you
hand it context for the current codebase and types here. Make sure you manually verify that we reuse existing building blocks like Literal types and FeedItems
that maybe the same across API responses.

For JSON responses a great tool to get an initial Effect Schema is [this online converter](https://quicktype.io/typescript-effect-schema).

Now add tests for the endpoints you added and run the existing ones to ensure you have not broke any types.

## General remarks

Look at how types are done across the codebase and you will see that Effect Schema is used as source of truth as it's also used in the SDK for runtime response
validation. Yes the SDK can verify the shape of the returns and ensure it matches. This provides the users with confidence that they know if anything breaks and
silent failures are minimized.

Please ensure you keep the [AI Agent Guidance for using this repo](./CLAUDE.md) up to date when making changes. It also holds notes you can read for your own usage.
