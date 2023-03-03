import axios from 'axios';
const fs = require('fs');
//outside
const podWatch_Port = process.env.PODWATCH_PORT;
const podWatch_Token = process.env.PODWATCH_SERVICE_ACCOUNT_TOKEN;
//inside cluster
//this is what kubectl check to determine if it is running within cluster
const kubernetes_Host = process.env.KUBERNETES_SERVICE_HOST;
const kubernetes_Port = process.env.KUBERNETES_SERVICE_PORT;
import https from 'https';

// determine whether it is calling the Kubernetes API from inside or outside the cluster
const monitorInOrOut = () => {
  //check to see if it is calling the kubernetes API outside the cluster
  if (podWatch_Port !== undefined && podWatch_Token !== undefined) {
    //create Axios Instance for outside the cluster
    const instanceKub1 = axios.create({
      //baseURL connect to localhost at the port specified
      baseURL: `https://localhost:${podWatch_Port}`,

      //Bearer Authentication (also called token authentication)
      //is a mechanism used to authorize clients by sending a security token
      headers: {
        Authorization: `Bearer ${podWatch_Token}`,
      },
    });
    return instanceKub1;
  }
  //custom errors for it the user is trying to make a specific port and token but has forgotten one
  else if (podWatch_Port !== undefined && podWatch_Token === undefined) {
    const error = 'You are missing the podWatch_Port';
    throw new Error(error);
    process.exit(1);
  } else if (podWatch_Port === undefined && podWatch_Token !== undefined) {
    const error2 = 'You are missing the podWatch_Token';
    throw new Error(error2);
    process.exit(1);
  } else if (!podWatch_Port && podWatch_Token) {
    const error3 = 'podWatch_Port is null';
    throw new Error(error3);
    process.exit(1);
  } else if (podWatch_Port && !podWatch_Token) {
    const error4 = 'podWatch_Token is null';
    throw new Error(error4);
    process.exit(1);
  }
  // inside the cluster
  else if (kubernetes_Host && kubernetes_Port) {
    //the kubectl wll check the existance of a service account token file ...once the KUBERNETES_SERVICE_HOST & KUBERNETES_SERVICE_PORT & service token
    const KUBE_TOKEN = fs.readFileSync(
      '/var/run/secrets/kubernetes.io/serviceaccount/token',
      'utf-8'
    );

    const cacert = fs.readFileSync(
      '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'
    );
    //create axios instance
    const instanceKub2 = axios.create({
      //From inside the pod, kubernetes api server can be accessible directly on
      baseURL: `https://${kubernetes_Host}:${kubernetes_Port}`,

      headers: {
        Authorization: `Bearer ${KUBE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        ca: cacert,
      }),
    });
    return instanceKub2;
  }
};

export default monitorInOrOut();
