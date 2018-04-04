# vue-testing-examples

To document:
1. Testing dumb component
1. Testing smart component
1. Testing functional component
1. Testing v-model
1. Testing navigation guards
1. Testing filter
1. Testing directive
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

# Mocking axios

Let's have a simple service which calls external API:
```js
class AuthService {
  login (username, password) {
    return axios.post('/api/login', { username, password }).then(response => response.data);
  }
}
```
For testing different scenarios (200, 400, 404 status codes) we can use [axios-mock-adapter](https://www.npmjs.com/package/axios-mock-adapter), but there are also other alternatives available (e.g. [moxios](https://www.npmjs.com/package/moxios)).
```js
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

beforeEach(function () {
  this.axios = new AxiosMockAdapter(axios);
});

afterEach(function () {
  this.axios.verifyNoOutstandingExpectation();
  this.axios.restore();
});

it('should call external API with given params', function () {
  let fakeData = {};
  let username = 'fake_username';
  let password = 'fake_password';
  this.axios.onPost('/api/login', { username, password }).replyOnce(200, fakeData);
  return this.authService.login(username, password).then(function (response) {
    expect(response).to.deep.equal(fakeData);
  });
});
```
### Dos
* When defining mock, always try to set expected params or body (be as much specific as it gets). It prevents your tests going green because of the functionality under test was accidentally called from other parts of your code.
* Always specify the number of calls you expect. Use `replyOnce` when you know the external call should happen only once (99% test cases). If your code has a bug and calls API twice, you will spot the problem because the 2nd call will fail with `Error: Request failed with status code 404`.
* Always restore axios back to the state before your test was running. Use `axios.restore()` function to do so.
* Verify after each test that all registered mocks have been called using `axios.verifyNoOutstandingExpectation()`. It can catch issues when your test didn't executed part of the code you expected, but still went green. You can implement your own expectation if you need to, this is the current implementation:

```js
import AxiosMockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

AxiosMockAdapter.prototype.verifyNoOutstandingExpectation = function () {
  for (let verb in this.handlers) {
    let expectations = this.handlers[verb];
    if (expectations.length > 0) {
      for (let expectation of expectations) {
        expect.fail(1, 0, `Expected URL ${expectation[0]} to have been requested but it wasn't.`);
      }
    }
  }
};
```
Dont's
* Do not mock original axios functions because you loose huge portion of functionality done by axios (e.g. custom interceptors).

```js
import axios from 'axios';
import sinon from 'sinon';

beforeEach(function () {
  axios.get = sinon.stub(); // <- please don't
});
```
If you really need to check whether the `get` or `post` have been called, use rather `sinon.spy(axios, 'post');` so the original logic is preserved.

# Assert console.error() has not been called

Let's have a test expecting no action to happen (e.g. a disabled button that should not be enabled while an input is empty). The test loads the form and then it checks if the button is disabled. Everything goes green and everybody's happy. But there is a different problem your test didn't cover. The button was not kept disabled because of the application logic, but because of a javascript error and part of the code didn't execute. To catch cases like this ...

### Dos
* Make sure, after each test, that `console.error()` has not been called. You can spy on `error` function and verify expectations in `afterEach()`.

```js
import sinon from 'sinon';
import { expect } from 'chai';

beforeEach(function () {
  if (console.error.restore) { // <- check whether the spy isn't already attached
    console.error.restore(); // restore it if so. this might happen if previous test crashed the test runner (e.g. Syntax Error in your spec file)
  }
  sinon.spy(console, 'error'); // use only spy so the original functionality is still preserved, don't stub the error function
});

afterEach(function () {
  expect(console.error, `console.error() has been called ${console.error.callCount} times.`).not.to.have.been.called;
  console.error.restore(); // <- always restore error function to its initial state.
});
```

# Page objects pattern

If you are new to the page objects, please follow [great overview](https://martinfowler.com/bliki/PageObject.html) written by [Martin Fowler](https://martinfowler.com/). The basic idea is to keep things [DRY](https://code.tutsplus.com/tutorials/3-key-software-principles-you-must-understand--net-25161) and reusable, but there are few more things to mention: refactoring and readability. Let's have a page object like this:
```js
class LoginPage {
  get usernameInput() {
    return findById("username");
  }

  get passwordInput() {
    return findByCss("input.password");
  }

  get submitButton() {
    return findByXPath("/form/div[last()]/button[@primary]"); // <- please don't do this ever
  }

  login(username, password) {
    this.usernameInput.setValue(username);
    this.passwordInput.setValue(password);
    this.submitButton.click();
  }
}
```
The example above has following issues:
* Every time an ID or CSS class change, you have to update the page object.
* If you want to remove ID from the username, you have to check whether is it used in tests or not.
* If you want to remove a CSS class, you have to check whether is it used in tests or not. If it's used in the test, you have to keep class assigned to the element but the class will no longer exist in CSS file. This causes many confusions.
* Every time a new object is added to the form, it breaks the XPath for the submit button. Because of it, using XPath instead of CSS selector is always considered a bad idea.

None of these is giving you the confidence to do minor/major refactoring of your CSS or HTML because you might break the tests. To remove this coupling, you can give a unique identifier for your element through `data-` attributes introduces in [HTML5](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) or you can use your own attribute. You can choose a name of the attribute such as `data-test-id`, `data-qa` or simply `tid` if you prefer short names. The page object will look like then:
```js
class LoginPage {
  get usernameInput() {
    return findByCss("[tid='login__username']");
  }

  get passwordInput() {
    return findByCss("[tid='login__password']");
  }

  get submitButton() {
    return findByCss("[tid='login__submit-button']");
  }

  login(username, password) {
    this.usernameInput.setValue(username);
    this.passwordInput.setValue(password);
    this.submitButton.click();
  }
}
```
In the next step you can make the selector little bit shorter by extracting part of the selector to another function:
```js
function findByTId(tid) {
  return findByCss(`[tid*='${tid}']`);
}
```
Adding `*` into the selector allows us to assign more than one identifier to a single element and having better versatility in your page objects, e.g.:
```html
<nav>
  <ul>
    <li tid="home nav-item nav-item-1">Home</li>
    <li tid="about nav-item nav-item-2">About</li>
    <li tid="help nav-item nav-item-3">Help</li>
  </ul>
</nav>
```
Now you can select individual items by unique ID (`home`, `about`, `help`), or by index (`nav-item-{index}`) or you can select all of them (`nav-item`):
```js
class Nav {
  get homeLink() {
    return findByTId("home");
  }

  get aboutLink() {
    return findByTId("about");
  }

  get helpLink() {
    return findByTId("help");
  }

  get allItems() {
    return findAllByTId("nav-item");
  }

  getItemByIndex(index) {
    return findByTId(`nav-item-${index}`);
  }
}
```
