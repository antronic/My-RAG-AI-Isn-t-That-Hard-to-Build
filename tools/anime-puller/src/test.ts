import { getEmbeddingContent } from './config/prompt'
import { generateEmbedding } from './services/llm'
async function main() {

const data = [
  {
  "_id": {
    "$oid": "694b9fe04946878d01744671"
  },
  "jikan_id": 1,
  "titles": [
    {
      "type": "Default",
      "title": "Cowboy Bebop"
    },
    {
      "type": "Japanese",
      "title": "カウボーイビバップ"
    },
    {
      "type": "English",
      "title": "Cowboy Bebop"
    }
  ],
  "title": "Cowboy Bebop",
  "synopsis": "Crime is timeless. By the year 2071, humanity has expanded across the galaxy, filling the surface of other planets with settlements like those on Earth. These new societies are plagued by murder, drug use, and theft, and intergalactic outlaws are hunted by a growing number of tough bounty hunters.\n\nSpike Spiegel and Jet Black pursue criminals throughout space to make a humble living. Beneath his goofy and aloof demeanor, Spike is haunted by the weight of his violent past. Meanwhile, Jet manages his own troubled memories while taking care of Spike and the Bebop, their ship. The duo is joined by the beautiful con artist Faye Valentine, odd child Edward Wong Hau Pepelu Tivrusky IV, and Ein, a bioengineered Welsh corgi.\n\nWhile developing bonds and working to catch a colorful cast of criminals, the Bebop crew's lives are disrupted by a menace from Spike's past. As a rival's maniacal plot continues to unravel, Spike must choose between life with his newfound family or revenge for his old wounds.\n\n[Written by MAL Rewrite]",
  "background": "When Cowboy Bebop first aired in spring of 1998 on TV Tokyo, only episodes 2-3, 7-15, and 18 were broadcast, it was concluded with a recap special known as Yose Atsume Blues. This was due to anime censorship having increased following the big controversies over Evangelion, as a result most of the series was pulled from the air due to violent content. Satellite channel WOWOW picked up the series in the fall of that year and aired it in its entirety uncensored. Cowboy Bebop was not a ratings hit in Japan, but sold over 19,000 DVD units in the initial release run, and 81,000 overall. Protagonist Spike Spiegel won Best Male Character, and Megumi Hayashibara won Best Voice Actor for her role as Faye Valentine in the 1999 and 2000 Anime Grand Prix, respectively. Cowboy Bebop's biggest influence has been in the United States, where it premiered on Adult Swim in 2001 with many reruns since. The show's heavy Western influence struck a chord with American viewers, where it became a \"gateway drug\" to anime aimed at adult audiences.",
  "images": {
    "jpg": {
      "image_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
      "small_image_url": "https://cdn.myanimelist.net/images/anime/4/19644t.jpg",
      "large_image_url": "https://cdn.myanimelist.net/images/anime/4/19644l.jpg"
    },
    "webp": {
      "image_url": "https://cdn.myanimelist.net/images/anime/4/19644.webp",
      "small_image_url": "https://cdn.myanimelist.net/images/anime/4/19644t.webp",
      "large_image_url": "https://cdn.myanimelist.net/images/anime/4/19644l.webp"
    }
  },
  "url": "https://myanimelist.net/anime/1/Cowboy_Bebop",
  "popularity": 42,
  "rating": "R - 17+ (violence & profanity)",
  "release_year": 1998,
  "producers_name": [
    "Bandai Visual",
    "Victor Entertainment",
    "Audio Planning U"
  ],
  "producers": [
    {
      "mal_id": 23,
      "type": "anime",
      "name": "Bandai Visual",
      "url": "https://myanimelist.net/anime/producer/23/Bandai_Visual"
    },
    {
      "mal_id": 123,
      "type": "anime",
      "name": "Victor Entertainment",
      "url": "https://myanimelist.net/anime/producer/123/Victor_Entertainment"
    },
    {
      "mal_id": 1506,
      "type": "anime",
      "name": "Audio Planning U",
      "url": "https://myanimelist.net/anime/producer/1506/Audio_Planning_U"
    }
  ],
  "themes": [
    "Adult Cast",
    "Space"
  ]
}
]

const result = await generateEmbedding(getEmbeddingContent(data[0]))

console.log('result ----------', result)
}

main()