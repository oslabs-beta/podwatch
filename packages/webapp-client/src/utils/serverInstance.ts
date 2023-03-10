import axios, { AxiosRequestConfig } from 'axios';

const serverInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 2500,
});

export const serverFetcher = async (
  url: string,
  config: AxiosRequestConfig<any> | undefined
) => {
  const { data } = await serverInstance.get(url, config);
  return data;
};

export default serverInstance;
