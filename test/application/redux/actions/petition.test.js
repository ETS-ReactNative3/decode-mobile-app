import configureMockStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';
import { getPetition, signPetition } from '../../../../application/redux/actions/petition';
import types from '../../../../application/redux/actionTypes';

const mockStore = configureMockStore([thunk]);

describe('getPetition', () => {
  const petitionLink = 'petitions';
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should dispatch successful action', () => {
    const newPetition = {
      petition: {
        id: '2',
        isEthereum: 'true',
      },
    };
    const response = newPetition;
    const expectedActions = [{
      type: types.SET_PETITION,
      petition: newPetition,
    }];

    fetchMock.getOnce(petitionLink, response);

    return store.dispatch(getPetition(petitionLink)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error action', () => {
    const errorMessage = 'Internal Server Error';

    const expectedActions = [{
      type: types.SET_PETITION_ERROR,
      error: errorMessage,
    }];

    const response = { status: 500 };

    fetchMock.getOnce(petitionLink, response);

    return store.dispatch(getPetition(petitionLink)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('signPetition', () => {
  let store;

  const petition = {
    id: 1,
    isEthereum: false,
  };
  const walletId = '1234567890';
  const walletProxyLink = 'wallet-proxy-link.com';
  const signPetitionLink = `${walletProxyLink}/sign/petitions/${petition.id}`;
  const response = {};

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should make post with correct request', () => {
    const expectedRequestBody = JSON.stringify({
      signatory: walletId.substring(0, 5),
      isEthereum: petition.isEthereum,
    });

    let actualRequestBody;

    fetchMock.postOnce((url, opts) => {
      actualRequestBody = opts.body;
      return url === signPetitionLink;
    }, response);

    return store.dispatch(signPetition(petition, walletId, walletProxyLink)).then(() => {
      expect(actualRequestBody).toEqual(expectedRequestBody);
    });
  });

  it('should dispatch successful action', () => {
    const expectedActions = [{
      type: types.SIGN_PETITION,
    }];

    fetchMock.postOnce(signPetitionLink, response);

    return store.dispatch(signPetition(petition, walletId, walletProxyLink)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error action', () => {
    const errorMessage = 'Internal Server Error';

    const expectedActions = [{
      type: types.SIGN_PETITION_ERROR,
      error: errorMessage,
    }];

    fetchMock.postOnce(signPetitionLink, { status: 500 });

    return store.dispatch(signPetition(petition, walletId, walletProxyLink)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
