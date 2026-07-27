import { HabitCategory } from "./habit-category.enum";

export interface HabitRequest {
  name: string;
  category: HabitCategory;
  goal: number;
  unit: string;
}
