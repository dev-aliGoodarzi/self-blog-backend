// Formats
import { formats } from "../../Formats/formats";
// Formats

export const IsValidDate = (dateString: string) => {
  const pattern = formats.date;

  if (!pattern.test(dateString)) {
    return false;
  }

  return true;
};
