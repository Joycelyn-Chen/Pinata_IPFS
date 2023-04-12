import { render, screen, act } from "@testing-library/react";
import NFTPage from "./NFTpage"
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import renderer from "react-test-renderer"

import axios from "axios";
import { useSnackbar } from 'notistack';
import { useState as useStateMock } from "react";
import { useParams as useParamsMock } from "react-router-dom";
import React from 'react';
// import {useLocation } from 'react-router';
// import NFTPage from "/Users/joycelynchen/Desktop/UBC/2023S/COSC_490_seminar/Final_Project/Pinata_IPFS/src/components/NFTpage.js";

// jest.mock("axios");
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

jest.mock("notistack");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

// jest.mock('axios', () => ({
//     get: jest.fn(() =>
//       Promise.resolve({
//         data: {
//           name: 'NFT#1',
//           description: 'Cute Dog',
//           image: 'https://gateway.pinata.cloud/ipfs/QmTcQR1wMsnxakNikzePPJee77NxDtuRBkzvWeHva9vmfq',
//         },
//       })
//     ),
//   }));
  
jest.mock("react-router-dom", () =>({
    ...jest.requireActual('react-router'),
    useLocation: jest.fn().mockReturnValue({
        pathname: '',
        search: '',
        hash: '',
        state: {}
    })
}));

// jest.mock('react-router', () => ({
//     ...jest.requireActual("react-router"),
//        useLocation: jest.fn().mockImplementation(() => {
//         return { pathname: "/testroute" };
//        })
//     }));


  describe('NFTPage', () => {
    let history = null;
    beforeEach(()=>{
      history = createMemoryHistory({ initialEntries: ["/"] });
    })
    test('renders title', () => {
      
       const component = renderer.create(
          <Router location={history.location} navigator={history}>
          <NFTPage />
        </Router>
      );
    //   let tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
    expect(location.pathname).toBe('');
      
    });


  
  });

// describe("NFTPage", () => {
//     let enqueueSnackbarMock;

//     beforeEach(() => {
//         enqueueSnackbarMock = jest.fn();
//         useSnackbar.mockReturnValue({ enqueueSnackbar: enqueueSnackbarMock });
//         useStateMock.mockReturnValue([
//         {
//             price: "1",
//             tokenId: "123",
//             seller: "seller",
//             owner: "owner",
//             image: "image",
//             name: "name",
//             description: "description",
//         },
//         jest.fn(),
//         ]);
//         useParamsMock.mockReturnValue({ tokenId: "123" });
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     test.only('renders the correct pathname', () => {
//         // render(
//         //     <Router history={history}>
//         //         <NFTPage />
//         //     </Router>
//         // );
//         //const history = createMemoryHistory({ initialEntries: ["/"]});
//         const component = renderer.create(
//             <Router location = {history.location} navigator={history}>
//                 <NFTPage/>
//             </Router>
//         );
//         expect(useLocation().pathname).toBe('/example');
//       });

//     it('renders without crashing', () => {
//         render(<NFTPage />);
//         const linkElement = screen.getByText(/NFT Page/i);
//         expect(linkElement).toBeInTheDocument();
//       });
        

//         it("should render the NFT data", async () => {
//             axios.get.mockResolvedValue({
//             data: {
//                 price: "1",
//                 image: "image",
//                 name: "name",
//                 description: "description",
//             },
//             });

//             await act(async () => {
//             render(<NFTPage />);
//             });

//             expect(screen.getByText(/name/i)).toBeInTheDocument();
//             expect(screen.getByText(/description/i)).toBeInTheDocument();
//             expect(screen.getByText(/1/i)).toBeInTheDocument();
//         });

//         it("should show an error message if there is an error fetching the NFT data", async () => {
//             axios.get.mockRejectedValue(new Error("Error fetching data"));

//             await act(async () => {
//             render(<NFTPage />);
//             });

//             expect(enqueueSnackbarMock).toHaveBeenCalledWith("Upload Error Error: Error fetching data", { autoHideDuration: 3000 });
//         });

//         it("should call the buyNFT function when the 'Buy' button is clicked", async () => {
//             axios.get.mockResolvedValue({
//             data: {
//                 price: "1",
//                 image: "image",
//                 name: "name",
//                 description: "description",
//             },
//             });
//             window.ethereum = {
//             enable: jest.fn(),
//             };

//             await act(async () => {
//             render(<NFTPage />);
//             });

//             const buyButton = screen.getByRole("button", { name: /buy/i });
//             await act(async () => {
//             buyButton.click();
//             });

//             expect(enqueueSnackbarMock).toHaveBeenCalledWith("You successfully bought the NFT!", { autoHideDuration: 3000 });
//         });
// });