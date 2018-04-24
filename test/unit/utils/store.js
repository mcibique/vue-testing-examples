import { Store } from 'vuex';

Store.prototype.mockGetter = function (name, stub) {
  if (!name) {
    throw new Error('Getter name must be specified');
  }

  if (!stub) {
    throw new Error('Missing stub function');
  }

  if (typeof stub !== 'function') {
    throw new Error('Stub must be a function');
  }

  let store = this;
  let mockedGetters = store.__mockedGetters = store.__mockedGetters || new Map();

  if (mockedGetters.has(name)) {
    throw new Error(`Cannot mock getter with the name '${name}' twice. Restore the getter or call stub.reset() instead.`);
  }

  mockedGetters.set(name, stub);

  let gettersProxy = store.__gettersProxy;
  if (!gettersProxy) {
    store.__gettersProxy = gettersProxy = new Proxy(store.getters, {
      get (getters, propName) {
        if (mockedGetters.has(propName)) {
          return mockedGetters.get(propName).call(store);
        } else {
          return getters[propName];
        }
      }
    });

    store.__originalGetters = store.getters;
    Object.defineProperty(store, 'getters', {
      get () {
        return gettersProxy;
      }
    });
  }

  return {
    restore () {
      mockedGetters.delete(name);
    }
  };
};

Store.prototype.restore = function () {
  let store = this;

  if (store.__originalGetters) {
    let getters = store.__originalGetters;
    Object.defineProperty(store, 'getters', {
      get () {
        return getters;
      }
    });
  }

  delete store.__mockedGetters;
  delete store.__gettersProxy;
  delete store.__originalGetters;
};
