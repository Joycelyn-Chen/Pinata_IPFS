import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Profile from './Profile';
import renderer from "react-test-renderer";
import { MemoryRouter, Router } from 'react-router-dom';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

describe('Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the component without errors', () => {
    // render(<Profile />);
    const component = renderer.create(
        <Router location={history.location} navigator={history}>
        <Profile />
      </Router>
    );
  });

  it('should fetch NFT data and update state when mounted', async () => {
    const mockTokenId = '123';
    const mockData = [
      {
        tokenId: 1,
        seller: '0x111',
        owner: '0x222',
        image: 'https://example.com/image.png',
        name: 'NFT Name',
        description: 'NFT Description',
        price: '1000000000000000000' // 1 ETH
      },
      {
        tokenId: 2,
        seller: '0x333',
        owner: '0x444',
        image: 'https://example.com/image2.png',
        name: 'NFT Name 2',
        description: 'NFT Description 2',
        price: '500000000000000000' // 0.5 ETH
      }
    ];

    const mockGetAddress = jest.fn(() => Promise.resolve('0x555'));
    const mockGetMyNFTs = jest.fn(() => Promise.resolve(mockData));

    // Mock useParams hook to return the mock token ID
    useParams.mockReturnValue({ tokenId: mockTokenId });

    // Mock ethers.js library
    jest.mock('ethers', () => ({
      ...jest.requireActual('ethers'),
      providers: {
        Web3Provider: jest.fn(() => ({
          getSigner: jest.fn(() => ({
            getAddress: mockGetAddress
          }))
        }))
      },
      Contract: jest.fn(() => ({
        getMyNFTs: mockGetMyNFTs,
        tokenURI: jest.fn(() => Promise.resolve('https://example.com/tokenURI'))
      })),
      utils: {
        formatUnits: jest.fn((value, unit) => value / Math.pow(10, unit))
      }
    }));

    // Mock axios to return mock data
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData[0] }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockData[1] }));

    render(<Profile />);

    // Check that state is updated correctly
    await screen.findByText(`Total Price: ${mockData.reduce((sum, item) => sum + Number(item.price) / Math.pow(10, 18), 0).toFixed(3)} ETH`);
    expect(mockGetAddress).toHaveBeenCalled();
    expect(mockGetMyNFTs).toHaveBeenCalled();
    expect(screen.getByText(mockData[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockData[1].name)).toBeInTheDocument();
  });
});
