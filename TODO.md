# To document:

1. Testing navigation guards
1. Testing filter
1. Testing directive
1. Writing complex integration test for a component
1. Mocking router
1. Inject/Provide
1. Scoped slots
1. Inversify and mocking router/store in tests
1. Test coverage

Introduce the dev stack:

* vue, vuex, vue-router, vue-property-decorator, vuex-class, axios, lodash, inversify (vanilla js solution), sinon, mocha, sinon-chai, sinon-stub-promise flush-promises, lolex

Provide examples for

* ??? testing mutations, actions ???
* ??? testing `router.push()` to the route with async component using `import()` ???
* ??? broken test coverage (100% coverage but still not taking all paths: https://twitter.com/getify/status/955939257755021312) ???
* ??? 100% test coverage without need to test everything (https://labs.ig.com/code-coverage-100-percent-tragedy) ???

Issues:

* !!! `trigger("click")` on `<button type="submit">` doesn't trigger submit on form. !!!
