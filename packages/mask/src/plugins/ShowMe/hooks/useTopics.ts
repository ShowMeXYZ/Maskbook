import { useAsyncRetry } from 'react-use'
import { ShowMeRPC } from '../messages'

export function usePublicInfo(clubUrl: string, userAddress?: string) {
    return useAsyncRetry(() => ShowMeRPC.getPublicInfo(clubUrl, userAddress))
}
