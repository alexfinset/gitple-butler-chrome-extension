export interface Member {
  name: string;
  workHours: string;
  vacationHours: string;
}

export interface ISettings {
  totalDays: string;
  buffer: string;
  teams: Array<string>;
  members: Record<string, Member[]>;
}

export type DOMMessage = {
  type: "GET_DOM";
};

export type DOMMessageResponse = {
  cards: IParsedColumnCard[];
};

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

export interface IParsedColumnCard {
  id: string;
  isOptional: boolean;
  labels: Array<string>;
}
