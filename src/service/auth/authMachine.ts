import { createMachine, assign, ActorRefFrom} from "xstate";

type LoginStateType = | "anonimous" | "authenticated" | "loading"


type MachineContext  = { 
    token: string|undefined,
    refreshTokenInterval:number,
    loginState: LoginStateType

};

 
type MachineState =
  | { value: "anonimous"; context:MachineContext }
  | { value: "loading"; context:MachineContext }
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


export const authMachine = createMachine<
  MachineContext, 
  MachineEvent,
  MachineState
>({
    predictableActionArguments: true,
    initial: "authenticated",
    id:"authmachine",
    context: {
      token : undefined,
      refreshTokenInterval: 60000 * 25, // refresh token expiration  - 30min
      loginState: "loading"
    },

    on: {


      'EVENTS.TOKENREFRESH.SUCCESS' : {
        actions:[
          (_,e)=>console.log( e)
        ]
      }
    },

    invoke: [
      
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
    states: {


      anonimous:{
        id:"anonimous",
        entry: (_,e)=>console.log("authmachine.anonimous.idle entry", e),
        exit: (_,e)=>console.log("authmachine.anonimous.idle exit", e),

      },

      loading: {
        entry: (_,e)=>console.log("authmachine.start entry", e),
        exit: (_,e)=>console.log("authmachine.start exit", e),
      },

      authenticated:{
        initial:"idle",
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
