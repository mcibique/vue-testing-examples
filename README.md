# Vue testing examples

The documentation is still under construction, see [TODO](./TODO.md).

Topics already covered:

* [Testing pyramid, dumb vs smart components, mount vs shallow](#testing-pyramid-dumb-vs-smart-components-mount-vs-shallow)
  * [Dumb components](#dumb-components)
  * [Smart components](#smart-components)
  * [Functional components](#functional-components)
  * [Services](#services)
  * [Filters](#filters)
  * [Directives](#directives)
  * [Store](#store)
  * [Router](#router)
* [Mocking axios](#mocking-axios)
* [Assert console.error() has not been called](#assert-consoleerror-has-not-been-called)
* [Page objects pattern](#page-objects-pattern)
* [Dependency Injection](#dependency-injection)
  * [Setting up DI in VUE](#setting-up-di-in-vue)
  * [Using decorators](#using-decorators)
    * [@Register decorator](#register-decorator)
    * [@LazyInject decorator](#lazyinject-decorator)
  * [Why Dependency Injection?](#why-dependency-injection)
    * [Mocking behavior in development](#1-mocking-behavior-in-development)
    * [Swapping dependencies in the runtime based on a configuration and other flags](#2-swapping-dependencies-in-the-runtime-based-on-a-configuration-and-other-flags)
    * [Mocking in unit tests](#3-mocking-in-unit-tests)
  * [Testing using Dependency Injection](#testing-using-dependency-injection)
    * [Mocking service dependencies](#mocking-service-dependencies)
    * [Mocking global objects](#mocking-global-objects)
* [Time travelling and testing setTimeout](#time-travelling-and-testing-settimeout)
* [Using stub services in dev mode](#using-stub-services-in-dev-mode)
* [Mocking store (Vuex)](#mocking-store-vuex)
  * [Mocking store for a smart component](#mocking-store-for-a-smart-component)
  * [Mocking store for router](#mocking-store-for-router)
  * [Mocking actions, mutations and getters](#mocking-actions-mutations-and-getters)
  * [Setting up initial state in tests](#setting-up-initial-state-in-tests)
    * [Using existing mutations to change initial state](#using-existing-mutations-to-change-initial-state)
    * [Modifying the state directly](#modifying-the-state-directly)
* [Testing v-model](#testing-v-model)
* [Using flush-promises vs Vue.nextTick()](#using-flush-promises-vs-vuenexttick)
* [Testing navigation guards](#testing-navigation-guards)
  * [beforeRouteEnter](#beforerouteenter)
* [Testing provide/inject](#testing-provideinject)
  * [Testing component that injects values](#testing-component-that-injects-values)
  * [Testing component that provides values](#testing-component-that-provides-values)

## Testing pyramid, dumb vs smart components, mount vs shallow

If you are not familiar with testing pyramid, check out the article about it written by [Ham Vocke](https://martinfowler.com/articles/practical-test-pyramid.html) on Martin's Fowler blog. Usually, writing only unit tests for a VUE app is not enough, especially if you have a components with lots of logic and lots of dependencies. It would be better to test it together. You can try to do that in E2E tests, but E2E tests should be running against fully working and fully configured system with DB, all back-end services and without any mocks. That's very hard to achieve locally, and if you want to test all edge cases, E2E tests can take hours to run. Usually, E2E tests run after your changes were merged to master branch and were fully tested by your QA and were integrated by your CI process. It's not too late to spot the bugs here, but it delays delivery of your product because bugs must be fixed first and go through PR, QA and CI again.

Integration tests are an alternative for E2E. These tests can integrate a couple of components together and allows you to mock API calls, so you can easily simulate all edge cases which you cannot achieve in E2E tests. Integration tests are also faster than E2E because they don't fully load the app and don't rely on setting up a brower and the network.

Therefore, you should still keep writing E2E tests, instead of testing every edge case, test only a [happy path](https://en.wikipedia.org/wiki/Happy_path) and common errors (like validation errors, 400 errors), and put all possible scenarios to the integration tests (200, 302, 400, 401, 403, 404, 412 error codes).

The app which docs you are reading now is using the following rules to determine whether to use unit or integration tests and what should be tested or mocked out. The main difference is whether you are testing [smart or dumb components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

### Dumb components

A dumb component should never be aware of its parent and children, all data should be coming from props. The component should not perform any operation in store, should not navigate to different routes and should not perform any API calls. The only test we can do is a unit test, using only shallow rendering.

### Smart components

A smart component is responsible for loading data (from API or store), interacting with the store, passing props down and waiting for events from children, thus the component should be tested using integration test and be aware of its children during the tests. For that, we should always be using `mount` instead of `shallow` rendering. Shallow rendering is loosing grip in [React world](https://blog.kentcdodds.com/why-i-never-use-shallow-rendering-c08851a68bb7) too and their major reason is [The more your tests resemble the way your software is used, the more confidence they can give you](https://twitter.com/kentcdodds/status/977018512689455106). I cannot agree more with this statement.

Let's have a smart component which uses a store, router, 3rd party UI library (e.g. Material or bootstrap), REST API, native browser APIs (canvas, localStorage) and also communicates with workers. If you decide to use only unit tests and shallow rendering, all these parts must be tested independently with tons of mocking. You only see all parts running together in your browser and during E2E tests. There is so much stuff that can go wrong during writing of mocks. Your tests might go green because of it, but if you have tested it as set of integrated components, you would spot the problem.

If you decide to go with integration tests, then all parts should stay and you can test them working together. It's not always possible to keep everything, e.g. API calls cannot be executed because there's no server available. Native browser APIs can be problematic too. If you run your tests with Karma and Chrome/Firefox, you have canvas available, but if you run your tests with mocha and jsdom, you don't have canvas and you're forced to mock it. Same can happen with workers and localStorage. You might have a service which needs to communicate with a browser extension, that's also not possible to keep. Everything else, store, router and 3rd party libraries, usually don't require any special APIs thus they can stay without mocking.

Use user interactions instead of calling methods in the component directly. That also brings your tests closer to the way how your components are used in production. Think about your component UI as a contract for test. If you have a component which has 50 tiny methods, don't test them one by one. Instead of that, click on buttons/links triggering these methods. If you are getting data from store or passing them as props, don't check if the data has been assigned to `vm`, check the data are displayed in the DOM instead.

### Functional components

A functional component is considered a dumb component and should follow the same rules.

### Services

Services should be autonomous and should not rely on VUE. Unit tests are just enough. If service is calling back-end API, mock it and test all possible return codes (same as smart components). If service depends on other services, mock them too.

### Filters

A filter should be a simple pure function without any side effects and should not be using the store, router, any service or API calls. Unit testing is considered enough here.

### Directives

A directive usually requires another HTML element and an user interaction to be triggered. Integration tests and `mount` are better for these scenarios.

### Store

A store should have tested all actions and mutations using unit tests. Mock all services and API calls. Smart components should be testing interaction with the store in their tests. If the store uses a router, mock it.

### Router

If there is logic in your router config (e.g. `beforeRouteEnter`), test this logic in unit tests. If the same logic uses a store, mock it. Everything else should be mocked as well. Routing between components should be tested in integration tests in smart components or in E2E tests.

|What            |Test type  |shallow/mount|Service calls|API calls|store      |router     |
|----------------|-----------|-------------|-------------|---------|-----------|-----------|
|Dumb components |Unit       |shallow      |mock         |N/A      |N/A        |N/A        |
|Smart components|Integration|mount        |do not mock  |mock     |do not mock|do not mock|
|Func components |Unit       |shallow      |mock         |N/A      |N/A        |N/A        |
|Services        |Unit       |N/A          |mock         |mock     |mock       |mock       |
|Filters         |Unit       |N/A          |N/A          |N/A      |N/A        |N/A        |
|Directives      |Integration|mount        |N/A          |N/A      |N/A        |N/A        |
|Store           |Unit       |N/A          |mock         |mock     |N/A        |mock       |
|Router          |Unit       |N/A          |mock         |mock     |mock       |N/A        |

## Mocking axios

Let's have a simple service which calls an external API:

```js
class AuthService {
  login (username, password) {
    return axios.post('/api/login', { username, password }).then(response => response.data);
  }
}
```

For testing different scenarios (200, 400, 404 status codes) we can use [axios-mock-adapter](https://www.npmjs.com/package/axios-mock-adapter), but there are also alternatives available (e.g. [moxios](https://www.npmjs.com/package/moxios)).

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

* When defining mock, always try to set expected params or body (be as much specific as possible). It prevents your tests going green because of the functionality under test was accidentally called from other parts of your code.
* Always specify the number of calls you expect to happen. Use `replyOnce` when you know the external call should happen only once (99% test cases). If your code has a bug and calls API twice, you will spot the problem because the 2nd call will fail with `Error: Request failed with status code 404`.
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

## Assert console.error() has not been called

Let's have a test expecting no action to happen (e.g. a disabled button that should not be enabled while an input is empty). The test loads the form and then it checks if the button is disabled. Everything goes green and everybody's happy. But there is a different problem, your test didn't cover: the button was not kept disabled because of the application logic, but because of a javascript error somewhere in your code. To catch cases like this, make sure, after each test, that `console.error()` has not been called. You can spy on `error` function and verify expectations in `afterEach()`.

```js
import sinon from 'sinon';
import { expect } from 'chai';

beforeEach(function () {
  if (console.error.restore) { // <- check whether the spy isn't already attached
    console.error.restore(); // restore it if so. this might happen if previous test crashed the test runner (e.g. Syntax Error in your spec file)
  }
  sinon.spy(console, 'error'); // use only spy so the original functionality is preserved, don't stub the error function
});

afterEach(function () {
  expect(console.error, `console.error() has been called ${console.error.callCount} times.`).not.to.have.been.called;
  console.error.restore(); // <- always restore error function to its initial state.
});
```

## Page objects pattern

If you are new to the page objects, please follow [great overview](https://martinfowler.com/bliki/PageObject.html) written by [Martin Fowler](https://martinfowler.com/). The basic idea is to keep things [DRY](https://code.tutsplus.com/tutorials/3-key-software-principles-you-must-understand--net-25161) and reusable, but there are more things to mention: refactoring and readability. Let's have a page object like this:

```js
class LoginPage {
  get usernameInput() {
    return findById("username");
  }

  get passwordInput() {
    return findByCss("input.password");
  }

  get submitButton() {
    return findByXPath("/form/div[last()]/button[@primary]"); // <- please don't do this ever, XPath is the worst selector ever
  }

  login(username, password) {
    this.usernameInput.setValue(username);
    this.passwordInput.setValue(password);
    this.submitButton.click();
  }
}
```

The example above has the following issues:

* Every time an ID or CSS class change, you have to update the page object.
* If you want to remove ID from the username, you have to check whether it is used in tests or not.
* If you want to remove a CSS class, you have to check whether it is used in tests or not. If it's used in the test, you have to keep class assigned to the element but the class will no longer exist in CSS file. This causes many confusions.
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

Adding `*` into the selector allows us to assign more than one identifier to a single element and a better versatility in your page objects, e.g.:

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

## Dependency Injection

Mocking dependencies and imports in tests might be really tedious. Using [inject-loader](https://github.com/plasticine/inject-loader) or [proxyquire](https://github.com/thlorenz/proxyquire) can help a lot but it requires lots of ugly code. Another option is to involve dependency injection, such as [inversify](https://github.com/inversify/InversifyJS). They are primarily focused on Typescript but they support [vanilla JS](https://github.com/inversify/inversify-vanillajs-helpers) too (without any trade offs). In scenarios where you don't have control over instantiating components and services, there is another very handy [toolbox](https://github.com/inversify/inversify-inject-decorators) which gives you a set of decorators usable in Vue components.

### Setting up DI in VUE

We need to create a container instance for holding all registered injections. We need only one instance per application:

```js
import { Container } from 'inversify';
const container = new Container();
export default container;
```

and then just execute it in the application bootstrap:

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
const container = new Container();
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

1. If we register all our services in `di.js`, then we nullified the code splitting because everything is required during the application bootstrap. To solve this issue, let's register a service into the container only when it is required for the first time:

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

There are many other ways how to register service, singletons, constructors, tags, bindings, etc. Check out the inversify [docs](https://github.com/inversify/InversifyJS/blob/master/wiki/symbols_as_id.md) for more.

### Using decorators

Decorators can help us to eliminate lots of code repetition and make our code cleaner.

#### @Register decorator

The @Register() decorator is just a syntactic sugar for registering classes to the container. In Typescript, you would have `@injectable` and `@inject` decorators available, but this project is not using TS, it's plain JS. The InversifyJS maintainers have provided another set of decorators/helpers called [inversify-vanillajs-helpers](https://github.com/inversify/inversify-vanillajs-helpers), for using inversify without TS. They just need a unique identifier for each registered class, because they cannot tell which parameter in constructor belongs to which registered class.

Let's have classes defined as:

```js
class C {}

class B {
  constructor(c) {
    this.c = c;
  }
}

class A {
  constructor(b, c) {
    this.b = b;
    this.c = c;
  }
}
```

You can register all classes to the container and give each class unique identifier.

```js
container.bind("c").to(C);
container.bind("b").to(B);
container.bind("a").to(A);

const c = container.get("c");
console.log(c instanceof C); // true
```

Unfortunately, this is not enough for `B` and `A`. When you ask in the code `container.get("A")`, the container will try to instantiate A but there are 2 unknown parameters `b` and `c` in the constructor. We need to tell the container, that for parameter `b`, use class registered with key `"b"` and for `c`, use class with key `"c"`. This can be done this way:

```js
inversify.decorate(inversify.injectable(), A);
inversify.decorate(inversify.inject("b"), B, 0);
inversify.decorate(inversify.inject("c"), C, 1);
container.bind("a").to(A);
```

In TS, this is done by `@injectable` and `@inject` decorators automatically. Doing this for every class in your project would be annoying, so let's use rather a vanillajs helper:

```js
const register = helpers.register(container);
register("a", ["b", "c"])(A);
```

^^ this helper called `register` is now coupled with the container and does exactly the same thing as the previous example, and the helper can also be used as a decorator:

```js
@register("a", ["b", "c"])
class A {
  constructor(b, c) {}
}
```

... is equivalent to:

```js
register("a", ["b", "c"])(
class A {
  constructor(b, c) {}
});
```

In this project, the decorators are defined in `di.js`:

```js
import { helpers } from 'inversify-vanillajs-helpers';

const container = new Container();
const register = helpers.register(container);

export { register as Register } // we are exporting decorator with capital R because other decorators we are already using (e.g. for Vuex) also have a capital letter
```

... so they can be accessed anywhere in the code:

```js
import { Register } from './di';
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

DI will ensure that the `credentialsService` will be instantiated first, using `CREDENTIALS_SERVICE_ID` to locate the constructor.
Check out documentation for [inversify-vanillajs-helpers](https://github.com/inversify/inversify-vanillajs-helpers#usage) to see all possibilities

#### @LazyInject decorator

The LazyInject decorator can be very useful for injecting services into the VUE components, as we don't have control over the component instantiation we need to inject services into properties. Let's import the decorator from [inversify-inject-decorators](https://github.com/inversify/inversify-inject-decorators) and make it available in `di.js` first:

```js
import getDecorators from 'inversify-inject-decorators';

const container = new Container();
const { lazyInject } = getDecorators(container);

export { lazyInject as LazyInject }
```

`di.js` creates a new decorator LazyInject which is tied with the container where everything is registered. Now we can adjust the code in the VUE component:

```js
import { LazyInject } from './di';
import { AUTH_SERVICE_ID } from './services/auth';

class LoginView extends Vue {
  @LazyInject(AUTH_SERVICE_ID) authService; // internally asks the container to get an instance of the AUTH_SERVICE_ID

  login (username, password) {
    return this.authService.login(username, password);
  }
}
```

`LazyInject` caches the instance of `authService` until the component is destroyed. Check out the documentation for [inversify-inject-decorators](https://github.com/inversify/inversify-inject-decorators#basic-property-lazy-injection-with-lazyinject) to see more options and other decorators.

### Why Dependency Injection?

#### 1. Mocking behavior in development

Let's say that you have an email service which sends emails to a given address, but you don't want to send real emails in DEV/TEST environments. You can create two different implementations of the same interface and register them conditionally:

```js
class RealEmailService {
  sendEmail(from, to, body) {
    // send the email
    return true; // or false if sending failed
  }
}

class FakeEmailService {
  sendEmail(from, to, body) {
    console.log(`Sending an email from ${from} to ${to} with body ${body} skipped.`)
    return true; // always return true
  }
}

// config.js
if (process.env.NODE_ENV === "production") {
  container.bind("emailService").to(RealEmailService);
} else {
  container.bind("emailService").to(FakeEmailService);
}

// order.service.js
@Register("orderService", ["emailService"])
class OrderService {
  constructor(emailService) {
    this.emailService = emailService; // this would be a real implementation in production, but fake in other environments
  }

  registerOrder(order) {
    // ...
    this.emailService.sendEmail("system", order.emailAddress, `Order ${order.number} has been sent.`);
    // ...
  }
}
```

#### 2. Swapping dependencies in the runtime based on a configuration and other flags

DI containers often support named bindings, which allows registering multiple classes to one key. See also the [docs](https://github.com/inversify/InversifyJS/blob/master/wiki/named_bindings.md) about named bindings.

```js
class VIPDiscountService {
  getDiscount() {
    return 10;
  }
}

class RegularDiscountService {
  getDiscount() {
    return 5;
  }
}

container.bind("discountService").to(VIPDiscountService).whenTargetNamed("VIP");
container.bind("discountService").to(RegularDiscountService).whenTargetNamed("Regular");

@Register("orderService")
class OrderService {
  registerOrder(order) {
    // ...
    let customerType = order.customer.isVIP ? "VIP" : "Regular";
    let discountService = container.getNamed("discountService", customerType);
    let discount = discountService.getDiscount();
    // ...
  }
}
```

#### 3. Mocking in unit tests

Replacing registered classes allows you to control dependencies of the service under test. See next chapter [Testing using Dependency Injection](#testing-using-dependency-injection)

### Testing using Dependency Injection

#### Mocking service dependencies

Let's have a service which depends on other services. Before we even start writing tests, make sure that the dependency is really needed. Huge dependency trees are always hard to test and hard to maintain because of the complexity. You can try to decouple the services and separate their logic. If it's not possible, then you should always mock other services out. Consider the following services:

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

1. You have to be aware of the service instantiation order, `serviceD` must be created before `serviceE` and `serviceB`, `serviceE` before `serviceC` and once you have all dependencies ready, you can finally call the constructor of `ServiceA`. If the dependency tree changes, you have to adjust all tests.
2. Every time a new service is added to the tree, you have to update the tests too.

When you want to mock any service in the tree, consider using a fake object with stub methods instead of calling a real constructor. If you are using [sinon](https://www.npmjs.com/package/sinon), check out their [mock API](http://sinonjs.org/releases/v4.5.0/mocks/) which enables lots of nice features and gives you better control over your mocked services.

```js
describe('Service A', function () {
  beforeEach(function () {
    const serviceD = {}; // instead of using real ServiceD constructor, create an empty object and fake all methods that are used from serviceA
    serviceD.doSomething = sinon.spy();
    this.serviceDMock = serviceD;

    const serviceE = new ServiceE(serviceD);
    const serviceB = new ServiceB(serviceD);
    const serviceC = new ServiceC(serviceE);
    const serviceA = new ServiceA(serviceB, serviceC);

    this.serviceBMock = sinon.mock(serviceB); // mock serviceB using sinon.mock API. this will create Proxy object which you can configure to expect calls on serviceB instance.
  });

  afterEach(function () {
    this.serviceBMock.verify(); // verify if all expectations have been called
  });

  it('should do something', function () {
    const doSomethingSpy = this.serviceBMock.expects('doSomething').returns(42).once();
    const result = serviceA.runMethodUnderTest(24); // let's assume that this method calls serviceB and serviceD
    expect(result).to.equal(66);
    expect(doSomethingSpy).to.have.been.calledWith(24);
    expect(this.serviceDMock.doSomething).to.have.been.calledWith(24);
  });
});
```

Now, let's do a better approach and let the DI container to resolve our dependencies.

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

... and then in the spec file you can just type:

```js
import container from './di';

describe('Service A', function () {
  beforeEach(function () {
    const serviceA = container.get('serviceA');
  });
});
```

It's much cleaner now, but wait, the mocking ability is now gone. How `serviceC` can be mocked during execution of these tests? The answer to that is simple, the service registration in the DI container can be replaced with our own mock.

```js
import container from './di';

describe('Service A', function () {
  beforeEach(function () {
    const serviceC = container.get('serviceC');
    this.serviceCMock = sinon.mock(serviceC);
    container.rebind('serviceC').toConstantValue(serviceC); // removes old registered class and replaces it with singleton constant value
    const serviceA = container.get('serviceA');
  });

  afterEach(function () {
    this.serviceCMock.verify(); // verify all expectations have been called
  });

  it('should do something', function () {
    const doSomethingSpy = this.serviceCMock.expects('doSomething').returns(42).once();
    const result = serviceA.runMethodUnderTest(24); // let's assume that this method calls serviceC
    expect(result).to.equal(66);
    expect(doSomethingSpy).to.have.been.calledWith(24);
  });
});
```

Everything that the test changes in the container registration should be restored after the test is done, otherwise changes might affect the next test execution. You can achieve this by using the built-in functionality in the inversify package called [snapshots](https://github.com/inversify/InversifyJS/blob/master/wiki/container_snapshots.md). Create a snapshot before you perform changes to registration and restore it back to normal after your test is done.

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
import container from './di';

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
  "test": "vue-cli-service test:unit 'src/**/*.spec.js' --include ./test/unit/globals.js",
}
```

If you are using `--watch` mode, files included with the flag `--include` are not hot reloaded after changing it's content, to overcome this problem, the solution is to import the file at the top of your spec file.

#### Mocking global objects

Testing a functionality which requires global objects (`window.location` or `setTimeout`) is always a challenge. `window.location` is a property that cannot be overridden but many tests require this property to be mocked. If you have a component which sets `window.location.href = 'some/new/url';`, then this code must be avoided in the test, otherwise, it might break your current test execution (especially if you are running tests in the browser, e.g. with [karma-runner](https://www.npmjs.com/package/karma)). Once again, the Dependency Injection can actually sort out this problem because we can inject the global object into your component and then we can pass custom object, without any restrictions, into a component in your test.

```js
// di.js
export const WINDOW_ID = Symbol('window');
container.bind(WINDOW_ID).toConstantValue(window);

// my-components.js
import Vue from 'vue';
import { LazyInject, WINDOW_ID } from './di';

export default class MyComponent extends Vue {
  @LazyInject(WINDOW_ID) window; // uses real window in PROD build, but can be mocked otherwise

  onClick() {
    this.window.location.href = 'some/new/url';
  }
}
```

... and your test:

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
  const myComponent = mount(MyComponent); // LazyInject in the component will inject windowMock instead of real window object
  myComponent.onClick(); // this call now operates with windowMock, so no real navigation happens in the browser

  expect(this.windowMock.location.href).to.equal('some/new/url'); // assert correct URL has been set
});
```

## Time travelling and testing setTimeout

There are several ways on how to test `setTimeout` functions in your code. For all of them, we are going to use the LoginView component which displays some helpful links after 5s. Please don't judge the UX, it's for demonstration purposes:

```js
class LoginView extends Vue {
  displayHelp = false;

  created () {
    setTimeout(() => {
      this.displayHelp = true;
    }, 5000);
  }
}
```

What we need to test:

1. The initial status of the component (displaying help links should be false)
2. Time travel to 2s after the component was created (check if help links are still not being displayed)
3. Time travel beyond 5s after the component was created (check if help links are being displayed)

Let's start with the easiest, but not very robust test solution:

```js
import { expect } from 'chai';
import sinon from 'sinon';

beforeEach(function () {
  this.originalSetTimeout = window.setTimeout;
  window.setTimeout = sinon.stub();
});

afterEach(function () {
  window.setTimeout = this.originalSetTimeout; // restore original setTimeout
});

it('should not display help links when a component was just created', function () {
  const wrapper = mount(LoginView);
  expect(wrapper.vm.displayHelp).to.be.false;
});

it('should display help links only after 5s', function () {
  const wrapper = mount(LoginView);
  expect(window.setTimeout).to.have.been.calledWith(sinon.match.any, 5000);
});
```

Simple, huh? Yes, it technically does test what was specified, but it's not very convincing. We did lots of shortcuts and we actually never checked whether `displayHelp` became true or not. The callback in `setTimeout` is part of the component's logic but it wasn't called at all. What if there is a logic somewhere in the code canceling the timeout? Besides we can't check what is the state after 2s. Let's add a little more logic to our test:

```js
it('should display help links only after 5s', function () {
  window.setTimeout = sinon.stub().callsFake(fn => fn()); // any function that is passed to setTimeout is immediately executed

  const wrapper = mount(LoginView);
  expect(window.setTimeout).to.have.been.calledWith(sinon.match.any, 5000);
  expect(wrapper.vm.displayHelp).to.be.true;
});
```

This time the callback is executed and our flag is set to true, but we created another problem. The callback is executed synchronously instead. That changes the order of execution which means we are not testing how code runs in production. And we still cannot test a state of our component after 2s and we are still unsure about timeout cancellation. Let's involve a library that was built-in for this and has a better control over `setTimeout` and it's execution: [lolex](https://github.com/sinonjs/lolex). Lolex has an API which can mock `setTimeout` and allow us to jump in time by 100ms, by 1s, by 1 day while our test is executing (that means the test execution is not paused for 2s).

```js
import { expect } from 'chai';
import lolex from 'lolex';

beforeEach(function () {
  this.clock = lolex.install(window); // this mocks window.setTimeout with lolex implementation
});

afterEach(function () {
  this.clock.uninstall(); // restore original setTimeout
});

it('should not display help links when a component was just created', function () {
  const wrapper = mount(LoginView);
  expect(wrapper.vm.displayHelp).to.be.false;
});

it('should not display help links before 5s elapsed', function () {
  const wrapper = mount(LoginView);

  this.clock.tick(2000);
  expect(wrapper.vm.displayHelp).to.be.false;

  this.clock.tick(2000);
  expect(wrapper.vm.displayHelp).to.be.false;

  this.clock.tick(2000); // this is the moment when callback is finally executing
  expect(wrapper.vm.displayHelp).to.be.true;
});
```

It's looking really nice now. The clock was able to move our test 2s ahead, checked the state, moved another 2s, checked, moved another 2s and did a final check. The callback was executed after multiple calls to `this.clock.tick()` and not synchronously during `created()` lifecycle event. Lolex also supports mocking other functions that manipulate time, see their [API reference](https://github.com/sinonjs/lolex#api-reference) for more information.

Lolex is also capable to work with mocked global objects. Let's consider a scenario from [Mocking global objects](#mocking-global-objects):

```js
import { expect } from 'chai';
import lolex from 'lolex';

import container { WINDOW_ID } from './di';

beforeEach(function () {
  container.snapshot();

  const windowMock = {};
  this.clock = lolex.install({ target: windowMock, toFake: ['setTimeout', 'clearTimeout'] }); // only fake timeout methods, don't waste time on other functions
  container.rebind(WINDOW_ID).toConstantValue(windowMock);
});

afterEach(function () {
  container.restore();
  this.clock.uninstall();
});

// ...
```

## Using stub services in dev mode

The local development usually requires a working back-end (API) running on the developer machine to populate data in the front-end. One problem to mention is that the API might be under development, leading to an unstable version, with bugs (we all produce bugs) and breaking changes in the data schema. Front-end developers often use a technique of stubbing API and work with fake implementation to overcome this situation. Just create a simple express server, develop your application against it and once the back-end API is ready, just unplug the stubs. Stubs also help to simulate scenarios which are really hard to achieve when using a real back-end.

Instead of building your own express server, webpack offers another solution to create stubs for your services. As an example, let's build an `AuthService` which communicates with a real back-end:

```js
import axios from 'axios';
import { Register } from './di';

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

And let's pretend that the back-end is not ready yet. We can create a twin service with fake implementation:

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

Now we need to solve a problem: how and when to switch between these two services. How can we tell the app which one to use? Webpack has a nice feature called [resolve.extensions](https://webpack.js.org/configuration/resolve/#resolve-extensions) which is used as a decision point to determine extension of the file. In vue app, the value is set to `[".js", ".vue", ".json"]`. If you add `import AuthService from './auth-service'`, then webpack tries to find a file `./auth-service.js`, then `./auth-service.vue` and then `./auth-service.json`, the first match wins. So if we move our AuthServiceStub to another file `./auth-service.stub.js` and then tell the webpack to resolve extensions in order `[".stub.js", ".js", ".vue", ".json"]`, it will first try to import our stub service and only if a stub is not present, it will import the real implementation.

This logic can be controlled via [configuration](https://www.npmjs.com/package/webpack-chain), in `vue.config.js`.

```js
const useServiceStub = !!process.env.npm_config_stub;

module.exports = {
  chainWebpack (config) {
    if (useServiceStub) {
      config.resolve.extensions.prepend('.stub.js');
    }
  }
};
```

`npm_config_*` is a feature of `npm run-script`. If you call any npm script with `--stub` flag, `process.env.npm_config_stub` will be set to true. In our vue app, there is a command for serving the app in `package.json`:

```bash
npm run serve
```

^^ this one sets `npm_config_stub` to false, so the app will run without stubs

```bash
npm run serve --stub
```

^^ and this one with stubs.

### Dos

* You can reuse any logic from a real implementation in your stub by creating the stub based on the real code. In this example, you can see that the real implementation is not completely overrided by the stub, instead, it is mocking API calls based on the username and password. The advantage of this approach, is that the logic inside the real implementation can run alongside the stub, which might be important for you. Also, mocking axios is better than returning resolved promises because you might have registered an error interceptor (or any other interceptor) which you would like to see running too.

```js
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { Override } from './di';
import AuthService, { AUTH_SERVICE_ID } from './auth.js'; // always use '.js' extension otherwise this module will be required.

export { AUTH_SERVICE_ID };

@Override(AUTH_SERVICE_ID)
export default class AuthServiceStub extends AuthService {
  login (username, password) {
    const axiosMock = new AxiosMockAdapter(axios);
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

## Mocking store (Vuex)

### Mocking store for a smart component

Usually smart components use a store to access and to update the application state. This brings dependencies and coupling which should be mocked out during the test. Unfortunately, that's not easy to do because a component's logic often depends on a logic in the store. If you want to mock it, then your mock will end up with duplicated logic.

To keep things DRY, it's easier to test smart component with real store implementation (real actions, mutations and getters). If your actions are calling back-end API (they often do), this should be mocked. Let's check this out in the following example.

The component below is using the store to persist a message. The message is also displayed in the title of the component, so it must be retrieved every time it changes.

```html
<template>
  <h1>{{ message }}</h1>
  <input type="text" v-model="newMessage">
</template>
```

```js
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
class MyComponent extends Vue {
  @State("message") message;

  get newMessage() {
    return this.message;
  }

  set newMessage(value) {
    this.$store.dispatch('updateMessage', { message: value });
  }
}
```

The store is defined as follows:

```js
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

export default new Store({
  state: {
    message: 'Welcome'
  },
  actions: {
    updateMessage({ commit }, payload) {
      commit('updateMessage', payload);
    }
  },
  mutations: {
    updateMessage(state, { message }) {
      state.message = message || '';
    }
  }
});
```

What needs to be tested in the component?

```js
describe('MyComponent', function () {
  it('should display the default Welcome message in the title'); // A
  it('should fill the default Welcome message into the input'); // B
  describe('when a user types new message', function () {
    it('should store new message in the store'); // C
    it('should update the title with the new message'); // D
  });
});
```

Let's give a shot to the mocked store:

```js
import { mount } from '@vue/test-utils';

beforeEach(function () {
  let actions = this.actions = {
    updateMessage: sinon.stub()
  };

  this.store = new Store({
    state: { message: 'Welcome' },
    actions
  });

  this.myComponent = mount(MyComponent, { store: this.store });
});
```

Testing cases `A` and `B` is easy, we just need to check what has been rendered. Testing C can be achieved by checking `expect(this.actions.updateMessage).to.have.been.calledWith('updateMessage', { message: 'newValue' })`. What about the case `D`? We have an option to drop it because we tested that the component is able to read from a store (in `A` and `B`) and fires an action on update (in `C`). This is considered as true unit test approach and it might be enough, on the other hand, tests never test it as a whole (they are covering the scenario but only indirectly). Wouldn't it be better to actually test the real behavior of the component: `When an user types something, it should update the title immediately`? It will give us much more confidence that our component behaves as intended. Okay, let's modify the `updateMessage` stub and do the following:

```js
beforeEach(function () {
  let actions = this.actions = {
    updateMessage: sinon.stub().callsFake((context, { message }) => {
      this.store.state.message = message; // we don't have mutations available, let's modify the state directly in action.
    });
  };
});
```

Problem solved but we basically copied the logic from the store in our test. This solution doesn't scale well for large applications. Imagine doing this with much more complex component and store. Imagine if two or more smart components need the same part of the store. Are we going to repeat the same set up again and again? Let's find a better way on how to reuse existing store and don't repeat the logic. A naive approach would be to just try to import the store, right?

```js
import { mount } from '@vue/test-utils';
import store from './store';

beforeEach(function () {
  this.myComponent = mount(MyComponent, { store }); // please don't
});
```

This causes a problem that the state is shared between all tests. If the first test changes `message` to something, then the second test will be affected by the changes made. That's going against the idea that every test should start from the same position (from scratch), unaffected by the previous test. We need to create a factory which can give us brand new instance every time we need.

```js
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Store({
    state: {/* state props */ },
    actions: { /* all actions */ },
    mutations: { /* all mutations */ }
  });
}
```

```js
import { mount } from '@vue/test-utils';
import { createStore } from './store';

beforeEach(function () {
  this.myComponent = mount(MyComponent, { store: createStore() }); // fresh instance in every test
});
```

We can even tweak the factory and pass the Vue as a parameter, so we can use [localVue](https://vue-test-utils.vuejs.org/en/guides/common-tips.html#applying-global-plugins-and-mixins) in our tests and real Vue in prod build.

```js
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

export function createStore(vueInstance = Vue) {
  vueInstance.use(Vuex);

  return new Store({
    state: {/* state props */ },
    actions: { /* all actions */ },
    mutations: { /* all mutations */ }
  });
}
```

```js
import { mount, createLocalVue } from '@vue/test-utils';
import { createStore } from './store';

beforeEach(function () {
  let localVue = createLocalVue();
  this.myComponent = mount(MyComponent, { localVue, store: createStore(localVue) }); // fresh instance in every test
});
```

If you have a store which uses modules, we need to create the same factory for each module, otherwise the state from modules will be reused by all tests.

```js
// module.js
export function createModule() {
  return {
    state: {/* state props */ },
    actions: { /* all actions */ },
    mutations: { /* all mutations */ }
  }
}
```

```js
// store.js
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import { createModule } from './module';

export function createStore(vueInstance = Vue) {
  vueInstance.use(Vuex);

  return new Store({
    namespaced: true,
    state: {/* state props */ },
    actions: { /* all actions */ },
    mutations: { /* all mutations */ },
    modules: {
      myModule: createModule()
    }
  });
}
```

### Mocking store for router

If the smart component is also using a router, it is very likely that the router needs access to the store too (usually in navigation guards). How can we give the store instance to the router? It can't be just imported because the store is created in `beforeEach`, but it can be given via Dependency Injection:

```js
import container from './di';
import { createStore, STORE_ID } from './store';

beforeEach(function () {
  this.localVue = createLocalVue();
  this.store = createStore(this.localVue);
  container.bind(STORE_ID).toConstantValue(this.store);
});
```

Now anywhere in your code `container.get(STORE_ID)` will receive the current store instance created in test set up.

```js
import { STORE_ID } from './store';

export default new VueRouter({
  routes: [
    {
      path: '/logout',
      name: 'logout',
      beforeEnter (to, from, next) {
        let store = container.get(STORE_ID); // will get the store from currently running test
        if (store.state.auth.token) { // can be preset by the test set up
          store.dispatch('auth/logout'); // can be spied on whether it was called or not
        }
      }
    }
  ]
});
```

### Mocking actions, mutations and getters

There is a scenario still, when using a real store might be a problem, and you would like to mock some part of it. Mocking an action can be achieved by stubbing the dispatch function provided by the store:

```js
beforeEach(function () {
  const dispatchStub = sinon.stub(this.store, ['dispatch']);
  dispatchStub.callThrough(); // allow other actions to be executed
  dispatchStub.withArgs('auth/login').resolves(42); // only if dispatch has been invoked for 'auth/login' then return resolved Promise with custom result
});

it('should do something', function () {
  let result = this.store.dispatch('something');
  expect(result).to.become(/* original call result */);

  result = this.store.dispatch('auth/login');
  expect(result).to.become(42);
});
```

Mutations are similar to actions, but instead of dispatch, we are going to stub commit:

```js
beforeEach(function () {
  const commitStub = sinon.stub(this.store, ['commit']);
  commitStub.callThrough(); // allow other mutations to be executed
  commitStub.withArgs('setToken').callsFake(x => x);
});

it('should do something', function () {
  let result = this.store.commit('something');
  expect(result).to.become(/* original call result */);

  result = this.store.commit('setToken', 'random_token');
  expect(result).to.equal('random_token');
});
```

Getters are a little bit tougher and they completely resist any attempt to override them. Getters are unfortunately configured as non-configurable when the store is created. That means attempts like these won't help us:

```js
beforeEach(function () {
  this.store.getters.isAuthenticated = sinon.stub(); // throws an Error

  Object.defineProperty(this.store.getters, 'isAuthenticated', {
    get() {
      return sinon.stub();
    }
  }); // throws an Error

  Reflect.defineProperty(this.store.getters, 'isAuthenticated', {
    get() {
      return sinon.stub();
    }
  }); // returns false, which means it wasn't successful
});
```

It's not over yet, the `getters` property is not protected, that means we can replaced whole `getters` with mock which we can control over. We can use [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) as a man-in-the-middle which will return a mocked getter (or the original one, it depends on the configuration):

```js
beforeEach(function () {
  const isAuthenticatedStub = sinon.stub().returns(true);

  const proxy = new Proxy(this.store.getters, {
    get(getters, key) {
      if (key === 'isAuthenticated') {
        return isAuthenticatedStub();
      } else {
        return getters[key];
      }
    }
  });

  Object.defineProperty(this.store, 'getters', {
    get() {
      return proxy;
    }
  });
});
```

That's a lot of code for mocking only one getter so it would be better to extract it as a helper method or attach it to the `Store.prototype`. in addition, We can make the name and the stub as a parameter so the function becomes more generic:

```js
import { Store } from 'vuex';

Store.prototype.mockGetter = function (name, stub) {
  const store = this;
  const mockedGetters = store.__mockedGetters = store.__mockedGetters || new Map();

  mockedGetters.set(name, stub);

  const gettersProxy = new Proxy(store.getters, {
    get (getters, propName) {
      if (mockedGetters.has(propName)) {
        return mockedGetters.get(propName).call(store);
      } else {
        return getters[propName];
      }
    }
  });

  Object.defineProperty(store, 'getters', {
    get () {
      return gettersProxy;
    }
  });
};
```

Then we can call in the test:

```js
beforeEach(function () {
  const isAuthenticatedStub = sinon.stub().returns(true);
  this.store.mockGetter('isAuthenticated', isAuthenticatedStub);
});
```

You can see the full implementation (including restoring the mock back to the original functionality) in [test/unit/utils/store.js](./test/unit/utils/store.js) file.

### Setting up initial state in tests

Let's say we need our store to start with different initial state than is specified in application's code. E.g. a store which holds information about what is the type of current user:

```js
// store.js
export default {
  state: {
    isVip: false
  }
}
```

The problems starts when we want to test a component which uses the flag from store to determine what should be displayed:

```html
<template>
  <section>
    <h1 v-if="isVip" style="color: gold;" key="welcome-message">Welcome oh mighty user</h1>
    <h1 v-else style="color: gray;" key="welcome-message">Welcome</h1>
  </section>
  <!-- SIDE NOTE: check out https://vuejs.org/v2/style-guide/#v-if-v-if-else-v-else-without-key-use-with-caution to understand why both h1 tags have the key property assigned -->
</template>
```

```js
class MyComponent extends Vue {
  get isVip() {
    return this.$store.state.isVip; // or map it using mapState or @State decorator
  }
}
```

In test, we need to change the initial state before each test. We have two options how to do that:

#### Using existing mutations to change initial state

```js
describe('when user is VIP', function () {
  beforeEach(function () {
    this.store = createStore();
    this.store.commit('setVip', true); // setVip mutation must exist
  });

  it('should display warming welcome message');
});

describe('when user is non-VIP', function () {
  beforeEach(function () {
    this.store = createStore();
    this.store.commit('setVip', false); // setVip mutation must exist
  });

  it('should display generic welcome message');
});
```

#### Modifying the state directly

```js
describe('when user is VIP', function () {
  beforeEach(function () {
    this.store = createStore();
    this.store.state.isVip = true; // no mutation required
  });

  it('should display warming welcome message');
});

describe('when user is non-VIP', function () {
  beforeEach(function () {
    this.store = createStore();
    this.store.state.isVip = false; // no mutation required
  });

  it('should display generic welcome message');
});
```

There is no winner in this competition, both approaches does the work, it's up to you which one do you prefer. Few notes to consider:

The first approach uses existing functionality, that means if the logic in mutation changes, then you have to update the tests. It also might seem a little less readable or intuitive.

The second approach doesn't require mutation to be defined (might be useful when an application doesn't need it, don't write a mutation only for using it in tests). You must be always careful with setting only properties already existing in the store. All properties of the `state` object are [reactive](https://vuejs.org/v2/guide/reactivity.html), that means every time a new value is assigned to them, the components using the property get re-rendered and updated. If you introduce new properties during the test, components will not be aware of them, unless you use `Vue.set()` method. See the next example:

```js
// store.js
export function createStore() {
  return new Store({
    state: {
      profile: null // profile prop is converted to reactive prop (has getter/setter), if component uses this prop, every time we set new value, the component gets updated
    }
  });
}

// spec.js
// !warning: this is wrong!
describe('when user has profile loaded', function () {
  beforeEach(function () {
    this.store = createStore();
    this.store.state.profile = {
      username: 'john.doe'
    }; // Vue will see that the new value in profile is an object so it will make also the nested property username reactive
    // changing property username will force the component to update

    // the following code introduces new properties on the profile object, Vue cannot detect this, so they will never get converted into reactive prop.
    this.store.state.profile.firstName = 'John'; // please don't
    this.store.state.profile.lastName = 'Doe'; // same problem here

    this.myComponent = mount(MyComponent, { store: this.store })
  });

  it('should display full name and username in the welcome message', function () {
    expect(this.myComponent.find('h1').text()).to.equal('Welcome John Doe (john.doe)'); // fail, because the text is Welcome (john.doe)
  });
});
// !warning: this is wrong!
```

If you try to use `firstName` or `lastName` in the template, you will only get undefined values, because these values were not reactified by the Vue. Vue cannot detect new or deleted properties, see [caveats of reactivity](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats). However you can use `Vue.set()` to fix the problem:

```js
beforeEach(function () {
  // ...
  Vue.set(this.store.state.profile, 'firstName', 'John');
  Vue.set(this.store.state.profile, 'lastName', 'Doe');
  // ...
});
```

And everything works fine again.

## Testing v-model

Let's test a custom component with `v-model` support, e.g. like this one:

```html
<div class="c-checkbox">
  <input type="checkbox" v-model="checkboxModel" hidden :id="id">
  <span class="c-checkbox__icon" @click="toggle()"
        :class="{ 'c-checkbox__icon--checked': isChecked, 'c-checkbox__icon--unchecked': !isChecked }"></span>
  <label :for="id"><slot></slot></label>
</div>
```

```js
import Vue from 'vue';
import { Component, Model, Prop } from 'vue-property-decorator';
import uniqueId from 'lodash/uniqueId';

@Component
export default class MyCheckbox extends Vue {
  @Model('change') @Prop(Boolean) value;

  id = uniqueId('my-checkbox-');

  get checkboxModel () {
    return this.value;
  }

  set checkboxModel (value) {
    this.$emit('change', value);
  }

  get isChecked () {
    return !!this.checkboxModel;
  }

  toggle () {
    this.checkboxModel = !this.checkboxModel;
  }
}
```

We can use this component in any form:

```html
<my-checkbox v-model="value"></my-checkbox>
```

If the component doesn't have `v-model` we can do all test just using `mount(MyCheckbox, { ... })`, but unfortunately, the component supports `v-model` and there is no way how model can be passed to the `mount()`. What we have to do is to create another component which uses the component under the test inside its template. The wrapper can also provide a value which will be passed to the v-model and which will be updated:

```js
beforeEach(function () {
  let Wrapper = Vue.extend({
    components: { MyCheckbox },
    data () {
      return { value: false };
    },
    template: `<my-checkbox v-model="value"></my-checkbox>` // if you don't have VUE with compiler, use compileToFunctions helper
  });

  this.wrapper = mount(Wrapper);
});

it('should change the value', function () {
  expect(this.wrapper.vm.value).to.be.false; // do not check for vm values in your tests, but rather check the state of your component in DOM. this is just for demo purpose.
  wrapper.trigger('click');
  expect(this.wrapper.vm.value).to.be.true;
  wrapper.trigger('click');
  expect(this.wrapper.vm.value).to.be.false;
});
```

## Using flush-promises vs Vue.nextTick()

This topic has been fully covered by [the official documentation](https://vue-test-utils.vuejs.org/en/guides/testing-async-components.html).

## Testing navigation guards

Unfortunately, there is no easy way how to test navigation guards. If you want to simulate the event triggering by calling `router.push` function, you are going to have a hard time. ~~Better~~ Easier solution is to call the guard manually in `beforeEach()`, but even this solution doesn't have clean approach. See following examples:

### beforeRouteEnter

```js
// my-view.js
class MyView extends Vue {
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      vm.entered = true;
    });
  }
}
```

```js
// my-view.spec.js
it('should trigger beforeRouteEnter event', function () {
  let view = mount(MyView);
  let spy = sinon.spy(view.vm.$options.beforeRouteEnter, '0'); // you cannot just call view.vm.beforeRouteEnter(). The function exists only in $options object.

  let from = {}; // mock 'from' route
  let to = {}; // mock 'to' route
  view.vm.$options.beforeRouteEnter[0](to, from, cb => cb(view.vm));

  expect(view.vm.entered).to.be.true;
  expect(spy).to.have.been.called;
});
```

In case you are wondering how to do the same thing using `router.push`, so you don't have to mock routes and callback function, this is the way:

```js
it('should trigger beforeRouteEnter event', function () {
  let view = mount(MyView);
  let spy = sinon.spy(view.vm.$options.beforeRouteEnter, '0'); // beforeRouteEnter is an array of callback functions

  // at this moment, this.route.currentRoute doesn't exist. We need to push route we want to have in the $route object inside out view
  this.router.push({ name: 'my-route' });

  // now the route exists, but, because it's not resolved (committed) yet, the route is not aware of the view. we need to assign the mounted view to the instances
  this.router.currentRoute.matched[0].instances.default = view.vm;
  // now we will finally execute the life cycle of the router, which will go through global event, then it will check if default instance on matched route exist and if so, it will call the beforeRouteEnter event on it.
  await flushPromises();

  expect(view.vm.entered).to.be.true;
  expect(spy).to.have.been.called;
});
```

This approach requires a knowledge about VUE and router internals and **can stop working** after every minor refactoring done by the VUE team. I do not recommend to use it unless guys from VUE provide some helper function in [@vue/test-utils](https://github.com/vuejs/vue-test-utils) library for setting it up using cleaner way.

## Testing provide/inject

_NOTE_: Before you even start developing your components using `provide`/`inject`, please consider if you really need them. It is mentioned in [the official documentation](https://vuejs.org/v2/api/#provide-inject) that this feature is suitable only for certain scenarios. Also consider that both, `provide` and `inject` and not [reactive](https://vuejs.org/v2/guide/reactivity.html#ad), which only introduces limitation to the development that you have to keep in mind. Using "traditional" [one-way data flow](https://vuejs.org/v2/guide/components-props.html#One-Way-Data-Flow) between components may be more appropriate for your use case.

For the testing purposes, let's have three components which communicate using `provide`/`inject`:

```html
<my-checkbox-list>
  <my-checkbox-list-status></my-checkbox-list-status>
  <my-checkbox v-model="value1">Checkbox 1</my-checkbox>
  <my-checkbox v-model="value2">Checkbox 2</my-checkbox>
  <my-checkbox v-model="value3">Checkbox 3</my-checkbox>
</my-checkbox-list>
```

... where `my-checkbox-list` is a wrapper providing an API for `my-checkbox`es to tell the list they are checked or not, and the `my-checkbox-list-status` is a component for displaying nice message to the user how many checkboxes have already been checked, e.g. `"2 out of 3 item(s) have been selected."`

### Testing component that injects values

For a component that only injects values we can use [provide option](https://vue-test-utils.vuejs.org/api/options.html#provide) for `mount` function:

```js
beforeEach(function () {
  this.mountMyCheckboxListStatus = function (myCheckboxListMock, options) {
    let provide = { "checkboxList": myCheckboxListMock };
    let wrapper = mount(MyCheckboxListStatus, { provide, ...options });
    return new MyCheckboxListStatusPageObj(wrapper);
  };
});

it('should render the message', function () {
  let myCheckboxListMock = { numberOfItems: 6, numberOfSelectedItems: 3 };
  let myCheckboxListStatus = this.mountCheckboxListStatus(myCheckboxListMock);
  expect(myCheckboxListStatus.message).to.equal("3 out of 6 item(s) have been selected");
});
```

### Testing component that provides values

For a component that provides values is better to use integration tests and test all of their interactions together.

```js
beforeEach(function () {
  this.mountMyCheckboxList = function (template, options) {
    // we are going to mount a string template, thus we need to convert it into something that Vue can understand:
    let Wrapper = Vue.extend({
      ...compileToFunctions(template),
      components: { MyCheckboxList, MyCheckbox, MyCheckboxListStatus }
    });

    let wrapper = mount(Wrapper, { ...options });
    return new MyCheckboxListPageObj(wrapper);
  };
});

describe('when there are checkboxes in the list', function () {
  beforeEach(function () {
    // instead of testing individual components, create a template with all of them
    this.myCheckboxList = this.mountMyCheckboxList(
      `<my-checkbox-list>
        <my-checkbox-list-status></my-checkbox-list-status>
        <my-checkbox v-model="checkbox1">Checkbox 1</my-checkbox>
      </my-checkbox-list>`,
      {
        data () {
          return { checkbox1: false };
        }
      }
    );
  });

  it('should render the checkbox list status', function () {
    // test the initial status of the my-checkbox-list-status component
    expect(this.myCheckboxList.status.text()).to.equal('You selected 0 item(s).');
  });

  it('should render checkboxes', function () {
    // test the initial status of the my-checkbox component
    expect(this.myCheckboxList.checkboxes.length).to.equal(1);
    expect(this.myCheckboxList.checkboxes[0].isChecked).to.be.false;
  });

  describe('and the user changes the checkbox value', function () {
    beforeEach(function () {
      // clicking the my-checkbox should trigger the provide API in the parent my-checkbox-list.
      this.myCheckboxList.checkboxes[0].check();
      return Vue.nextTick();
    });

    it('should update the message in the checkbox list status', function () {
      // the change in the parent should appear in the my-checkbox-list-status component
      expect(this.myCheckboxList.status.text()).to.equal('You selected 1 item(s).');
    });
  });
});
```
