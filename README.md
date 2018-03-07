# platform-chaos

An sdk for building services capable of injecting chaos into PaaS offerings. ⚙️ 🌩 

![hero image](.github/hero.png)

Platform chaos is a collection of tools and sdks that enable engineers to experiement on distributed systems built atop Azure PaaS offerings to ensure confidence in such a system's capabilities. It does so by defining a common interface for inducing chaos, through a construct we call chaos extensions. Given this common interface, we're able to provide tooling that can schedule, start, and stop chaotic events.

This project is the core sdk that enables chaos extension development using [NodeJS](https://nodejs.org).

## How to use

To consume this sdk, install it from [NPM](https://npmjs.com/package/platform-chaos):

```
npm install platform-chaos
```

Then consume the module in code, leveraging the following API.

## API

This is the exported API from the `platform-chaos` NPM module.

### validators

Request validation helpers. Useful to ensure data coming in is behaving as expecting.

```
const validate = require('azure-chaos-fn/validators')
```

#### accessToken

Validates that the `body` of a `req` object contains a valid `accessToken`.

```
try { require('azure-chaos-fn/validators').accessToken(req) } catch (ex) { console.error(`error: ${ex}`) }
```

#### resources

Validates that the `body` of a `req` object contains a valid `resources` array.

```
try { require('azure-chaos-fn/validators').resources(req) } catch (ex) { console.error(`error: ${ex}`) }
```

### parsers

> Note: these depend on the [validators](#validators) to ensure only valid data is parsed.

Request parser helpers. Useful to parse valid request data into models.

```
const parsers = require('azure-chaos-fn/parsers')
```

#### accessTokenToCredentials

Inflates the `accessToken` from a `req` objects `body` into a [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure) compatible   credentials object.

```
const credentials = require('azure-chaos-fn/parsers').accessTokenToCredentials(req)
```

#### resourcesToObjects

Inflates the `resources` from a `req` objects `body` into a collection of objects containing the following properties:

+ `subscriptionId` - the azure subscription id to target
+ `resourceGroupName` - the azure resource group name to target
+ `resourceName` - the azure resource name to target

```
const objs = require('azure-chaos-fn/parsers').resourcesToObjects(req)
```

## Related Projects

* [platform-chaos-api](https://github.com/Azure/platform-chaos-api) - An API for introducing chaos into Azure PaaS offerings using configurable extensions.
* [platform-chaos-cli](https://github.com/Azure/platform-chaos-cli) - A tool for introducing chaos into Azure PaaS offerings using configurable extensions.

For a list of already built chaos extensions, please see [The extensions document](EXTENSIONS.md).

## Contributing

This project welcomes contributions and suggestions! Here's what you need to know to get started.

### Feedback and Feature Requests

> When you're ready, you can open issues [here](https://github.com/Azure/platform-chaos/issues)!

To submit feedback or request features please do a quick search for similar issues,
then open a new issue. If you're requesting a new feature, please briefly explain in the issue what scenario you're planning to use the feature for.

### Development Requirements

To get started developing, you'll need to first ensure you have these tools installed:

* [Git](https://git-scm.com)
* [NodeJS](https://nodejs.org)

Once you've installed those, clone this repository and install dependencies:

```
git clone https://github.com/Azure/platform-chaos.git
cd platform-chaos
npm install
```

Now you're ready to begin contributing!

### Testing

To run the tests for this project, first ensure you've installed the [requirements](#development-requirements). Then use npm to run the tests locally:

```
npm test
```

Note that this command is meant to be run from the project directory. That is,
the folder that you cloned the project into (likey `platform-chaos`). 

### Legal

Most contributions require you to agree to a Contributor License Agreement (CLA)
declaring that you have the right to, and actually do, grant us the rights to use your contribution.
For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

### Submitting Pull Requests

> When you're ready, you can submit pull requests [here](https://github.com/Azure/platform-chaos/pulls)!

We've developed a quick checklist that your change should meet, before you submit a pull request:

* Ensure your change isn't already implemented by a pending pull request
* All tests pass locally (see [the testing section](#testing) for more info)
* New behaviors or major functional changes have tests

When you've completed the checklist, and it's time to submit a pull request, your pull request should: 

* Include a description of what your change intends to do
* Be a child commit of a reasonably recent commit in the **master** branch 
    * Requests need not be a single commit, but should be a linear sequence of commits (i.e. no merge commits in your PR)
* It is desirable, but not necessary, for the tests to pass at each commit
* Have clear commit messages 
    * e.g. "Refactor feature", "Fix issue", "Add tests for issue"
* Include adequate tests 
    * At least one test should fail in the absence of your non-test code changes. If your PR does not match this criteria, please specify why
    * Tests should include reasonable permutations of the target fix/change
    * Include baseline changes with your change
* To avoid line ending issues, set `autocrlf = input` and `whitespace = cr-at-eol` in your git configuration

Note that once you've [submitted a pull request](https://github.com/Azure/platform-chaos/pulls) you may need to sign a CLA - see [the legal section](#legal) for more information.

### Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.