export type T_ErrorsStatusCodeKeys = "done";

export const DoneStatusCode: Record<
  T_ErrorsStatusCodeKeys,
  {
    internalStatusCode: number;
    standardStatusCode: number;
  }
> = {
  done: {
    internalStatusCode: 600,
    standardStatusCode: 200,
  },
};
