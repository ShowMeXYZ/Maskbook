import { ChainId, CollectibleProvider } from '@masknet/web3-shared-evm'
import * as OpenSeaApi from '@masknet/web3-providers/opensea'
import * as NFTScanApi from '@masknet/web3-providers/NFTScan'
import * as RaribleApi from '@masknet/web3-providers/rarible'

import { unreachable } from '@dimensiondev/kit'
import { currentCollectibleDataProviderSettings } from '../../../Wallet/settings'

export async function getNFTBalance(address: string, contract_address: string, chainId: ChainId) {
    const provider = currentCollectibleDataProviderSettings.value
    let balance
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            balance = await OpenSeaApi.getContractBalance(address, contract_address, chainId)
            return balance
        case CollectibleProvider.NFTSCAN:
            balance = await NFTScanApi.getContractBalance(address, contract_address, chainId)
            return balance
        case CollectibleProvider.RARIBLE:
            balance = await RaribleApi.getContractBalance(address, contract_address, chainId)
            return balance
        default:
            unreachable(provider)
    }
}
