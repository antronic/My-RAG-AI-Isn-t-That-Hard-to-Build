import { producer } from '../config/kafka'
import { getAllAnime } from '../services/jikan'

let page = 1

export async function start(page = 1) {
  const animes = await getAllAnime(page, 20)
  const data = animes.data.map((anime) => {
    return {
      jikan_id: anime.mal_id,
      titles: anime.titles,
      title: anime.title,
      synopsis: anime.synopsis,
      background: anime.background,
      images: anime.images,
      url: anime.url,
      popularity: anime.popularity,
      rating: anime.rating,
      release_year: anime.year,
      producers_name: anime.producers.map(producer => producer.name),
      producers: anime.producers,
      themes: anime.themes.map(theme => theme.name),
    }
  })

  let count = 1

  for (const anime of data) {
    await producer.send({
      topic: 'anime-task-topic',
      messages: [
        {
          key: String(page + '_' + anime.jikan_id),
          value: JSON.stringify(anime),
        }
      ]
    })

    console.log(`Sent - [${page}]:[${count++}/${data.length}] - ${anime.title}`)
  }
}
