import { HabitRecordResponse } from "../../habits/models/habit-record-response.model";

export interface DailyStatisticsResponse {
  date: string;
  totalHabits: number;
  completedHabits: number;
  completionPercentage: number;
  records: HabitRecordResponse[];
}
