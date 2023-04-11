import React from 'react';
import { createRoot, ReactDOM } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import Web3 from 'ethers';
import { createMemoryHistory } from 'history';
import renderer from 'react-test-renderer'
// Mock the window.ethereum object


window.ethereum = {
  request: jest.fn().mockResolvedValue(undefined),
};

jest.mock('ethers', () => {
  const ethers = jest.requireActual('ethers');
  const signer = {
    getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890')
  };
  const provider = {
    getSigner: jest.fn(() => signer)
  };
  return {
    ...ethers,
    providers: {
      ...ethers.providers,
      Web3Provider: jest.fn(() => provider)
    }
  };
});

describe('App component', () => {
  let history = null;
  beforeEach(() => {
    // Clear the mock calls and reset the mock implementation for each test
    history = createMemoryHistory({ initialEntries: ["/"] });
    jest.clearAllMocks();
  });
  it('renders app component', () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const component = renderer.create(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  });
});
