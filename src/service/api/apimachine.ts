import { log } from "console";
import { createMachine, assign, sendParent, send, ActorRefFrom, DoneInvokeEvent } from "xstate";

type MachineContext = {
  token: string,
  endpoints: ApiEndpoints,
  received_messages: UserMessage[],
  sent_messages: UserMessage[]
};


type MachineState =
  | { value: "idle"; context: MachineContext }
  | { value: "get_received"; context: MachineContext }
  | { value: "get_sent"; context: MachineContext }

  | { value: "post_message"; context: MachineContext }
  | { value: "post_message.filling"; context: MachineContext }
  | { value: "post_message.execute"; context: MachineContext }
  | { value: "post_message.success"; context: MachineContext }
  | { value: "post_message.error"; context: MachineContext }

  | { value: "delete_message"; context: MachineContext }
  | { value: "api_error"; context: MachineContext }



type MachineEvent =
  | {
    type: 'EVENTS.API.LOAD_RECEIVED_MESSAGES',
  } | {
    type: 'EVENTS.API.LOAD_SENT_MESSAGES',
  } | {
    type: 'EVENTS.API.CREATE_MESSAGE',
  } | {
    type: 'EVENTS.API.POST_MESSAGE',
    message: NewMessage
  } | {
    type: 'EVENTS.API.DELETE_MESSAGE',
    id: string
  } | {
    type: 'EVENTS.UI.CLOSE_MESSAGE_EDITOR',
    id: string
  }| {
    type: 'EVENTS.TOKEN.REFRESH',
    token: string
  }






//https://dmitripavlutin.com/javascript-fetch-async-await/

const getApiRequest = (token: string, endpoint: string) => new Promise(async (resolve, reject) => {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: headers
  });


  console.log(`[getApiRequest]: ${endpoint}: ${response.ok}, ${response.status}`)

  if (!response.ok) reject("[HANDLEME!]response.ok is not true")
  if (!(response.status === 200)) reject("[HANDLEME!]response.status is not 200")


  const data = await response.json();

  resolve(data)


})

const postApiRequest = (token: string, endpoint: string, payload: object) => new Promise(async (resolve, reject) => {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");


  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  });


  console.log(`[postApiRequest]: ${endpoint}: ${response.ok}, ${response.status}`)

  if (!response.ok) console.log("[HANDLEME!]response.ok is not true")
  if (!(response.status === 201)) console.log("[HANDLEME!]response.status is not 201")


  const data = await response.json();

  if (!response.ok) reject(data)
  else resolve(data)


})

const deleteApiRequest = (token: string, endpoint: string) => new Promise(async (resolve, reject) => {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");


  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: headers
  });


  console.log(`[deleteApiRequest]: ${endpoint}: ${response.ok}, ${response.status}`)

  if (!response.ok) console.log("[HANDLEME!]response.ok is not true")
  if (!(response.status === 204)) console.log("[HANDLEME!]response.status is not 201")


  if (response.status === 204) {
    resolve({ success: true })

  }
  else reject({ error: true })



})





const postMessageRequest = (_:MachineContext, message:NewMessage) =>new Promise(async (resolve, reject)=> {
  const {endpoints, token} = _
  
  const payload = {
    ...message,
  }

  try{
    const response = await postApiRequest(token, endpoints.messages, payload);
    resolve(response)
  }
  catch(e){
    console.log("postMessageRequest error" , e)
    reject(e)
  }


})


const deleteMessageRequest = (_: MachineContext, id: string) => new Promise(async (resolve, reject) => {
  const { token, endpoints } = _
  const url = `${endpoints.messages}${id}/`

  try {
    await deleteApiRequest(token, url);
    resolve({ success: true, id: id })
  }
  catch (e) {
    console.log("deleteMessageRequest error", e)
    reject(e)
  }
})

const getReceivedMessagesRequest = (_: MachineContext) => new Promise(async (resolve, reject) => {
  const { token, endpoints } = _
  const url = `${endpoints.messagesReceived}`

  try {
    const response  = await getApiRequest(token, url);
    resolve({ success: true, response: response })
  }
  catch (e) {
    console.log("getReceivedMessagesRequest error", e)
    reject(e)
  }
})


const getSentMessagesRequest = (_: MachineContext) => new Promise(async (resolve, reject) => {
  const { token, endpoints } = _
  const url = `${endpoints.messages}`

  try {
    const response  = await getApiRequest(token, url);
    resolve({ success: true, response: response })
  }
  catch (e) {
    console.log("getSentMessagesRequest error", e)
    reject(e)
  }
})

//}

export const apiMachine = createMachine<
  MachineContext,
  MachineEvent,
  MachineState
>({
  predictableActionArguments: true,
  initial: "idle",
  id: "apimachine",
  context: {
    token: "",
    endpoints: {} as ApiEndpoints,
    received_messages:[],
    sent_messages:[]
  },


  states: {

    idle: {
      id: "idle",
      entry:    (_, e) => console.log("apimachine.idle entry", { endpoints: _.endpoints }),
      exit: (_, e) => console.log("apimachine.idle exit", e),
      on: {
        'EVENTS.API.LOAD_RECEIVED_MESSAGES': {
          target: "get_received"
        },

        'EVENTS.API.LOAD_SENT_MESSAGES': {
          target: "get_sent"
        },

        'EVENTS.API.CREATE_MESSAGE': {
          target: "post_message"
        },

        'EVENTS.API.DELETE_MESSAGE': {
          target: "delete_message"
        },


        'EVENTS.TOKEN.REFRESH':{
          actions:  [
          //  (_,e)=>console.log('EVENTS.TOKEN.REFRESH received', e.token),
            assign((_, e) => ({
              token: e.token
            }))
          ],
        }
      },
    },

    get_received: {
      entry: (_, e) => console.log("apimachine.get_received entry", e),
      exit: (_, e) => console.log("apimachine.get_received exit", e),
      invoke: {
        src: getReceivedMessagesRequest,
        onDone: {
          actions: [
            (_, e) => console.log("apimachine.get_received.getReceivedMessagesRequest onDone", e),
            assign((_, e) => ({
              received_messages: e.data.response
            }))
          ],
          target: "idle"
        },
        onError: {
          actions: [
            (_, e) => console.log("apimachine.get_received.getReceivedMessagesRequest onError", e),
          ],
          target: "api_error"
        }
      }


    },

    get_sent:{

    },

    post_message: {
      entry: (_, e) => console.log("apimachine.post_message entry", e),
      exit: (_, e) => console.log("apimachine.post_message exit", e),
      on:{
        'EVENTS.UI.CLOSE_MESSAGE_EDITOR':{
          target: "idle"
        }
      },
      initial:"filling",
      states:{
         filling:{
            on:{
              'EVENTS.API.POST_MESSAGE':{
                target: "execute"
              }
            }
         },
         execute:{
          invoke: {
            src: (ctx, e) => (e.type === 'EVENTS.API.POST_MESSAGE' && postMessageRequest(ctx, e.message)) || new Promise((resolve, reject) => reject(e)),
            onDone: {
              actions: [
                (_, e) => console.log("apimachine.post_message.postMessageRequest onDone", e),
                assign((_, e) => ({
                  sent_messages: [..._.sent_messages, e.data]
                }))
              ],
              target: "success"
            },
            onError: {
              actions: [
                (_, e) => console.log("apimachine.post_message.postMessageRequest onError", e),
              ],
              target: "error"
            }
          }
    

         },
         error:{
          
         },
         success:{

         }
      },



    },


    delete_message: {
      entry: (_, e) => console.log("apimachine.delete_message entry", e),
      exit: (_, e) => console.log("apimachine.delete_message exit", e),
      invoke: {
        src: (ctx, e) => (e.type === 'EVENTS.API.DELETE_MESSAGE'  && deleteMessageRequest(ctx, e.id)) || new Promise((resolve, reject) => reject(null)),
        onDone: {
          actions: [
            (_, e) => console.log("apimachine.delete_message.deleteMessageRequest onDone", e),
          ],
          target: "idle"
        },
        onError: {
          actions: [
            (_, e) => console.log("apimachine.delete_message.deleteMessageRequest onError", e)
          ],
          target: "api_error"
        }
      }


    },


    api_error:{
      entry: (_, e) => console.log("apimachine.api_error entry", e),
      exit: (_, e) => console.log("apimachine.api_error exit", e),
    }

  }
}, {
  actions: {

  },
});


export type ApiMachineActorType = ActorRefFrom<typeof apiMachine>
