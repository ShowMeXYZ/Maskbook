import urlcat from 'urlcat'
import { SHOWME_API } from '../constants'
import type { Club, Topic } from '../types'

export async function fetchPublicTopics(clubUrl: string, userAddress?: string) {
    const response = await fetch(
        urlcat(SHOWME_API, '/post/view/public_topics/', {
            club_url: clubUrl,
            user_address: userAddress,
        }),
    )
    const { club, public_topics } = (await response.json()) as {
        club: Club
        public_topics: Topic[]
    }
    return {
        club,
        topics: public_topics,
    }
}
