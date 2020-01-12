import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import Directory from './directory';

describe('App', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Directory />));

  test('renders no experts found', () => {
  });

  test('renders 3 experts found', () => {

  });

  test('renders pagging component when more than 10 experts are found', () => {

  });
  
});