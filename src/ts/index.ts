import Logger from "src/ts/logger";
import {
  checkApi,
  isNewAPIAvailable,
  processLiveMessage,
  processVoDMessage,
  setNewBadges
} from "src/ts/messageProcessor";
import * as api from "src/ts/api/api";
import * as Selectors from "src/ts/constants/selectors";

import "src/style/content.css";

const isVoD = () => /^\/videos\/\d+/.test(window.location.pathname);

const nodeParser = (node: Node) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }
  if (
    node.getAttribute("data-a-target") === "th-badge-cnt" ||
    node.classList.contains("s3Kir0") ||
    node.getAttribute("data-test-selector") ===
      "channel-leaderboard-container"
  ) {
    return;
  }

  if (
    node.getAttribute("data-test-selector") === "chat-line-message" ||
    node.classList.contains("chat-line__message")
  ) {
    // Logger.debug("LIVE MSG ", node);
    processLiveMessage(node);
  } else if (
    node.classList.contains("chat-line__message--badges") &&
    node.parentElement
  ) {
    // Logger.debug("LIVE MSG ", node)
    processLiveMessage(node.parentNode as HTMLElement);
  } else if (isVoD() && node.nodeName.toUpperCase() === "LI") {
    // Logger.debug("VOD MSG ", node);
    processVoDMessage(node);
  } else {
    // Logger.debug("uknown node:", node);
  }
};

const init = async () => {
  Logger.info("Checking for API");
  await checkApi();
  Logger.info(`New API status: ${isNewAPIAvailable() ? "RUNNING" : "OFFLINE"}`);
  Logger.info("Fetching TheHitless Badges");

  const badges = await api.getBadges();
  setNewBadges(badges);

  Logger.info("Fetched TheHitless Badges");

  const elm = document.querySelector(Selectors.ROOT);

  if (elm === null) {
    setTimeout(init, 1000);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(nodeParser);
      }
    });
  });
  const config = { childList: true, subtree: true };

  observer.observe(elm, config);
};

init();
