import axios, { AxiosResponse } from 'axios'
import dotenv from 'dotenv'
dotenv.config()

axios.defaults.baseURL = 'https://v3.football.api-sports.io/'
axios.defaults.headers.common['x-apisports-key'] = process.env.FOOTBALL_API_KEY 

export function footballAPI(endpoint: string, params: Record<string, any>): Promise<AxiosResponse> {
  console.log(`request Football API: ${endpoint}, params: ${JSON.stringify(params)}`)
  return axios.request({
    url: endpoint,
    method: 'get',
    params
  })
}