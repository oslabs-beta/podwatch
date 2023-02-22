import axios from 'axios';
const podWatch_Port = process.env.PODWATCH_PORT;
const podWatch_Token = process.env.PODWATCH_SERVICE_ACCOUNT_TOKEN;
const kubernetes_host = process.env.KUBERNETES_SERVICE_HOST;
const kubernetes_port = process.env.KUBERNETES_SERVICE_PORT;

// determine whether it is calling the Kubernetes API from inside or outside the cluster
// Should use environment variables for PODWATCH_PORT and PODWATCH_SERVICE_ACCOUNT_TOKEN if they exist
const monitor = async () => {
  try {
    //check to see if it is calling the kubernetes API outside the cluster
    if (podWatch_Port && podWatch_Token) {
      //Point to the internal API server hostname
      let APISERVER = `https://kubernetes.default.svc`;
      //create Axios Instance
      const instance = axios.create({
        baseURL: `https://kubernetes.default.svc/${podWatch_Port}`,
        //What is Bearer Authorization? Bearer Authentication (also called token authentication)
        //is a mechanism used to authorize clients by sending a security token
        //with every HTTP request we make to the server.
        headers: {
          Authorization: `Bearer ${podWatch_Token}`,
        },
      });
      return instance;
    }
    //then it is inside the cluster
    else if (kubernetes_host && kubernetes_port) {
      //get token /var/run/secrets/kubernetes.io/serviceaccount/token
      //fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf-8')
      const KUBE_TOKEN = '/var/run/secrets/kubernetes.io/serviceaccount/token';

      const instance = axios.create({
        baseURL: `https://${kubernetes_host}/${kubernetes_port}`,
        headers: {
          Authorization: `Bearer ${KUBE_TOKEN}`,
        },
      });
      return instance;
    }
  } catch (error) {
    console.error(error);
  }
};

monitor();

//otherwise
//assume it’s hosted inside the cluster otherwise.

//create a Axios Instance that reflects it
