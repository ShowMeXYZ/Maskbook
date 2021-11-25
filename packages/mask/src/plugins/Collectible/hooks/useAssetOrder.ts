import { unreachable } from '@dimensiondev/kit'
import { BigNumber } from 'bignumber.js'
import { head } from 'lodash-unified'
import { useAsyncRetry } from 'react-use'
import { getOrderUnitPrice } from '../../EVM/utils'
import { PluginCollectibleRPC } from '../messages'
import { CollectibleProvider, CollectibleToken } from '../types'

export function useAssetOrder(provider: CollectibleProvider, token?: CollectibleToken) {
    return useAsyncRetry(async () => {
        if (!token) return
        switch (provider) {
            case CollectibleProvider.OPENSEA:
                const openSeaResponse = await PluginCollectibleRPC.getAssetFromSDK(token.contractAddress, token.tokenId)

                const desktopOrder = head(
                    (openSeaResponse.sellOrders ?? []).sort(
                        (a, b) =>
                            new BigNumber(
                                getOrderUnitPrice(
                                    a.currentPrice?.toFixed(),
                                    a.paymentTokenContract?.decimals ?? 0,
                                    a.quantity.toFixed(),
                                ) ?? 0,
                            ).toNumber() -
                            new BigNumber(
                                getOrderUnitPrice(
                                    b.currentPrice?.toFixed(),
                                    b.paymentTokenContract?.decimals,
                                    b.quantity.toFixed(),
                                ) ?? 0,
                            ).toNumber(),
                    ),
                )

                return desktopOrder
            case CollectibleProvider.RARIBLE:
                return
            default:
                unreachable(provider)
        }
    }, [provider, token])
}
