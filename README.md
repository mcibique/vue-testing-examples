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
1. mock store in the router

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
### Don'ts
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

# Dependency Injection

Mocking dependencies and imports in tests might be really tedious. Using [inject-loader](https://github.com/plasticine/inject-loader) can help a lot but requires lots of ugly coding. Another option is to involve dependency injection, such as [inversify](https://github.com/inversify/InversifyJS). They are primarily focused on Typescript but they support [vanilla JS](https://github.com/inversify/inversify-vanillajs-helpers) too. In scenarios where you don't have control over instantiating components and services, there is another very handy [toolbox](https://github.com/inversify/inversify-inject-decorators) which gives you a set of decorators usable in Vue components.

## Setting up DI in VUE

We need to create a container instance for holding all registered injections. We need only one instance per application:
```js
import { Container } from 'inversify';
let container = new Container();
export default container;
```
and then just execute it in the bootstrap phase of the application:
```js
import './di';
```
Let's create a service:
```js
export default class AuthService {
  login (username, password) {
    // do something
  }
}
```
... register it in `di.js`:
```js
import { Container } from 'inversify';
import AuthService from 'services/auth';
let container = new Container();
container.bind('authService').to(AuthService);
export default container;
```
... and then use it in VUE component:
```js
import container from './di';

class LoginView extends Vue {
  constructor() {
    this.authService = container.get('authService');
  }
  login (username, password) {
    return this.authService.login(username, password);
  }
}
```
There are a couple of issues with this approach:
1. If we register all our services in `di.js`, then we nullified code splitting because everything is required during the application bootstrap. To solve this issue, let's register service only when is required for the first time:
```js
import container from './di';

export default class AuthService {
  login (username, password) {
    // do something
  }
}

container.bind('authService').to(AuthService);
```
2. We have lots of [magic strings](http://deviq.com/magic-strings/) everywhere (e.g. what we would do if `authService` changes the name? How we prevent naming collisions?). Well, ES6 introduced [symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) that we can use. Don't forget to export the symbol so it can be used later:
```js
import container from './di';

export const AUTH_SERVICE_ID = Symbol('authService');

export default class AuthService {
  login (username, password) {
    // do something
  }
}

container.bind(AUTH_SERVICE_ID).to(AuthService);
```
... and use it in VUE component:
```js
import container from './di';
import { AUTH_SERVICE_ID } from './services/auth';

class LoginView extends Vue {
  constructor() {
    this.authService = container.get(AUTH_SERVICE_ID);
  }
  login (username, password) {
    return this.authService.login(username, password);
  }
}
```

## Using decorators
Decorators can help us to eliminate lots of code repetition and make our code cleaner.

### @Register decorator
`inversify-vanillajs-helpers` can create Register helper which can be used as a decorator anywhere in our code. Let's add this code to `di.js`:
```js
import { helpers } from 'inversify-vanillajs-helpers';

let container = new Container();
let register = helpers.register(container);

export { register as Register } // we are exporting decorator with capital R because other decorators we are already using (e.g. for Vuex) also have a capital letter
```

... and then use it:
```js
import { Register } from '@di';

export const AUTH_SERVICE_ID = Symbol('authService');

@Register(AUTH_SERVICE_ID)
export default class AuthService {
  login (username, password) {
    // do something
  }
}

```

If your service depends on other services, you can pass array of IDs as a second parameter:
```js
import { Register } from '@di';
import { CREDENTIALS_SERVICE_ID } from './credentials';

export const AUTH_SERVICE_ID = Symbol('authService');

@Register(AUTH_SERVICE_ID, [ CREDENTIALS_SERVICE_ID ])
export default class AuthService {
  constructor(credentialsService) {
    this.credentialsService = credentialsService;
  }

  login (username, password) {
    username = this.credentialsService.sanitize(username);
    password = this.credentialsService.sanitize(password);
    // do something else
  }
}
```
DI will ensure that the credentialsService will be instantiated first, using `CREDENTIALS_SERVICE_ID` to locate the constructor.
Check out documentation for [inversify-vanillajs-helpers](https://github.com/inversify/inversify-vanillajs-helpers#usage) to see all possibilities

### @LazyInject decorator
We can improve injection in our VUE components too, by using LazyInject decorators from [inversify-inject-decorators](https://github.com/inversify/inversify-inject-decorators). Let's create it and export it in `di.js` first:
```js
import getDecorators from 'inversify-inject-decorators';

let container = new Container();
let { lazyInject } = getDecorators(container);

export { lazyInject as LazyInject }
```
Now we can adjust code in VUE component:
```js
import { LazyInject } from '@di';
import { AUTH_SERVICE_ID } from './services/auth';

class LoginView extends Vue {
  @LazyInject(AUTH_SERVICE_ID) authService;

  login (username, password) {
    return this.authService.login(username, password);
  }
}
```
`LazyInject` caches the instance of `authService` until the component is destroyed. Check out the documentation for [inversify-inject-decorators](https://github.com/inversify/inversify-inject-decorators#basic-property-lazy-injection-with-lazyinject) to see more options and other decorators.


## Testing using Dependency Injection

### Mocking service dependencies

Let's have a service which depends on other services. Before we even start writing tests, make sure that the dependency is really needed. Huge dependency trees are always hard to test and to maintain because of the complexity. You can try to decouple the services and separate their logic. If it's not possible, then you should always mock other services out. Consider following services:
```js
class ServiceA {
  constructor(serviceB, serviceC) {}
}

class ServiceB {
  constructor(serviceD) {}
}

class ServiceC {
  constructor(serviceE) {}
}

class ServiceD {}

class ServiceE {
  constructor(serviceD) {}
}
```
How can we test ServiceA with all these dependencies? Let's do a naive approach first:
```js
describe('Service A', function () {
  beforeEach(function () {
    let serviceD = new ServiceD();
    let serviceE = new ServiceE(serviceD);
    let serviceB = new ServiceB(serviceD);
    let serviceC = new ServiceC(serviceE);
    let serviceA = new ServiceA(serviceB, serviceC);
  });

  it('should do something', function () {
    // test logic using serviceA
  });
});
```
A couple of issues here:
1. You have to be aware of service instantiation order, `serviceD` must be created before `serviceE` and `serviceB`, `serviceE` before `serviceC` and once you have all dependencies ready, you can finally call the constructor of `ServiceA`. If dependency tree changes, you have to adjust all tests.
1. Every time new service is added to the tree, you have to update the tests too.

When you want to mock any service in the tree, consider using a fake object with stub methods instead of calling a real constructor. If you are using [sinon](https://www.npmjs.com/package/sinon), check out their [mock API](http://sinonjs.org/releases/v4.5.0/mocks/) which enables lots of nice features and gives you better control over your mocked services.
```js
describe('Service A', function () {
  beforeEach(function () {
    let serviceD = {}; // instead of using real ServiceD constructor, create an empty object and fake all methods that are used from serviceA
    serviceD.doSomething = sinon.spy();
    this.serviceDMock = serviceD;

    let serviceE = new ServiceE(serviceD);
    let serviceB = new ServiceB(serviceD);
    let serviceC = new ServiceC(serviceE);
    let serviceA = new ServiceA(serviceB, serviceC);

    this.serviceBMock = sinon.mock(serviceB); // mock serviceB using sinon.mock API. this will create Proxy object which you can configure to expect calls on serviceB instance.
  });

  afterEach(function () {
    this.serviceBMock.verify(); // verify all expectations have been called
  });

  it('should do something', function () {
    let doSomethingSpy = this.serviceBMock.expects('doSomething').returns(42).once();
    let result = serviceA.runMethodUnderTest(24); // let's assume that this method calls serviceB and serviceD
    expect(result).to.equal(66);
    expect(doSomethingSpy).to.have.been.calledWith(24);
    expect(this.serviceDMock.doSomething).to.have.been.calledWith(24);
  });
});
```

Now, let's do better approach and let DI container to resolve our dependencies.
```js
import { Register } from './di';

@Register('serviceA', ['serviceB', 'serviceC'])
class ServiceA {
  constructor(serviceB, serviceC) {}
}

@Register('serviceB', ['serviceD'])
class ServiceB {
  constructor(serviceD) {}
}

@Register('serviceC', ['serviceE'])
class ServiceC {
  constructor(serviceE) {}
}

@Register('serviceD')
class ServiceD {}

@Register('serviceE', ['serviceD'])
class ServiceE {
  constructor(serviceD) {}
}
```
... and then in spec file you can just type
```js
import container from './di';

describe('Service A', function () {
  beforeEach(function () {
    let serviceA = container.get('serviceA');
  });
});
```

It's much nicer now, but wait, the mocking ability is now gone. How can `serviceC` can be mocked during execution of these tests? The service registration in DI container can be replaced with our own mock.
```js
import container from './di';

describe('Service A', function () {
  beforeEach(function () {
    let serviceC = container.get('serviceC');
    this.serviceCMock = sinon.mock(serviceC);
    container.rebind('serviceC').toConstantValue(serviceC); // removes old registered class and replaces it with singleton constant value
    let serviceA = container.get('serviceA');
  });

  afterEach(function () {
    this.serviceCMock.verify(); // verify all expectations have been called
  });

  it('should do something', function () {
    let doSomethingSpy = this.serviceCMock.expects('doSomething').returns(42).once();
    let result = serviceA.runMethodUnderTest(24); // let's assume that this method calls serviceC
    expect(result).to.equal(66);
    expect(doSomethingSpy).to.have.been.calledWith(24);
  });
});
```
Everything that test changes in the container registration should be restored after the test is done, otherwise, changes might affect the following test. You can achieve this by using built-in functionality in inversify called [snapshots](https://github.com/inversify/InversifyJS/blob/master/wiki/container_snapshots.md). Create a snapshot before you perform changes to registration and restore it back to normal after your test is done.

```js
import container from './di';

describe('Service A', function () {
  beforeEach(function () {
    container.snapshot();
    // ...
    container.rebind('serviceC').toConstantValue(serviceC);
    //
  });

  afterEach(function () {
    container.restore();
  });
});
```
You can move this calls to the global scope of the test to avoid repetition in your code.
```js
// globals.js
import container from '@di';

beforeEach(function () {
  container.snapshot();
});

afterEach(function () {
  container.restore();
});
```
... and then use this file when running mocha
```json
// package.json
{
  "test": "vue-cli-service test src/**/*.spec.js --include ./test/unit/globals.js",
}
```
If you are using `--watch` mode, files included are not executed after any change, so the better solution is to import this file at the top of your spec file instead.

### Mocking global objects

Testing a functionality which requires global objects (`window.location` or `setTimeout`) is always a challenge. `window.location` is property which cannot be overridden but many tests require this property to be mocked. If you have a component which sets `window.location.href = 'some/new/url';`, then this code must be avoided in the tests, otherwise, it might break your current test execution (especially if you are running tests in the browser, e.g. with [karma-runner](https://www.npmjs.com/package/karma)). Dependency Injection can actually sort out this problem because we can inject the global object into your component and then control what is injected into a component in your tests.
```js
// di.js
export const WINDOW_ID = Symbol('window');
container.bind(WINDOW_ID).toConstantValue(window);

// my-components.js
import Vue from 'vue';
import { LazyInject, WINDOW_ID } from './di';

export default class MyComponent extends Vue {
  @LazyInject(WINDOW_ID) window; // uses real window in PROD build, but can be mocked object in tests

  onClick() {
    this.window.location.href = 'some/new/url';
  }
}
```
... and your tests:
```js
// my-component.spec.js
import container { WINDOW_ID } from './di';

beforeEach(function () {
  container.snapshot();

  this.windowMock = { location: { href: '' } };

  container.rebind(WINDOW_ID).toConstantValue(this.windowMock);
});

afterEach(function () {
  container.restore();
});

it('should navigate to new url', function () {
  let myComponent = mount(MyComponent); // LazyInject in the component will inject windowMock instead of real window object
  myComponent.onClick(); // this call now operates with windowMock, so no real navigation happens in the browser

  expect(this.windowMock.location.href).to.equal('some/new/url'); // assert correct URL has been set
});
```

## Using stub services in dev mode

Local development usually requires working back-end services (API) to be running on developers machine. While the API is still in development, usually it's very unstable with lots of bugs (we all producing bugs). Front-end developers often using a technique of stubbing API and work with fake implementation instead. Just create a simple express server, develop your application against it and once the back-end API is ready, just unplug the stubs. Stubs also help to simulate scenarios which are really hard to achieve using real back-end and DB.

Instead of building your own express server, webpack offers another nice solution how to create stubs for your services. Let's have an `AuthService` which communicates with real back-end API:
```js
import axios from 'axios';
import { Register } from '@di';

export const AUTH_SERVICE_ID = Symbol('authService');

@Register(AUTH_SERVICE_ID)
export default class AuthService {
  login (username, password) {
    return axios.post('/api/login', { username, password }).then(response => response.data);
  }

  logout () {
    return axios.post('/api/logout').then(response => response.data);
  }
}
```
And let's pretend that the back-end is not ready yet. We can create twin service with fake implementation:
```js
export default class AuthServiceStub {
  login (username, password) {
    return Promise.resolve("random_token");
  }

  logout () {
    return Promise.resolve({});
  }
}
```
Now we need to solve a problem how and when to switch these two services. How can we tell the app which one to use? Webpack has a nice feature called [resolve.extensions](https://webpack.js.org/configuration/resolve/#resolve-extensions) which is used as a decision point to determine extension of the file. In vue app, the value is set to `[".js", ".vue", ".json"]`. If you add `import AuthService from './auth-service'`, then webpack tries to find a file `./auth-service.js`, then `./auth-service.vue` and then `./auth-service.json`, the first match wins. So if we move our AuthServiceStub to another file `./auth-service.stub.js` and then tell the webpack to resolve extensions in order `[".stub.js", ".js", ".vue", ".json"]`, it will first try to import our stub service and only if a stub is not present, then it imports the real implementation.

This logic can be controlled via [configuration](https://www.npmjs.com/package/webpack-chain), in `vue.config.js`.
```js
let useServiceStub = !!process.env.npm_config_stub;

module.exports = {
  chainWebpack (config) {
    if (useServiceStub) {
      config.resolve.extensions.prepend('.stub.js');
    }
  }
};
```
`npm_config_*` is a feature of `npm run-script`. If you call any npm script with `--stub` flag, `process.env.npm_config_stub` will be set to true. In our vue app, there is already command for serving the app in `package.json`:
```bash
npm run serve
```
^^ this one sets `npm_config_stub` to false, so the app will run without stubs
```bash
npm run serve --stub
```
^^ and this one with stubs.

### Dos
* You can reuse logic from real implementation in your stub by inheriting the stub from a real one. In this example, you can see the stub not completely overriding existing code, but rather mocking API call based on the username and password. The advantage is that logic inside real implementation is now running too, which might be important for you. Also, mocking axios is better than returning resolved promises because you might have registered an error interceptor (or any other request interceptor) which you would like to see running too.
```js
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { Override } from '@di';
import AuthService, { AUTH_SERVICE_ID } from './auth.js'; // always use '.js' extension otherwise this module will be required.

export { AUTH_SERVICE_ID };

@Override(AUTH_SERVICE_ID)
export default class AuthServiceStub extends AuthService {
  login (username, password) {
    let axiosMock = new AxiosMockAdapter(axios);
    if (username === password) {
      axiosMock.onPost('/api/login', { username, password }).replyOnce(200, 'random_token');
    } else {
      axiosMock.onPost('/api/login', { username, password }).replyOnce(401, { error: { message: 'Invalid username or password' } });
    }

    return super.login(username, password).finally(() => axiosMock.restore()); // call original function and restore axios back to original state
  }
}
```

### Don'ts
* If you are inheriting classes, don't forget to always call `super()` methods.
