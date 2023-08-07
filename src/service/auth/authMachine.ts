import { createMachine, assign, ActorRefFrom} from "xstate";




type LoginStateType = | "anonimous" | "authenticated" | "loading"


type MachineContext  = { 
    token: string|undefined,
    refreshTokenInterval:number,
    loginState: LoginStateType

};

 
type MachineState =
  | { value: "idle"; context:MachineContext }
  | { value: "loading"; context:MachineContext }
  | { value: "ready"; context:MachineContext }
  | { value: "anonimous"; context:MachineContext }
  | { value: "authenticated"; context:MachineContext }
  
 


type MachineEvent =
| {
  type: 'EVENTS.KEYCLOAK.READY',
  authenticated: boolean
} | {
  type: 'EVENTS.TOKEN.REFRESH',
} | {
    type: 'EVENTS.APP.START',
} | {
    type: 'EVENTS.API.CALL1',
} | {
    type: 'EVENTS.TOKENREFRESH.SUCCESS',
} 


// const counterInterval = (callback, receive) => {
//   let count = 0;

//   const intervalId = setInterval(() => {
//     callback({ type: 'EVENTS.API.CALL1', count });
//     count++;
//   }, 1000);

//   receive(event => {
//     if (event.type === 'INC') {
//       count++;
//     }
//   });

//   return () => { clearInterval(intervalId); }
// }





export const authMachine = createMachine<
  MachineContext, 
  MachineEvent,
  MachineState
>({
    predictableActionArguments: true,
    initial: "idle",
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
      idle: {
        entry: (_,e)=>console.log("authmachine.idle entry", e),
        exit: (_,e)=>console.log("authmachine.idle exit", e),
      },


      loading: {
        entry: (_,e)=>console.log("authmachine.start entry", e),
        exit: (_,e)=>console.log("authmachine.start exit", e),
      },


      anonimous:{
        id:"anonimous",
        entry: (_,e)=>console.log("authmachine.anonimous.idle entry", e),
        exit: (_,e)=>console.log("authmachine.anonimous.idle exit", e),

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

                  // keycloak.updateToken(300).then(function(refreshed) {
                  //     console.log("keycloak.updateToken", {refreshed})
                  //     resolve({"error":false, message:'token updated', code:200})

                  // }).catch(function(e) {
                  //     console.log('Failed to refresh token',e);
                  //     reject({"error":true, message:'Failed to refresh token', code:500})
                  // });

                }),
                onDone:{
                  target:"idle"
                },
                onError:{
                  target:"#anonimous"
                }
              },
             
             
                // after:{
                //   20000:{
                //     target:"idle"
                //   }
                // }
            }
        },

       
        // invoke: {
        //   src: (context, event) =>
        //     interval(context.refreshTokenInterval).pipe(
        //       map((value) => ({ type: 'COUNT', value }))
              
        //     ),
        //   onDone: 'finished'
        // },
      }



    }
  },{
    actions:{
 
    },
  });


  export type AuthMachineActorType = ActorRefFrom<typeof authMachine>
