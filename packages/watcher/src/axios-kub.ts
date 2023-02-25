import axios from 'axios';
const fs = require('fs');
//outside
const podWatch_Port = process.env.PODWATCH_PORT;
const podWatch_Token = process.env.PODWATCH_SERVICE_ACCOUNT_TOKEN;
//inside cluster
//this is what kubectl check to determine if it is running within a pod/cluster
//checks these enviromental variable
const kubernetes_host = process.env.KUBERNETES_SERVICE_HOST;
const kubernetes_port = process.env.KUBERNETES_SERVICE_PORT;

// determine whether it is calling the Kubernetes API from inside or outside the cluster
// Should use environment variables for PODWATCH_PORT and PODWATCH_SERVICE_ACCOUNT_TOKEN if they exist
const monitorInOrOut = () => {
  //check to see if it is calling the kubernetes API outside the cluster
  if (podWatch_Port && podWatch_Token) {
    //Point to the internal API server hostname
    //let APISERVER = `https://kubernetes.default.svc`;
    //create Axios Instance
    const instanceKub1 = axios.create({
      //uncertain if this is the correct url bec its the default service....
      //which allows communicaiton to service from anything else running inside the cluster
      baseURL: `https://kubernetes.default.svc/${podWatch_Port}`,
      //which one?
      baseURL: `http://192.0.2.1/api/v1/namespaces/kube-system/services/<service_name>:${podWatch_Port}`,
      //What is Bearer Authorization? Bearer Authentication (also called token authentication)
      //is a mechanism used to authorize clients by sending a security token
      //with every HTTP request we make to the server.
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${podWatch_Token}`,
      },
    });
    return instanceKub1;
  }
  //then it is inside the cluster
  else if (kubernetes_host && kubernetes_port) {
    //get token /var/run/secrets/kubernetes.io/serviceaccount/token
    //Path is the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded.
    //the kubectl wll check the existance of a service accoutn token file ...once the KUBERNETES_SERVICE_HOST & KUBERNETES_SERVICE_PORT and service token
    //are found authenication is assumed
    const KUBE_TOKEN = fs.readFileSync(
      '/var/run/secrets/kubernetes.io/serviceaccount/token',
      'utf-8'
    );

    const instanceKub2 = axios.create({
      //From inside the pod, kubernetes api server can be accessible directly on
      baseURL: `https://kubernetes.default.svc/${kubernetes_port}`,
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${KUBE_TOKEN}`,
      },
    });
    return instanceKub2;
  }
};

export default monitorInOrOut();
