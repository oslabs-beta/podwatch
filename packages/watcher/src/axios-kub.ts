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

const cacert = fs.readFileSync(
  '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'
);

// determine whether it is calling the Kubernetes API from inside or outside the cluster
const monitorInOrOut = () => {
  //check to see if it is calling the kubernetes API outside the cluster
  if (podWatch_Port === undefined && podWatch_Token === undefined) {
    //create Axios Instance
    const instanceKub1 = axios.create({
      //which allows communicaiton to service from anything else running inside the cluster
      baseURL: `https://localhost:${podWatch_Port}`,

      //Bearer Authentication (also called token authentication)
      //is a mechanism used to authorize clients by sending a security token
      headers: {
        Authorization: `Bearer ${podWatch_Token}`,
      },
    });
    return instanceKub1;
  }
  // inside the cluster
  else if (kubernetes_Host && kubernetes_Port) {
    //get token /var/run/secrets/kubernetes.io/serviceaccount/token
    //the kubectl wll check the existance of a service account token file ...once the KUBERNETES_SERVICE_HOST & KUBERNETES_SERVICE_PORT
    // and service token
    //are found authenication is assumed
    const KUBE_TOKEN = fs.readFileSync(
      '/var/run/secrets/kubernetes.io/serviceaccount/token',
      'utf-8'
    );

    const instanceKub2 = axios.create({
      //From inside the pod, kubernetes api server can be accessible directly on
      baseURL: `https://${kubernetes_Host}:${kubernetes_Port}`,

      headers: {
        Authorization: `Bearer ${KUBE_TOKEN}`,
        'Content-Type': 'applicaiton/json',
      },
      httpsAgent: new https.Agent({
        ca: cacert,
      }),
    });
    return instanceKub2;
  }
};

export default monitorInOrOut();
