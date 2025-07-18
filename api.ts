import axios from 'axios'

const baseUrl = "http://localhost:8000"

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