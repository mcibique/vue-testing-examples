import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubPromise from 'sinon-stub-promise';

import './utils/axios';
import './utils/store';
import './utils/tid';

chai.use(sinonChai);
chai.use(chaiAsPromised);
sinonStubPromise(sinon);
