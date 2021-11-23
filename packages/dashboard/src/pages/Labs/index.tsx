import { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { makeStyles, MaskColorVar } from '@masknet/theme'
import { PageFrame } from '../../components/PageFrame'
import PluginItem from './components/PluginItem'
import {
    FileServiceIcon,
    MarketsIcon,
    RedPacketIcon,
    SwapServiceIcon,
    TransakIcon,
    SnapshotIcon,
    MarketTrendIcon,
    CollectiblesIcon,
    GitcoinIcon,
    ValuablesIcon,
    DhedgeIcon,
    PetIcon,
} from '@masknet/icons'
import { useDashboardI18N } from '../../locales'
import MarketTrendSettingDialog from './components/MarketTrendSettingDialog'
import SwapSettingDialog from './components/SwapSettingDialog'
import { useAccount } from '@masknet/web3-shared-evm'
import { PluginMessages } from '../../API'
import { useRemoteControlledDialog } from '@masknet/shared'
import { Services } from '../../API'
import { PLUGIN_IDS, TUTORIAL_URLS_CN, TUTORIAL_URLS_EN } from './constants'
import { useLocation } from 'react-router-dom'
import { ContentContainer } from '../../components/ContentContainer'
import { useLanguage } from '../Settings/api'
import { WalletStateBar } from '../Wallets/components/WalletStateBar'

const useStyles = makeStyles()((theme) => ({
    root: {
        flex: 1,
        borderRadius: Number(theme.shape.borderRadius) * 3,
        backgroundColor: MaskColorVar.primaryBackground,
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    list: {
        display: 'flex',
        '& >*': {
            flex: 1,
        },
    },
}))

export default function Plugins() {
    const t = useDashboardI18N()
    const { classes } = useStyles()
    const location = useLocation()
    const [openTrendSetting, setOpenTrendSetting] = useState(false)
    const [openSwapSetting, setOpenSwapSetting] = useState(false)
    const [pluginStatus, setPluginStatus] = useState({
        [PLUGIN_IDS.FILE_SERVICE]: true,
        [PLUGIN_IDS.GITCOIN]: true,
        [PLUGIN_IDS.DHEDGE]: true,
        [PLUGIN_IDS.RED_PACKET]: true,
        [PLUGIN_IDS.TRANSAK]: true,
        [PLUGIN_IDS.COLLECTIBLES]: true,
        [PLUGIN_IDS.SWAP]: true,
        [PLUGIN_IDS.SNAPSHOT]: true,
        [PLUGIN_IDS.MARKETS]: true,
        [PLUGIN_IDS.VALUABLES]: true,
        [PLUGIN_IDS.MARKET_TREND]: true,
    })

    const language = useLanguage()

    const account = useAccount()
    const { setDialog: setBuyDialog } = useRemoteControlledDialog(PluginMessages.Transak.buyTokenDialogUpdated)
    const openTransakDialog = useCallback(
        (code?: string) => {
            setBuyDialog({
                open: true,
                address: account,
                code,
            })
        },
        [account],
    )

    const { openDialog: openSwapDialog } = useRemoteControlledDialog(PluginMessages.Swap.swapDialogUpdated)

    async function onSwitch(id: string, checked: boolean) {
        await Services.Settings.setPluginEnabled(id, checked)
        setPluginStatus({ ...pluginStatus, [id]: checked })
    }

    function onSetting(id: string) {
        if (id === PLUGIN_IDS.MARKET_TREND) {
            setOpenTrendSetting(true)
        } else if (id === PLUGIN_IDS.SWAP) {
            setOpenSwapSetting(true)
        }
    }

    function onTutorial(id: string) {
        const url = language.includes('zh') ? TUTORIAL_URLS_CN[id] : TUTORIAL_URLS_EN[id]
        if (url) {
            window.open(url)
        }
    }

    useEffect(() => {
        Object.values(PLUGIN_IDS).forEach(async (id) => {
            const enabled = await Services.Settings.getPluginEnabled(id)
            setPluginStatus((status) => ({ ...status, [id]: enabled }))
        })
    }, [])

    useEffect(() => {
        const search = new URLSearchParams(location.search)
        const open = search.get('open')
        const code = search.get('code')

        if (open === 'Transak') {
            openTransakDialog(code ?? '')
        } else if (open === 'Swap') {
            openSwapDialog()
        }
    }, [location.search, openTransakDialog, openSwapDialog])

    return (
        <PageFrame title={t.labs()} primaryAction={<WalletStateBar />}>
            <ContentContainer>
                <Box className={classes.root}>
                    <Box className={classes.list}>
                        <PluginItem
                            id={PLUGIN_IDS.FILE_SERVICE}
                            title={t.labs_file_service()}
                            desc={t.labs_file_service_desc()}
                            icon={<FileServiceIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.FILE_SERVICE]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.MARKETS}
                            title={t.labs_markets()}
                            desc={t.labs_markets_desc()}
                            icon={<MarketsIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.MARKETS]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.RED_PACKET}
                            title={t.labs_red_packet()}
                            desc={t.labs_red_packet_desc()}
                            icon={<RedPacketIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.RED_PACKET]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                    </Box>
                    <Box className={classes.list}>
                        <PluginItem
                            id={PLUGIN_IDS.SWAP}
                            title={t.labs_swap()}
                            desc={t.labs_swap_desc()}
                            enabled={pluginStatus[PLUGIN_IDS.MARKET_TREND]}
                            onSwitch={onSwitch}
                            onSetting={onSetting}
                            onTutorial={onTutorial}
                            icon={<SwapServiceIcon />}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.TRANSAK}
                            title={t.labs_transak()}
                            desc={t.labs_transak_desc()}
                            icon={<TransakIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.TRANSAK]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.PETS}
                            title={t.labs_pets()}
                            desc={t.labs_pets_desc()}
                            icon={<PetIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.PETS]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                    </Box>
                    <Box className={classes.list}>
                        <PluginItem
                            id={PLUGIN_IDS.SNAPSHOT}
                            title={t.labs_snapshot()}
                            desc={t.labs_snapshot_desc()}
                            icon={<SnapshotIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.SNAPSHOT]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.MARKET_TREND}
                            title={t.labs_market_trend()}
                            desc={t.labs_market_trend_desc()}
                            icon={<MarketTrendIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.MARKET_TREND]}
                            onSetting={onSetting}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.COLLECTIBLES}
                            title={t.labs_collectibles()}
                            desc={t.labs_collectibles_desc()}
                            icon={<CollectiblesIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.COLLECTIBLES]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                    </Box>
                    <Box className={classes.list}>
                        <PluginItem
                            id={PLUGIN_IDS.GITCOIN}
                            title={t.labs_gitcoin()}
                            desc={t.labs_gitcoin_desc()}
                            icon={<GitcoinIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.GITCOIN]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.VALUABLES}
                            title={t.labs_valuables()}
                            desc={t.labs_valuables_desc()}
                            icon={<ValuablesIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.VALUABLES]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                        <PluginItem
                            id={PLUGIN_IDS.DHEDGE}
                            title={t.labs_dhedge()}
                            desc={t.labs_dhedge_desc()}
                            icon={<DhedgeIcon />}
                            enabled={pluginStatus[PLUGIN_IDS.DHEDGE]}
                            onSwitch={onSwitch}
                            onTutorial={onTutorial}
                        />
                    </Box>
                </Box>
            </ContentContainer>

            <SwapSettingDialog open={openSwapSetting} onClose={() => setOpenSwapSetting(false)} />
            <MarketTrendSettingDialog open={openTrendSetting} onClose={() => setOpenTrendSetting(false)} />
        </PageFrame>
    )
}
