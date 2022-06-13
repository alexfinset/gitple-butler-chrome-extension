import { forEach, filter, toLower, map, toNumber, reduce } from "lodash";
import { DURATIONS } from "../consts";
import { IParsedColumnCard } from "../interfaces";

// ----------------------------------------------------------------------

export interface IParsedCard {
  id: string;
  isOptional: boolean;
  team: string;
  duration: number;
}

export interface ITeamDuration {
  team: string;
  total: number;
}

export interface IDurationTypesResult {
  requiredHours: ITeamDuration[];
  optionalHours: ITeamDuration[];
}

export interface IGithubProjectCard extends Element {
  dataset: {
    cardAuthor: string;
    cardAssignee: string;
    cardLabel: string;
    cardId: string;
    cardIs: string;
    cardState: string;
    cardType: string;
    cardTitle: string;
    channel: string;
    columnId: string;
    contentId: string;
    contentType: string;
    retainFocus: string;
    url: string;
  };
}

export function parseDuration(labels: Array<string>) {
  let duration = 0;
  forEach(labels, (label) => {
    if (DURATIONS.includes(label)) {
      duration = toNumber(label.replace("d", ""));
    }
  });
  return duration;
}

export function createDurationTypes(parsedCards: IParsedCard[]) {
  const requiredCards = filter(parsedCards, (card) => !card.isOptional);
  const optionalCards = filter(parsedCards, (card) => card.isOptional);

  return {
    requiredHours: getTeamHours(requiredCards),
    optionalHours: getTeamHours(optionalCards),
  };
}

export function getTeamHours(cards: IParsedCard[]): ITeamDuration[] {
  const hours = {} as Record<string, any>;
  forEach(cards, (card) => {
    if (!hours[card.team]) {
      hours[card.team] = [card.duration];
    } else {
      hours[card.team] = [...hours[card.team], card.duration];
    }
  });

  const result = map(hours, (vals, prop) => ({
    team: prop,
    total: reduce(vals, (acc, cur) => acc + cur, 0),
  }));

  return result;
}

export function createActualEstimation(
  cards: IParsedColumnCard[],
  teams: Array<string>
) {
  try {
    if (!cards.length) return {} as IDurationTypesResult;

    const newCards = [] as IParsedCard[];
    forEach(cards, (card) => {
      const [team] = filter(card.labels, (label) =>
        teams.includes(toLower(label))
      );

      if (team) {
        newCards.push({
          id: card.id,
          isOptional: card.isOptional,
          team,
          duration: parseDuration(card.labels),
        });
      }
    });

    // console.log("newCards ", newCards);
    return createDurationTypes(newCards);
  } catch (error) {
    return {} as IDurationTypesResult;
  }
}
