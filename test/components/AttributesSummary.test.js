import React from 'react';
import { Text } from 'react-native';
import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Button from '../../application/components/Button/Button';
import AttributesSummary from '../../screens/AttributesSummary';


Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);

describe('The AttributesSummary page', () => {
  const somePetitionLink = 'http://some-petition.com';
  const goToPetitionSummaryMock = jest.fn();
  // const openWebBroswerAsyncMock = jest.fn();

  // GIVEN A PETITION
  const initialState = {
    petitionLink: {
      petitionLink: 'http://something.com',
    },
    petition: {
      petition: {
      },
    },
    attributes: {
      isRequiredAttributeEnabled: false,
      optionalAttributesToggleStatus: {
        age: false,
        gender: false,
      },
      list: [],
    },
    wallet: {
      id: 'something',
    },
  };

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should show the verify with barcelona button', () => {
    const store = mockStore(initialState);

    // WHEN I VISUALIZE THE Attribute Summary
    const wrapper = shallow(
      <AttributesSummary />,
      { context: { store } },
    );

    const buttonWrapper = wrapper.dive().find(Button);

    // Only one button
    expect(buttonWrapper).toHaveLength(1);
    expect(buttonWrapper.prop('name')).toEqual('Verify with Barcelona Council');
    expect(buttonWrapper.first().prop('enabled')).toEqual(true);
  });

  it('should show the title of the petition', () => {
    const title = 'Petition Title';
    const state = {
      ...initialState,
      petition: {
        petition: {
          title,
          description: 'world',
          closingDate: 'today',
          id: '1234',
        },
      },
    };
    const store = mockStore(state);

    // WHEN I VISUALIZE THE Attribute Summary
    const wrapper = shallow(
      <AttributesSummary />,
      { context: { store } },
    );

    const TextWrappers = wrapper.dive().find(Text).findWhere(n => n.text() === title);
    expect(TextWrappers).toHaveLength(1);
  });

  describe('when the verify button is pressed', () => {
    xit('should go to credential issuer', () => {
      const wrapper = shallow(
        <AttributesSummary />,
        { context: { store: mockStore(initialState) } },
      );

      // wrapper.dive().find(Button).first().simulate('click');

      const spy = jest.spyOn(wrapper.instance(), 'openWebBrowserAsync');
      wrapper.update();
      wrapper.find(Button).simulate('click');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('on redirect from credential issuer', () => {
    xit('should go to petitionSummary page', () => {
      const wrapper = shallow(
        <AttributesSummary />,
        { context: { store: mockStore(initialState) } },
      );

      const attributesSummaryComponent = wrapper.dive().instance();
      attributesSummaryComponent.props = {
        ...attributesSummaryComponent.props,
        goToPetitionSummary: goToPetitionSummaryMock,
      };

      wrapper.dive().find(Button).first().simulate('click');

      expect(goToPetitionSummaryMock).toBeCalledWith(somePetitionLink);
    });
  });

  describe('when rendered', () => {
    it('should match this snapshot', () => {
      const wrapper = shallow(
        <AttributesSummary />,
        { context: { store: mockStore(initialState) } },
      );
      expect(wrapper.dive()).toMatchSnapshot();
    });
  });
});
