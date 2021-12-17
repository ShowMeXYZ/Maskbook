import { useAsyncRetry } from 'react-use'
import { PluginShowMeRPC } from '../messages'

export function useTopics(clubUrl: string, userAddress?: string) {
    return useAsyncRetry(() => PluginShowMeRPC.fetchPublicTopics(clubUrl, userAddress))
}
