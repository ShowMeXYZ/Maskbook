import Web3 from 'web3'
import RSS3 from 'rss3-next'
import { isSameAddress } from '@masknet/web3-shared-evm'
import { personalSign } from '../../../extension/background-script/EthereumService'
import { RSS3_APP } from '../constants'
import type { AvatarMetaDB } from '../types'

interface NFTRSSNode {
    address: string
    signature: string
    nft: AvatarMetaDB
}

export async function createRSS3(address: string) {
    return new RSS3({
        endpoint: RSS3_APP,
        address,
        sign: async (message: string) => {
            return personalSign(message, address)
        },
    })
}

const cache = new Map<string, Promise<AvatarMetaDB | undefined>>()

export async function getNFTAvatarFromRSS(address: string) {
    let f = cache.get(address)
    if (!f) {
        f = _getNFTAvatarFromRSS(address)
        cache.set(address, f)
    }
    const nft = await f
    return nft
}

async function _getNFTAvatarFromRSS(address: string) {
    const rss = await createRSS3(address)
    const file = await rss.files.get(rss.account.address)
    const nft = Object.getOwnPropertyDescriptor(file, '_nft')
    if (!nft?.value) return
    const data = nft.value as NFTRSSNode

    const web3 = new Web3()
    const result = web3.eth.accounts.recover(data.nft.userId, data.signature)
    if (!isSameAddress(result, address)) return
    return data.nft
}

export async function saveNFTAvatarToRSS(address: string, nft: AvatarMetaDB, signature: string) {
    const rss = await createRSS3(address)
    if (!rss) return

    const file = await rss.files.get(rss.account.address)
    if (!file) throw new Error('The account was not found.')

    rss.files.set(
        Object.assign(file, {
            _nft: {
                signature: signature,
                nft,
            },
        }),
    )
    await rss.files.sync()

    // clear cache
    if (cache.has(address)) cache.delete(address)

    return nft
}

export async function getRSSNode(address: string) {
    const rss = await createRSS3(address)
    const file = await rss.files.get(rss.account.address)
    const nft = Object.getOwnPropertyDescriptor(file, '_nft')
    if (!nft?.value) return
    return file
}
