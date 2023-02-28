const PODWATCH_CUSTOM_SERVER_URL = process.env.PODWATCH_CUSTOM_SERVER_URL;
const PODWATCH_CLIENT_ID  = process.env.PODWATCH_CLIENT_ID ;
const PODWATCH_CLIENT_SECRET = process.env.PODWATCH_CLIENT_SECRET;

import axios, { AxiosInstance } from 'axios';

const createAxiosInstance = () => {
    //check if all 3 of the env file variables are present
    if(PODWATCH_CUSTOM_SERVER_URL && PODWATCH_CLIENT_ID && PODWATCH_CLIENT_SECRET){
        throw new Error('We have detected both a custom server URL and a PodWatch Client ID and Secret. You will need one or the other to continue.');
        process.exit(1);
    }
    //check if the podwatch custom server url exists
        else if(PODWATCH_CUSTOM_SERVER_URL){
            //need to provide our PodWatch client ID and Secret
            const instanceCustom: AxiosInstance = axios.create({
                baseURL: PODWATCH_CUSTOM_SERVER_URL,
                timeout: 1000,
                
            })
            return instanceCustom;

        } else if(PODWATCH_CLIENT_ID && PODWATCH_CLIENT_SECRET) {
            const instancePodWatch: AxiosInstance = axios.create({
                baseURL: 'http://localhost:3001/watch',
                timeout: 1000,
                headers: {
                    clientId: PODWATCH_CLIENT_ID,
                    clientSecret: PODWATCH_CLIENT_SECRET,
                }
            })
            return instancePodWatch;
        }
        else if(!PODWATCH_CUSTOM_SERVER_URL || !PODWATCH_CLIENT_ID || !PODWATCH_CLIENT_SECRET) {
            throw new Error('Your Custom Server URL, PodWatch Client ID and/or Secret are blank. Please review and try again.');
            process.exit(1);
        }
        else {
            throw new Error('Something went wrong while creating an Axios instance.');
            process.exit(1);
        }
}  

/*
This function needs to be imported into the Event Dispatcher and then invoked. For example:
    import createAxiosInstance from './axios-webhook.ts';
    const instance = createAxiosInstance();
    instance.get('/someURL')
*/
export default createAxiosInstance;