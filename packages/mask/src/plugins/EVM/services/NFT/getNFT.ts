import * as OpenSeaApi from '@masknet/web3-providers/opensea'
import * as NFTScanApi from '@masknet/web3-providers/NFTScan'
import * as RaribleApi from '@masknet/web3-providers/rarible'

import { unreachable } from '@dimensiondev/kit'
import { CollectibleProvider } from '@masknet/web3-shared-evm'
import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../../Wallet/settings'

export async function getNFT(address: string, tokenId: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value
    let token
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            token = await OpenSeaApi.getNFT(address, tokenId, chainId)
            return token
        case CollectibleProvider.NFTSCAN:
            token = await NFTScanApi.getNFT(address, tokenId)
            return token
        case CollectibleProvider.RARIBLE:
            token = await RaribleApi.getNFT(address, tokenId)
            return token
        default:
            unreachable(provider)
    }
}
