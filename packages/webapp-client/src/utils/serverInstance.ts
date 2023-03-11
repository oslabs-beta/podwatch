import axios, { AxiosRequestConfig } from 'axios';

const serverInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001',
  timeout: 5000,
  withCredentials: true,
});

export const serverFetcher = async (
  url: string,
  config: AxiosRequestConfig<any> | undefined
) => {
  const { data } = await serverInstance.get(url, config);
  return data;
};

export default serverInstance;
