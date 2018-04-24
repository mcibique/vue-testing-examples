import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubPromise from 'sinon-stub-promise';

import './utils/axios';
import './utils/store';
import './utils/tid';

chai.use(sinonChai);
sinonStubPromise(sinon);
