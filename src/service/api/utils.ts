



const setupApiEndpoints = (apiServerUrl:string)=>{
    const apiRoot = `${apiServerUrl}/api/v1`
    const authRoot = `${apiServerUrl}/auth`

    const ENDPOINTS = {
        root: apiRoot,
        messages:  `${apiRoot}/messages/`,
        messagesReceived:  `${apiRoot}/messages/received/`,
        messagesSent:  `${apiRoot}/messages/sent/`,
        deleteRecieved: `${apiRoot}/messages/delete_recieved/`,
        deleteSent: `${apiRoot}/messages/delete_sent/`,

        token: `${authRoot}/token/`,
        tokenRefresh: `${authRoot}/token/refresh/`,
        tokenVerify: `${authRoot}/token/verify/`,
    } as ApiEndpoints

    return ENDPOINTS
}

const loadApiConfig = () =>new Promise<ApiEndpoints>(async (resolve, reject)=> {
    const response = await fetch('/config.json');
    const config = await response.json() as ApiConfig;
  
    const { apiServerUrl } = config
  
    const endpoints = setupApiEndpoints(apiServerUrl)
  
    resolve(endpoints)
  });


export {  loadApiConfig }




