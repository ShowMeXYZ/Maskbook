import { useCallback } from 'react'
import { Box, Card, Typography, Button, Grid, Avatar } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useI18N } from '../../../utils'
import { useRemoteControlledDialog } from '@masknet/shared'
import { useTopics } from '../hooks/useTopics'
import { PluginShowMeMessages } from '../messages'
import { usePostLink } from '../../../components/DataSource/usePostInfo'
import { useAccount } from '@masknet/web3-shared-evm'

const useStyles = makeStyles()((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    logo: {
        textAlign: 'center',
        '& > *': {
            width: 'auto',
            height: 100,
        },
    },
    title: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        '& > :last-child': {
            marginTop: 4,
            marginLeft: 4,
        },
    },
    description: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    data: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    meta: {
        fontSize: 10,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        '& svg': {
            marginRight: theme.spacing(0.5),
        },
    },
    avatar: {
        width: theme.spacing(2),
        height: theme.spacing(2),
        margin: theme.spacing(0, 1),
    },
    buttons: {
        padding: theme.spacing(4, 0, 0),
    },
    verified: {
        borderRadius: 50,
    },
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': '4',
        '-webkit-box-orient': 'vertical',
    },
}))

export function PreviewCard({ clubUrl }: { clubUrl: string }) {
    const { t } = useI18N()
    const { classes } = useStyles()
    const account = useAccount()
    const { value, error, loading, retry } = useTopics(clubUrl, account)

    const postLink = usePostLink()
    const { setDialog: setTopicDialog } = useRemoteControlledDialog(PluginShowMeMessages.topicDialogUpdated)
    const onShowTopic = useCallback(() => {
        if (!value) return
        setTopicDialog({
            open: true,
            club: club,
            topics: value.topics,
            postLink,
        })
    }, [value, setTopicDialog])

    if (loading) return <Typography color="textPrimary">{t('loading')}</Typography>
    if (error)
        return (
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography color="textPrimary">{t('go_wrong')}</Typography>
                <Button sx={{ marginTop: 1 }} size="small" onClick={retry}>
                    {t('retry')}
                </Button>
            </Box>
        )
    if (!value) return null

    const club = value?.club

    // TODO Topic Preview UI Styles
    return (
        <Card variant="outlined" className={classes.root} elevation={0}>
            <div className={classes.logo}>
                <img src={club.club_background} />
            </div>
            <div className={classes.title}>
                <Typography variant="h6" color="textPrimary">
                    {club.club_name}
                </Typography>
                {club.club_identity === 200 ? <VerifiedUserIcon fontSize="small" color="primary" /> : null}
            </div>
            <div className={classes.description}>
                <Typography variant="body2" color="textSecondary" className={classes.text}>
                    {club.club_introduction}
                </Typography>
            </div>
            <div className={classes.data}>
                <div className={classes.meta}>
                    <QueryBuilderIcon fontSize="small" color="disabled" />
                    <Typography variant="body2" color="textSecondary">
                        Club Address {club.creator_address}
                    </Typography>
                </div>
                <div className={classes.meta}>
                    <Typography variant="body2" color="textSecondary">
                        Club Name
                    </Typography>
                    <Avatar alt={club.club_url} src={club.club_photo} className={classes.avatar} />
                    <Typography variant="body2" color="textSecondary">
                        {club.club_name}
                    </Typography>
                </div>
            </div>
            <Grid container className={classes.buttons} spacing={2}>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        color="primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://${club.club_url}.showme.fan`}>
                        To ShowMe
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" fullWidth color="primary" onClick={onShowTopic}>
                        View Topics
                    </Button>
                </Grid>
            </Grid>
        </Card>
    )
}
