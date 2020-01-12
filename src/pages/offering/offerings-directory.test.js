import React from 'react';
import { NonIdealState } from "@blueprintjs/core";
import { mount } from 'enzyme';
import { OfferingsDirectory } from './offerings-directory';

describe('offerings directory', () => {
  let wrapper;

  test('show messgae to search for something when app has initial state', () => {
    const myMockFn = jest
        .fn()
        .mockImplementationOnce(cb => [null])
        .mockImplementationOnce(cb => [null]);
        
    wrapper = mount(<OfferingsDirectory useGlobalState={myMockFn} />)
    expect(wrapper.containsMatchingElement(<NonIdealState />)).toEqual(true);
    expect(wrapper.text()).toContain(`Write something to search`)
  });

  test('show messgae of no values found when server response with no values', () => {
    const myMockFn = jest
    .fn()
    .mockImplementationOnce(cb => [[]])
    .mockImplementationOnce(cb => [1]);
    
    wrapper = mount(<OfferingsDirectory useGlobalState={myMockFn} />)
    expect(wrapper.containsMatchingElement(<NonIdealState />)).toEqual(true);
    expect(wrapper.text()).toContain(`Your search didn't match any files.Try searching for something else.`)
  });

  test('renders pagging component when more than 10 experts are found', () => {

  });
  
});