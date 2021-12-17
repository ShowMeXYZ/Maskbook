import { Suspense, useMemo } from 'react'
import { ChainId } from '@masknet/web3-shared-evm'
import { NetworkPluginID, Plugin, useChainId, usePostInfoDetails } from '@masknet/plugin-infra'
import { SnackbarContent } from '@mui/material'
import MaskPluginWrapper from '../../MaskPluginWrapper'
import { extractTextFromTypedMessage, parseURL } from '@masknet/shared-base'
import { base } from '../base'
import { PLUGIN_META_KEY, PLUGIN_NAME } from '../constants'
import { EthereumChainBoundary } from '../../../web3/UI/EthereumChainBoundary'
import { PreviewCard } from './PreviewCard'
import { TopicDialog } from './TopicDialog'

const isShowMeClub = (x: string): boolean => {
    if (x.includes('https://')) {
        let hostname = x.split('https://')[1]
        hostname = hostname.split('/')[0]
        return (
            !!hostname &&
            hostname.split('.').length === 3 &&
            hostname.endsWith('.showme.fan') &&
            hostname !== 'app.showme.fan'
        )
    }
    return false
}
const isShowMeSupported = (chainId: ChainId): boolean => {
    return [ChainId.Mainnet, ChainId.Rinkeby, ChainId.BSC, ChainId.Matic, ChainId.Arbitrum].includes(chainId)
}
const getShowMeClubUrl = (x: string): string => {
    if (isShowMeClub(x)) {
        return x.split('https://')[1].split('/')[0].split('.')[0]
    }
    return ''
}

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    DecryptedInspector: function Comp(props) {
        const text = useMemo(() => extractTextFromTypedMessage(props.message), [props.message])
        const link = useMemo(() => parseURL(text.val || ''), [text.val]).find(isShowMeClub)
        if (!text.ok) return null
        if (!link) return null
        return <Renderer url={link} />
    },
    CompositionDialogMetadataBadgeRender: new Map([[PLUGIN_META_KEY, () => PLUGIN_NAME]]),
    GlobalInjection() {
        return <TopicDialog />
    },
    PostInspector() {
        const links = usePostInfoDetails.postMetadataMentionedLinks().concat(usePostInfoDetails.postMentionedLinks())

        const link = links.find(isShowMeClub)
        if (!link) return null
        return <Renderer url={link} />
    },
}

function Renderer(props: React.PropsWithChildren<{ url: string }>) {
    const clubUrl = getShowMeClubUrl(props.url)
    const chainId = useChainId(NetworkPluginID.PLUGIN_EVM)
    return (
        <MaskPluginWrapper pluginName={PLUGIN_NAME}>
            <Suspense fallback={<SnackbarContent message="Mask is loading this plugin..." />}>
                <EthereumChainBoundary chainId={isShowMeSupported(chainId) ? chainId : ChainId.BSC}>
                    <PreviewCard clubUrl={clubUrl} />
                </EthereumChainBoundary>
            </Suspense>
        </MaskPluginWrapper>
    )
}

export default sns
