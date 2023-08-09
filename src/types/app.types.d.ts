type ApiConfig = {
    apiServerUrl: string
}

type ApiEndpoints = {
    root: string,
    messages: string,
    messagesReceived: string,
    messagesSent: string,
    token: string,
    tokenRefresh: string,
    tokenVerify: string,
}


type UserMessage = {
    id: string,
    from: string,
    to: string,
    subject: string,
    message: string,
    created: string

}

type NewMessage =   Omit<UserMessage, 'id' | 'created' | 'sender'>;