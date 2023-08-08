type ApiConfig = {
    apiServerUrl: string
}

type ApiEndpoints = {
    root: string,
    messages: string,
    token: string,
    tokenRefresh: string,
    tokenVerify: string,
}




type UserMessage = {
    id: string,
    sender: string,
    receiver: string,
    subject: string,
    message: string,
    created: string

}