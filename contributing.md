# Contributing to Awaiting

First, thanks for taking the time to contribute!

Following this guide will help your bug report, suggestion, or pull request get fixed, implemented, or merged quickly and smoothly.

## Bug reports

Bug reports are filed on [GitHub issues](https://github.com/hunterloftis/awaiting/issues).

The best bug reports are Pull Requests with new test cases demonstrating the bug. If that's not an option, please provide:

1. The Awaiting, node, npm, yarn, and operating system versions you're using.
2. Short, simple reproduction code.
3. What you expect to happen.
4. What actually happens.

## Suggestions

To suggest an enhancement, please open a
[GitHub issue](https://github.com/hunterloftis/awaiting/issues)
titled "Enhancement: your proposal title."

The best suggestions include code examples of how your feature's
API might look to a user (how will people use this enhancement?).

Implementation recommendations are fine,
but usually less useful at this early stage -
it's more important to make sure the feature will
provide a pleasant development experience, and then
to sort out the implementation in a Pull Request.

Other good information to include in a suggestion is how much of the implementation you're capable of / interested in implementing.

## Pull Requests

In order to make the best use of your time,
please start new feature requests as [suggestions](#suggestions) rather than PRs.
That will allow us to discuss the feature and its API - and to settle on a nice design that aligns with project goals and scope - before anyone writes any code.

Once we've decided that a feature would be useful,
settled on an API,
and discussed implementation details,
your Pull Request will be easy to review and merge.

Staying in the project's requirements is mostly automated. To start working on Awaiting:

```
$ git clone https://github.com/hunterloftis/awaiting.git
$ cd awaiting
$ yarn install
```

During development, the test script will ensure you're on spec:

```
$ yarn test # lints, runs tests, checks coverage %
```

Once you've implemented your fix or feature,
ensure tests are working in the browser and you're at 100% test coverage:

```
$ yarn test:browser
$ yarn coverage:report
```

Finally, document your code with JSDoc and submit a PR!
