import { assets } from "@/assets";
import { StaticDataItem } from "@/types/static-card-types";

export const static_data: StaticDataItem[] = [
  {
    prompt:
      "Show me flights to Tokyo and give me ideas of things to do. How about Seoul too?",
    icon: assets.FlightIcon,
  },
  {
    prompt: "Write a product description for a new type of toothbrush",
    icon: assets.WriteIcon,
  },
  {
    prompt:
      "Create a recipe for a low-carb meal with the following ingredients I have in my fridge: cauliflower, and cucumber",
    icon: assets.TableRestaurantIcon,
  },
  {
    prompt: "Explain what the keto diet is in simple terms",
    icon: assets.LightbulbIcon,
  },
];
