# vue-testing-examples

To document:
1. Testing dumb component
1. Testing smart component
1. Testing functional component
1. Testing v-model
1. Testing navigation guards
1. Testing filter
1. Mocking vuex
1. Mocking router
1. Mocking axios
1. Assert `console.error()`
1. Assert axios expectations left overs
1. Adding page objects
1. Using custom selectors in page objects (tids)
1. Inversify and mocking router/store in tests
1. lolex example with time forwarding

Introduce the dev stack:
* vue, vuex, vue-router, vue-property-decorator, vuex-class, axios, lodash, inversify (vanilla js solution), sinon, mocha, sinon-chai, sinon-stub-promise flush-promises, lolex

Provide examples for
* ??? using stub services while running the app ???
* ??? how shallow vs mount would help in test ???
* ??? testing mutations, actions ???
* ??? testing `router.push()` to the route with async component using `import()` ???

Issues:
* !!! `trigger("click")` on `<button type="submit">` doesn't trigger submit on form. !!!