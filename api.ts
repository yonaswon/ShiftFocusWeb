import axios from 'axios'

const baseUrl = "https://wu96xsgn33.execute-api.eu-north-1.amazonaws.com/dev"

const api = axios.create({
    baseURL:baseUrl
})

api.interceptors.request.use(async function (config){
    const tokens = localStorage.getItem('tokens')
    console.log(tokens,'tokens')
    if(tokens){{
        const access = JSON.parse(tokens)?.access
        console.log(access,'acess')
        config.headers.Authorization = `JWT ${access}`

    }}
    return config;
})


export default api