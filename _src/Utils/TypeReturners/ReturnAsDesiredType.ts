export const ReturnAsDesiredType = <T extends any>(
  data: T,
  desiredType: "string" | "boolean"
): T | "NOT_BOOLEAN" | "" => {
  if (desiredType === "string") {
    return typeof data === "string" ? data : "";
  }
  if (desiredType === "boolean") {
    return typeof data === "boolean" ? data : "NOT_BOOLEAN";
  }

  return "";
};
