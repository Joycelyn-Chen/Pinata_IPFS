const { uploadJSONToIPFS, uploadFileToIPFS } = require('./pinata.js');
const fs = require('fs');
const path = require('path');
import image from './test-image.jpg';
const { File } = require('node:fs');
const axios = require('axios');
const FormData = require('form-data');

jest.mock('axios');
jest.mock('form-data');
describe('File upload tests', () => {
  describe('uploadFileToIPFS', () => {
    it('should upload a file to IPFS and return a success message', async () => {
        const file = new Blob(['test'], { type: 'text/plain' })
        file.name = 'test.txt'
        file.lastModifiedDate = new Date()
      
        const uploadResult = {
          success: true,
          pinataURL: 'https://gateway.pinata.cloud/ipfs/abcdefg'
        }
      
        axios.post.mockResolvedValueOnce({ data: { IpfsHash: 'abcdefg' } })
      
        const result = await uploadFileToIPFS(file)
      
        expect(axios.post).toHaveBeenCalledTimes(1)
        expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(FormData), expect.any(Object))
        expect(result).toEqual(uploadResult)
    });

    it('should return an error message when given an unsupported file type', async () => {
        const file = new Blob(['test'], { type: 'text/plain' })
        file.name = 'test.txt'
        file.lastModifiedDate = new Date()
        axios.post.mockRejectedValueOnce({message:"415 Unsupported Media Type"})
        
          const result = await uploadFileToIPFS(file)
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/415 Unsupported Media Type/);
    });
  });
  describe('uploadJSONToIPFS', () => {
   
    beforeAll(()=>{
        jest.resetAllMocks();
    })
    it('should upload a JSON object to IPFS and return a success message', async () => {
      const json = { "test": "test value" };
     
      axios.post.mockResolvedValueOnce({ data: { IpfsHash: 'abcdefg' } })
      const uploadResult = {
        success: true,
        pinataURL: 'https://gateway.pinata.cloud/ipfs/abcdefg'
      }
      
      const result = await uploadJSONToIPFS(json);
      expect(result.success).toBe(true);
      expect(result.pinataURL).toEqual(uploadResult.pinataURL);
    });

    it('should return an error message when given invalid credentials', async () => {
      const json = { "test": "test value" };
      
      axios.post.mockRejectedValueOnce({message:"Request failed with status code 400"})
      const result = await uploadJSONToIPFS(json, "invalid_key", "invalid_secret");
      expect(result.success).toBe(false);
      expect(result.message).toMatch("Request failed with status code 400");
    });
  });
});