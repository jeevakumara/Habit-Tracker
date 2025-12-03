import { differenceInDays, parseISO } from 'date-fns';

export class ChallengeConfig {
    constructor() {
        this.startDate = parseISO(process.env.CHALLENGE_START_DATE || '2025-12-01');
        this.endDate = parseISO(process.env.CHALLENGE_END_DATE || '2026-02-28');
        this.totalDays = differenceInDays(this.endDate, this.startDate) + 1;
    }

    getDayNumber(date) {
        return differenceInDays(parseISO(date), this.startDate) + 1;
    }

    getMetadata() {
        return {
            startDate: this.startDate.toISOString(),
            endDate: this.endDate.toISOString(),
            totalDays: this.totalDays,
        };
    }
}

export const challengeConfig = new ChallengeConfig();
