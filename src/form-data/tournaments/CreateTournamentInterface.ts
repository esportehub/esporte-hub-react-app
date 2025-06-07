export interface CreateTournamentInterface {
  eventName: string;
  playerInfo: string;
  registrationStart: Date | null;
  registrationEnd: Date | null;
  tournamentStart: Date | null;
  tournamentEnd: Date | null;
  eligiblePlayers: string;
  maxCategoriesPerPlayer: string;
  paymentMethod: string;
  registrationFeeType: string;
  registrationFees: string[];
  paymentDeadline: string;
  tournamentLocation: string;
  teamId: string;
  contactEmail: string;
  contactPhone: string;
  preRegistrationInfo: string;
  postRegistrationInfo: string;
  prizeDescription: string;
  prizeValue: string;
  tournamentRules: string;
}
