import * as Selectors from "src/ts/constants/selectors";
import * as api from "src/ts/api/api";
import { generateTHBadge } from "src/ts/thehitlessBadge";
import { GetTHBadgesResponse } from "./types/badges";

let newTHBadges: GetTHBadgesResponse;
let _IsAPIAvailable = false;

export const setNewBadges = (value: any) => {
  newTHBadges = value;
};

export const checkApi = async () => {
  _IsAPIAvailable = await api.getHealthcheck();
  return _IsAPIAvailable;
};

export const isNewAPIAvailable = () => _IsAPIAvailable;

export const tagAsProcessed = (target: HTMLElement) => {
  if (target.getAttribute("thehitless") === null) {
    target.setAttribute("thehitless", "");
    return false;
  } else {
    return true;
  }
};

export const processVoDMessage = async (
  target: HTMLElement
): Promise<HTMLElement> => {
  if (tagAsProcessed(target)) {
    return target;
  }

  // const userElm: HTMLElement | null = target.querySelector(
  //   Selectors.VOD_CHAT_USERNAME
  // );
  // if (userElm === null) {
  //   return target;
  // }

  const token: string | null = target.getAttribute("data-user-id");
  if (token !== null) {
    const user_ext = await api.getUser(token.toLowerCase());
    if (user_ext !== undefined) {
      const badges = target.querySelector(Selectors.VOD_CHAT_BADGES);
      console.log("lo tenemos", badges, newTHBadges, user_ext.userId.badge);

      if (badges === null) {
        return target;
      }

      badges.insertAdjacentHTML(
        "beforeend",
        generateTHBadge(
          newTHBadges[user_ext.userId.badge].name,
          newTHBadges[user_ext.userId.badge].url,
          user_ext.userId.name
        )
      );
    }
  }

  return target;
};

export const processLiveMessage = async (
  target: HTMLElement
): Promise<HTMLElement> => {
  if (tagAsProcessed(target)) {
    return target;
  }

  // const userElm: HTMLElement | null =
  //   target.querySelector(Selectors.LIVE_CHAT_DISPLAY_NAME) ||
  //   target.querySelector(Selectors.FFZ.LIVE_CHAT_DISPLAY_NAME);
  // if (userElm === null) {
  //   return target;
  // }
  const token = target.getAttribute("data-user-id");
  console.log("token", token);
  if (token !== null) {
    const user_ext = await api.getUser(token.toLowerCase());
    console.log("user_ext", user_ext);
    if (user_ext !== undefined) {
      const badges = target.querySelector(
        `${Selectors.LIVE_CHAT_BADGES},${Selectors.FFZ.LIVE_CHAT_BADGES}`
      );
      console.log("lo tenemos", badges, newTHBadges, user_ext.userId.badge);

      if (badges === null) {
        return target;
      }

      const badgeHTML = generateTHBadge(
        newTHBadges[user_ext.userId.badge].name,
        newTHBadges[user_ext.userId.badge].url,
        user_ext.userId.name
      )

      badges.insertAdjacentHTML("beforeend", badgeHTML);
    }
  }

  return target;
};
