import { WeekDay } from "./week-day.enum";

export interface WeeklyStatisticsResponse {
  userId: string;
  averageCompletionRate: number;
  dailyStatus: Record<WeekDay, boolean>;
}
