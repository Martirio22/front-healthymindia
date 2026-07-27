import { HabitRecordResponse } from "../../habits/models/habit-record-response.model";

export interface RangeStatisticsResponse {
  startDate: string;
  endDate: string;
  totalRecords: number;
  completedRecords: number;
  overallPercentage: number;
  records: HabitRecordResponse[];
}
