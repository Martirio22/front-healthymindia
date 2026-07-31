import { HabitCategory } from "./habit-category.enum";

export interface HabitResponse {
  id: number;
  userId: string;
  name: string;
  category: HabitCategory;
  goal: number;
  unit: string;
  day: string;
  active: boolean;
  createdAt: string;
}
