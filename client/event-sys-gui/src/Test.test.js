import React from 'react';
import ReactDOM from 'react-dom';
import Test from './Test';
import jsdom from 'jsdom'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

const single_result = [
  { name: "Test Result", success: true }
]

const many_results = [
  { name: "Test Result", success: true },
  { name: "Test Result", success: true },
  { name: "Test Result", success: false },
  { name: "Test Result", success: true }
]

Enzyme.configure({ adapter: new Adapter() })

it('Renders Test Without Crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Test />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Displays 1 Result', () => {
  const div = document.createElement('div');
  let wrapper = mount(<Test results={single_result} />)
  let results = wrapper.find('.test-results > tbody > tr')
  expect(results.length).toBe(1);
});

it('Displays many Results', () => {
  const div = document.createElement('div');
  let wrapper = mount(<Test results={many_results} />)
  let results = wrapper.find('.test-results > tbody > tr')
  expect(results.length).toBe(4);
});

// it('Renders Without Crashing Again', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

// it('Loads Test View', () => {
//   global.fetch = jest.fn().mockImplementation(() => ({json: () => []}) )
//   const wrapper = mount(<App test_view={true} />)
//   expect(wrapper.find("Test").length).toBe(1)
// })

// it('Test View Hidden', () => {
//   global.fetch = jest.fn().mockImplementation(() => ({json: () => []}) )
//   const wrapper = mount(<App test_view={true} />)
//   expect(wrapper.find("Test").length).toBe(1)
// })