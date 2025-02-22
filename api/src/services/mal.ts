import axios from 'axios'

const mal = axios.create({
  baseURL: 'https://api.jikan.moe/v3',
})