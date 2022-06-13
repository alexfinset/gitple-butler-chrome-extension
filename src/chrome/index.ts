import {
  DOMMessage,
  DOMMessageResponse,
  IGithubProjectCard,
  IParsedColumnCard,
} from "../interfaces";
import { GITHUB_PROJECT } from "../consts";

// ----------------------------------------------------------------------

const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log("[Chrome] received", msg);
  const response: DOMMessageResponse = {
    cards: parseColumnCards(document.activeElement),
  };
  console.log("[Chrome] response", response);
  sendResponse(response);
};

function parseColumnCards(activeElement: Element | null) {
  const parsedCards = [] as IParsedColumnCard[];
  try {
    if (!activeElement) return parsedCards;

    if (!activeElement.classList.contains(GITHUB_PROJECT.PROJECT_COL)) {
      return parsedCards;
    }

    const domCards = Array.from(
      activeElement.querySelectorAll(GITHUB_PROJECT.COL_CARDS)
    ) as IGithubProjectCard[];

    if (!domCards?.length) return [];

    domCards.forEach((domCard) => {
      const cardType = JSON.parse(domCard.dataset.cardType) as Array<
        "note" | "issue"
      >;

      if (cardType.includes("issue")) {
        const labels = JSON.parse(domCard.dataset.cardLabel) as Array<string>;
        const lowerCaseLabels = labels.map((l) => l.toLocaleLowerCase());
        parsedCards.push({
          id: domCard.dataset.cardId,
          isOptional: lowerCaseLabels.includes("optional"),
          labels: lowerCaseLabels,
        });
      }
    });

    return parsedCards;
  } catch (error) {
    return [];
  }
}
/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome?.runtime?.onMessage?.addListener(messagesFromReactAppListener);
