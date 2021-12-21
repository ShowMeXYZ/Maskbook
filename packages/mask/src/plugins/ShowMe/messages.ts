import { createPluginMessage, PluginMessageEmitter, createPluginRPC } from '@masknet/plugin-infra'
import { PLUGIN_ID } from './constants'
import type { TopicDialogEvent } from './types'

interface ShowMeMessages {
    /**
     * Open topic dialog
     */
    topicDialogEvent: TopicDialogEvent

    rpc: unknown
}

if (import.meta.webpackHot) import.meta.webpackHot.accept()

export const ShowMeMessages: PluginMessageEmitter<ShowMeMessages> = createPluginMessage(PLUGIN_ID)

export const ShowMeRPC = createPluginRPC(PLUGIN_ID, () => import('./services'), ShowMeMessages.rpc)
