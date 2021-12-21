// ShowMe Types

export interface ClubExtra {
    website?: string
    twitter?: string
    discord?: string
    telegram?: string
    medium?: string
    youtube?: string
    instagram?: string
    facebook?: string
}

export interface ClubCriteria {
    subscription_type: number
    subscription_duration: number
    contract_address: string
    amount: number
    payment_contract_address: string
    payment_amount: number
}

export interface ClubCard {
    card_name: string
    card_image: string
    card_logo: string
    config: string
}

export interface ClubContract {
    contract_address: string
    nft_chain: string
}

export interface TopicReplies {
    id: number
    topic_id: number
    reply_address: string
    reply_username: string
    reply_photo: string
    reply_identity: number
    reply_is_club_owner: boolean
    to_reply_id: number
    to_reply_address: string
    to_reply_username?: string | null
    content: string
    extra: {}
    like_count: number
    reply_count: number
    user_like: boolean
    status: number
    create_time: string
}

export interface Club {
    creator_address: string
    club_name: string
    club_url: string
    club_photo: string
    club_background: string
    club_introduction: string
    club_extra: ClubExtra
    club_identity: number
    club_criteria: ClubCriteria
    club_card: ClubCard
    club_contract: ClubContract
    subscriber_amount: number
    duration: number
    status: 'active' | 'pending'
}

export interface Topic {
    id: number
    poster_address: string
    poster_username: string
    poster_photo: string
    poster_identity: number
    poster_is_club_owner: boolean
    content: string
    like_count: number
    reply_count: number
    user_like: boolean
    user_reply: boolean
    extra: { images?: string[] }
    status: number
    visible: number
    pinned: boolean
    create_time: string
    latest_replies: TopicReplies[]
}

export interface Response<T> {
    success: boolean
    error_code?: number
    error_message?: string
    result?: T
}

export interface TopicDialogEvent {
    open: boolean
    club?: Club
    topics?: Topic[]
    postLink?: string | URL
}
