import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import jsdom from 'jsdom'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() })

it('Renders App Without Crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Loads Test View', () => {
  global.fetch = jest.fn().mockImplementation(() => ({json: () => []}) )
  const wrapper = mount(<App test_view={true} />)
  expect(wrapper.find("Test").length).toBe(1)
})

it('Test View Hidden', () => {
  global.fetch = jest.fn().mockImplementation(() => ({json: () => []}) )
  const wrapper = mount(<App test_view={true} />)
  expect(wrapper.find("Test").length).toBe(1)
})

// Hacky forced failing test
it('Is Complete', () => {
  expect(false).toBe(true)
})