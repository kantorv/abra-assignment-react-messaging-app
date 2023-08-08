import { createMachine, assign, ActorRefFrom} from "xstate";
import { loadApiConfig } from "../api/utils";

type LoginStateType = | "anonimous" | "authenticated" | "loading"


type MachineContext  = { 
    token: string|undefined,
    refreshToken: string|undefined,
    refreshTokenInterval:number,
    loginState: LoginStateType,
    apiEndpoints: ApiEndpoints

};

 
type MachineState =
  | { value: "loading"; context:MachineContext }
  | { value: "anonimous"; context:MachineContext }
  | { value: "authenticated"; context:MachineContext }
  
 


type MachineEvent =
| {
  type: 'EVENTS.TOKEN.REFRESH',
} | {
    type: 'EVENTS.APP.START',
} | {
    type: 'EVENTS.API.CALL1',
} | {
    type: 'EVENTS.TOKENREFRESH.SUCCESS',
} 



const postApiRequest = (token:string,endpoint:string,payload:object)=>new Promise(async (resolve, reject)=> {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");


  const response = await fetch(endpoint,{
    method:"POST", 
    headers: headers,
    body: JSON.stringify(payload)
  });


  console.log(`[postApiRequest]: ${endpoint}: ${response.ok}, ${response.status}`)

  if(!response.ok)              console.log("[HANDLEME!]response.ok is not true")
  if(!(response.status===201))  console.log("[HANDLEME!]response.status is not 201")


  const data = await response.json();

  if(!response.ok) reject(data)
  else resolve(data)


})



const refreshTokenAsync = (_:MachineContext) =>new Promise(async (resolve, reject)=> {

  const {apiEndpoints,refreshToken} = _
  

  const headers = new Headers();
  headers.append("Content-Type", "application/json");



  const payload = {
      "refresh" : refreshToken
  }


  const response = await fetch(apiEndpoints.tokenRefresh,{
    method:"POST", 
    headers: headers,
    body: JSON.stringify(payload)
  });

  if(!response.ok) reject(false)

  
  const data = await response.json();
  resolve(data)


})


const verifyTokenAsync = (_:MachineContext) =>new Promise(async (resolve, reject)=> {

  const {apiEndpoints,token} = _
  if (undefined === token) {
    reject({reason: "not_exists"})
    return
  }
  
  

  const headers = new Headers();
  headers.append("Content-Type", "application/json");



  const payload = {
      "token" : token
  }


  const response = await fetch(apiEndpoints.tokenVerify,{
    method:"POST", 
    headers: headers,
    body: JSON.stringify(payload)
  });


  const data = await response.json();

  if(!response.ok) reject({reason: "verify_failed", data: data})

  
  
  resolve(data)


})




export const authMachine = createMachine<
  MachineContext, 
  MachineEvent,
  MachineState
>({
    predictableActionArguments: true,
    initial: "loading",
    id:"authmachine",
    context: {
      token : undefined,
      refreshToken : undefined,
      refreshTokenInterval: 60000 * 25, // refresh token expiration  - 30min
      loginState: "loading",
      apiEndpoints: {} as ApiEndpoints
    },

    on: {


      'EVENTS.TOKENREFRESH.SUCCESS' : {
        actions:[
          (_,e)=>console.log( e)
        ]
      }
    },

    invoke: [
      

    
    ],
    states: {
      loading:{
        entry: (_,e)=>console.log("authmachine.loading entry"),
        exit: (_,e)=>console.log("authmachine.loading exit"),
        initial:"get_api_config",

        states:{
          get_api_config:{
            invoke:{
              src:loadApiConfig,
              onDone:{
                actions:[
                  (_,e)=>console.log("apimachine.loading.get_api_config.loadApiConfig onDone", e),
                  assign((_,e)=>({
                    apiEndpoints:e.data
                  }))
                ],
                target:"verify_token"
              },
              onError:{
                actions:[
                  (_,e)=>console.log("apimachine.loading.get_api_config.loadApiConfig onError", e),
                ],
              }
            }
          },
          verify_token:{
            invoke:{
              src:(_,e)=>verifyTokenAsync(_),
              onDone:{
                actions:[
                  (_,e)=>console.log("apimachine.loading.verify_token.verifyTokenAsync onDone", e),
                ],
                target:"#authenticated"
              },
              onError:{
                actions:[
                  (_,e)=>console.log("apimachine.loading.verify_token.verifyTokenAsync onError", e),
                ],
                target:"#anonimous"
              }
            }
          }
        },



      },

      anonimous:{
        id:"anonimous",
        entry: (_,e)=>console.log("authmachine.anonimous.idle entry", e),
        exit: (_,e)=>console.log("authmachine.anonimous.idle exit", e),

      },


      authenticated:{
        id:"authenticated",
        initial:"idle",
        invoke:[
          {
            id: 'incInterval',
            src: (context, event) => (callback, onReceive) => {
              // This will send the 'INC' event to the parent every second
              const {refreshTokenInterval} = context
              const id = setInterval(() => callback( 'EVENTS.TOKEN.REFRESH'), refreshTokenInterval);
        
              // Perform cleanup
              return () => clearInterval(id);
            }
          }
        ],
        states:{
            idle:{
              entry: (_,e)=>console.log("authmachine.authenticated.idle entry", e),
              exit: (_,e)=>console.log("authmachine.authenticated.idle exit", e),
              on:{
                'EVENTS.TOKEN.REFRESH':{
                  actions: [
                    (_,e)=>console.log(e)
                  ],
                  target: "token_refresh"
                }
              }
            },
            token_refresh:{
              entry: (_,e)=>console.log("authmachine.authenticated.token_refresh entry", e),
              exit: (_,e)=>console.log("authmachine.authenticated.token_refresh exit", e),
              invoke:{
                id: "token_refresh",
                src: (_,e)=>new Promise((resolve, reject)=>{
                  resolve(true)
                }),
                onDone:{
                  target:"idle"
                },
                onError:{
                  target:"#anonimous"
                }
              },
            }
        },
      }



    }
  },{
    actions:{
 
    },
  });


  export type AuthMachineActorType = ActorRefFrom<typeof authMachine>
