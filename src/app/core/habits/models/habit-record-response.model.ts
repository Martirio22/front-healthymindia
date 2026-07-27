export interface HabitRecordResponse {
  id: number;
  habitId: number;
  userId: string;
  recordDate: string;
  completedValue: number;
  completed: boolean;
  notes: string | null;
}
