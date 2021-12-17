import { createPluginMessage, PluginMessageEmitter, createPluginRPC } from '@masknet/plugin-infra'
import { SHOWME_PLUGIN_ID } from './constants'
import type { Club, Topic } from './types'

type TopicDialogUpdated =
    | {
          open: true
          club: Club
          topics: Topic[]
          postLink: string | URL
      }
    | {
          open: false
      }

interface ShowMeMessages {
    /**
     * Open topic dialog
     */
    topicDialogUpdated: TopicDialogUpdated

    rpc: unknown
}

export const PluginShowMeMessages: PluginMessageEmitter<ShowMeMessages> = createPluginMessage(SHOWME_PLUGIN_ID)
export const PluginShowMeRPC = createPluginRPC(SHOWME_PLUGIN_ID, () => import('./services'), PluginShowMeMessages.rpc)
