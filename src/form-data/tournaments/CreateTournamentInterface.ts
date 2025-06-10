export interface CreateTournamentInterface {
  eventName: string;
  playerInfo: string;
  registrationStart: Date | null;
  registrationEnd: Date | null;
  tournamentStart: Date | null;
  tournamentEnd: Date | null;
  eligiblePlayers: string;
  maxCategoriesPerPlayer: number;
  paymentMethod: string;
  prizeValue: string;
  registrationFeeType: string;
  registrationFee1: number;
  registrationFee2: number;
  registrationFee3: number;
  registrationFee4: number;
  paymentDeadline: string;
  tournamentLocation: string;
  teamId: string;
  contactEmail: string;
  contactPhone: string;
  scoreReporter: string;
  waitlistInfo: string;
  preRegistrationInfo: string;
  postRegistrationInfo: string;
  prizeDescription: string;
  tournamentRules: string;
}