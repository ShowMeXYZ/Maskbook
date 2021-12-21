import urlcat from 'urlcat'
import { SHOWME_API_URL } from '../constants'
import type { Club, Topic, Response } from '../types'

export async function getPublicInfo(clubUrl: string, userAddress?: string) {
    const response = await fetch(
        urlcat(SHOWME_API_URL, '/post/view/public_topics/', {
            club_url: clubUrl,
            user_address: userAddress || '',
        }),
        {
            mode: 'cors',
        },
    )
    const result = (await response.json()) as Response<{
        club: Club
        public_topics: Topic[]
    }>
    if (!result.success) {
        throw result
    }
    return {
        club: result.result!.club,
        topics: result.result!.public_topics,
    }
}
