import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import Offerings from './offerings';

describe('App', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Offerings />));

  test('renders no offerings found', () => {
  });

  test('renders 3 offerings found', () => {

  });

  test('renders pagging component when more than 10 offerings are found', () => {

  });
  
});