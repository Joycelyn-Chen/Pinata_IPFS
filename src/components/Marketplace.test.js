import { render, screen } from '@testing-library/react';
import Marketplace from './Marketplace';
import { MemoryRouter, Route, Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
import renderer from 'react-test-renderer'



jest.mock('axios', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: {
        name: 'NFT#1',
        description: 'Cute Dog',
        image: 'https://gateway.pinata.cloud/ipfs/QmTcQR1wMsnxakNikzePPJee77NxDtuRBkzvWeHva9vmfq',
      },
    })
  ),
}));

describe('Marketplace', () => {
  let history = null;
  beforeEach(()=>{
    history = createMemoryHistory({ initialEntries: ["/"] });
  })
  test('renders title', () => {
    
     const component = renderer.create(
        <Router location={history.location} navigator={history}>
        <Marketplace />
      </Router>
    );
    let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
    
  });

});
