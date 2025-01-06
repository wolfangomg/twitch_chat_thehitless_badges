import * as Selectors from 'src/ts/constants/selectors'
import * as api from 'src/ts/api/api'
import { generateTHBadge } from 'src/ts/thehitlessBadge'
import { GetTHBadgesResponse } from './types/badges'

let newTHBadges: GetTHBadgesResponse
let _IsAPIAvailable = false

export const setNewBadges = (value: any) => {
  newTHBadges = value
}

export const checkApi = async () => {
  _IsAPIAvailable = await api.getHealthcheck()
  return _IsAPIAvailable
}

export const isNewAPIAvailable = () => _IsAPIAvailable

export const tagAsProcessed = (target: HTMLElement): boolean => {
  const isAlreadyTagged = target.hasAttribute(Selectors.LIVE_CHAT_TAG_TH)

  if (!isAlreadyTagged) {
    target.setAttribute(Selectors.LIVE_CHAT_TAG_TH, '')
  }

  return isAlreadyTagged
}

export const processVoDMessage = async (target: HTMLElement) => {
  if (tagAsProcessed(target)) {
    return
  }

  const token: string | null =
    target.getAttribute(Selectors.LIVE_CHAT_USER_ATTRIBUTE) ||
    target.getAttribute(Selectors.LIVE_CHAT_USER_ATTRIBUTE2)
  if (token !== null) {
    const user_ext = await api.getUser(token.toLowerCase())
    if (user_ext !== undefined) {
      const badges = target.querySelector(Selectors.VOD_CHAT_BADGES)

      if (badges === null) {
        return
      }

      badges.insertAdjacentHTML(
        'beforeend',
        generateTHBadge(
          newTHBadges[user_ext.userId.badge].name,
          newTHBadges[user_ext.userId.badge].url,
          user_ext.userId.name
        )
      )
    }
  }

  return target
}

export const processLiveMessage = async (target: HTMLElement) => {
  if (tagAsProcessed(target)) {
    return
  }

  const token: string | null =
    target.getAttribute(Selectors.LIVE_CHAT_USER_ATTRIBUTE) ||
    target.getAttribute(Selectors.LIVE_CHAT_USER_ATTRIBUTE2)
  if (token !== null) {
    const user_ext = await api.getUser(token.toLowerCase())
    if (user_ext !== undefined) {
      const badges = target.querySelector(
        `${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`
      )

      if (badges === null) {
        return
      }

      const badgeHTML = generateTHBadge(
        newTHBadges[user_ext.userId.badge].name,
        newTHBadges[user_ext.userId.badge].url,
        user_ext.userId.name
      )

      badges.insertAdjacentHTML('beforeend', badgeHTML)
    }
  }

  return target
}
