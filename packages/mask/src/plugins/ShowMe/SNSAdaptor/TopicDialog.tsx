import { useState } from 'react'
import { makeStyles, useStylesExtends } from '@masknet/theme'
import { useI18N } from '../../../utils'
import { ShowMeMessages } from '../messages'
import { useRemoteControlledDialog } from '@masknet/shared'
import type { Club, Topic } from '../types'
import { InjectedDialog } from '../../../components/shared/InjectedDialog'

const useStyles = makeStyles()((theme) => ({
    paper: {
        width: '450px !important',
    },
    root: {
        margin: theme.spacing(2, 0),
    },
}))

export interface DonateDialogProps extends withClasses<never> {}

export function TopicDialog(props: DonateDialogProps) {
    const classes = useStylesExtends(useStyles(), props)
    const { t } = useI18N()
    const [club, setClub] = useState<Club | null>(null)
    const [topics, setTopics] = useState<Topic[] | null>(null)
    const [postLink, setPostLink] = useState<string | URL | null>(null)

    const { open, closeDialog: onCloseDialog } = useRemoteControlledDialog(ShowMeMessages.topicDialogEvent, (ev) => {
        if (!ev.open) return
        setClub(ev.club!)
        setTopics(ev.topics!)
        setPostLink(ev.postLink!)
    })

    return (
        <div className={classes.root}>
            <InjectedDialog open={open} onClose={onCloseDialog} title="Topic Dialog UI Styles" maxWidth="xs">
                <span>TODO Topic Dialog UI Styles</span>
                <div>
                    <p>{club?.club_name}</p>
                    <img src={club?.club_background} alt="" />
                </div>
                <div>
                    <div>
                        {topics?.map((t, i) => (
                            <p key={i.toString()}>{t.content}</p>
                        ))}
                    </div>
                    <p>{postLink}</p>
                </div>
                <p>{t('plugin_gitcoin_readme_fund_link')}</p>
            </InjectedDialog>
        </div>
    )
}
