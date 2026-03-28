import { Dispatch, SetStateAction } from "react";

export type Controller<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
};
