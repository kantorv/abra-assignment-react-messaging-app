
type ApiConfig = {
    apiServerUrl: string
}

type ApiEndpoints = {
    root: string,
    messages: string,
    token: string,
    tokenRefresh: string,

}


const setupApiEndpoints = (apiServerUrl:string)=>{
    const apiRoot = `${apiServerUrl}/api/v1`
    const authRoot = `${apiServerUrl}/auth`

    const ENDPOINTS = {
        root: apiRoot,
        messages:  `${apiRoot}/messages/`,
        token: `${authRoot}/token/`,
        tokenRefresh: `${authRoot}/token/refresh/`,
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




