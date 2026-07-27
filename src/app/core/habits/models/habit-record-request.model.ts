export interface HabitRecordRequest {
  recordDate: string;
  completedValue: number;
  notes?: string | null;
}
