const PODWATCH_CUSTOM_SERVER_URL = process.env.PODWATCH_CUSTOM_SERVER_URL;
const PODWATCH_CLIENT_ID  = process.env.PODWATCH_CLIENT_ID ;
const PODWATCH_CLIENT_SECRET = process.env.PODWATCH_CLIENT_SECRET;

import axios from 'axios';

const checkForCustomServer = async () => {
    //check if the podwatch custom server url exists
    try {
        if(PODWATCH_CUSTOM_SERVER_URL){
            //need to provide our PodWatch client ID and Secret
            axios.post(PODWATCH_CUSTOM_SERVER_URL, {
                clientId: PODWATCH_CLIENT_ID,
                clientSecret: PODWATCH_CLIENT_SECRET,
            })

        } else {
            //this means they are using their own custom server url
            //do something

            //send an axios webhook to their own server
            axios.post('/', {

            })
        }
    }
    catch ( err: any ){
        //do something with the error

    }
    
}