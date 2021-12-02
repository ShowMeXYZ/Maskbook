import * as OpenSeaApi from '@masknet/web3-providers/opensea'
import * as NFTScanApi from '@masknet/web3-providers/NFTScan'
import * as RaribleApi from '@masknet/web3-providers/rarible'

import { unreachable } from '@dimensiondev/kit'
import { NonFungibleAssetProvider } from '@masknet/web3-shared-evm'
import { currentChainIdSettings } from '../../../Wallet/settings'

export async function getNFTs(
    from: string,
    chainId = currentChainIdSettings.value,
    provider = NonFungibleAssetProvider.OPENSEA,
) {
    let tokens
    switch (provider) {
        case NonFungibleAssetProvider.OPENSEA:
            tokens = await OpenSeaApi.getNFTs(from, chainId)
            return tokens
        case NonFungibleAssetProvider.NFTSCAN:
            tokens = await NFTScanApi.getNFTs(from)
            return tokens
        case NonFungibleAssetProvider.RARIBLE:
            tokens = await RaribleApi.getNFTs(from, chainId)
            return tokens
        default:
            unreachable(provider)
    }
}
