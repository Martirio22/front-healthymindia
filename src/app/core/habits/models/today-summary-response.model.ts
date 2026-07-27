import { HabitRecordResponse } from "./habit-record-response.model";

export interface TodaySummaryResponse {
  date: string;
  totalHabits: number;
  completedHabits: number;
  progress: number;
  records: HabitRecordResponse[];
}
