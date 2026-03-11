import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import '../styles.css'

const podcasts = [
  {
    id: 1,
    title: '夜晚的声音',
    description: '每晚一段声音，陪你入睡',
    emoji: '🌙'
  },
  {
    id: 2,
    title: '城市故事',
    description: '讲述城市里的人和事',
    emoji: '🌃'
  },
  {
    id: 3,
    title: '书页翻动',
    description: '读书、分享、思考',
    emoji: '📖'
  }
]

export default function PodcastsPage() {
  return (
    <>
      <Navigation />
      
      <main className="podcastsMain">
        <header className="podcastsHeader">
          <h1 className="podcastsTitle">播客</h1>
          <p className="podcastsDesc">用声音讲述故事</p>
        </header>

        <div className="podcastGrid">
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="podcastCard">
              <div className="podcastCover">{podcast.emoji}</div>
              <div className="podcastInfo">
                <h3>{podcast.title}</h3>
                <p>{podcast.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}