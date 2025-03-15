import { Anime, JikanResponse } from '@tutkli/jikan-ts'
import axios from 'axios'

const mal = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
})

export enum AnimeRating {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  R17 = 'R+',
  RX = 'Rx',
}

export const getAllAnime = async (page: number = 1, limit: number = 5, rating?: AnimeRating) => {
  const { data } = await mal.get('/anime', {
    params: {
      page,
      limit,
      sfw: false,
      sort: "asc",
    }
  })
  return data as JikanResponse<Anime[]>
}