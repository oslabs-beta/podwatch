const PODWATCH_CUSTOM_SERVER_URL = process.env.PODWATCH_CUSTOM_SERVER_URL;
const PODWATCH_CLIENT_ID  = process.env.PODWATCH_CLIENT_ID ;
const PODWATCH_CLIENT_SECRET = process.env.PODWATCH_CLIENT_SECRET;

import axios from 'axios';

const createAxiosInstance = () => {
    //check if the podwatch custom server url exists
        if(PODWATCH_CUSTOM_SERVER_URL){
            //need to provide our PodWatch client ID and Secret
            const instance = axios.create({
                baseURL: PODWATCH_CUSTOM_SERVER_URL,
                timeout: 1000,
                
            })
            return instance;

        } else {
            const instance = axios.create({
                baseURL: 'http://localhost:3001/watch',
                timeout: 1000,
                headers: {
                    clientId: PODWATCH_CLIENT_ID,
                    clientSecret: PODWATCH_CLIENT_SECRET,
                }
            })
            return instance;
        }
}  

export default createAxiosInstance();