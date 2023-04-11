import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Router } from "react-router-dom";
import Navbar from './Navbar';
import { createMemoryHistory } from 'history';
import renderer from 'react-test-renderer'
window.ethereum = {
    isMetaMask: true,
    providers: [{
      isMetaMask: true
    }],
    isConnected: jest.fn().mockImplementation(() => true),
    on: jest.fn()
  };

describe("Navbar tests",()=>{
    beforeEach(() => {
        window.ethereum = {
          isConnected: jest.fn().mockReturnValue(true),
          request: jest.fn().mockResolvedValueOnce('0x5')
        }
          // Other mock properties go here
        });
test('renders Navbar component', () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const component = renderer.create(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  
});
});