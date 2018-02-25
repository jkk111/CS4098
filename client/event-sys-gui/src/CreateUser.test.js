import React from 'react';
import ReactDOM from 'react-dom';
import CreateUser from './CreateUser';
import jsdom from 'jsdom';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as TestUtils from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() })

it('Renders App Without Crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CreateUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Loads Test View', () => {
  global.fetch = jest.fn().mockImplementation(() => ({json: () => []}) )
  const wrapper = mount(<CreateUser test_view={true} />)
  expect(wrapper.find("Test").length).toBe(0)
});

it('Test View Hidden', () => {
  global.fetch = jest.fn().mockImplementation(() => ({json: () => []}) )
  const wrapper = mount(<CreateUser test_view={true} />)
  expect(wrapper.find("Test").length).toBe(0)
});

it('should be defined', () => {
    expect(CreateUser).toBeDefined();
});

////it('should have 1 button', () => {
//  var div = document.createElement('div');
//  ReactDOM.render(<CreateUser />, div);
//  var DOM = TestUtils.renderIntoDocument(div);
//  var buttons = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'save');
//  expect(buttons.length).toEqual(1);
//})
