import { Suspense, useMemo } from 'react'
import { Plugin, usePostInfoDetails } from '@masknet/plugin-infra'
import { SnackbarContent } from '@mui/material'
import MaskPluginWrapper from '../../MaskPluginWrapper'
import { extractTextFromTypedMessage, parseURL } from '@masknet/shared-base'
import { base } from '../base'
import { PLUGIN_META_KEY, PLUGIN_NAME, SHOWME_CLUB_URL_RE } from '../constants'
import { ClubCard } from './ClubCard'
import { TopicDialog } from './TopicDialog'

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init() {},
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

const isShowMeClub = (x: string): boolean => {
    const matched = x.match(SHOWME_CLUB_URL_RE)
    return !!matched ? !['app', 'api'].includes(matched[1]) : false
}

const getShowMeClubUrl = (x: string): string => {
    if (isShowMeClub(x)) {
        return x.match(SHOWME_CLUB_URL_RE)![1]
    }
    return ''
}

function Renderer(props: React.PropsWithChildren<{ url: string }>) {
    const clubUrl = getShowMeClubUrl(props.url)
    return (
        <MaskPluginWrapper pluginName={PLUGIN_NAME}>
            <Suspense fallback={<SnackbarContent message="Mask is loading this plugin..." />}>
                <ClubCard clubUrl={clubUrl} />
            </Suspense>
        </MaskPluginWrapper>
    )
}

export default sns
