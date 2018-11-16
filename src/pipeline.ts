import { ITimberLog } from "./types";

export async function preProcess(log: ITimberLog): Promise<ITimberLog> {
  return {
    date: new Date(),
    ...log
  };
}

export async function sync(log: ITimberLog): Promise<ITimberLog> {
  return new Promise<ITimberLog>(resolve => {
    setTimeout(() => {
      resolve(log);
    }, 500);
  });
}
