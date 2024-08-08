import { z } from "zod";
import { User, UserValidator } from "../types/users";
import { GetTHBadgesResponseValidator } from "../types/badges";

const userFetchingCache: Record<string, Promise<User | undefined>> = {};

export const get = async <T>(
  endpoint: string,
  validator: z.ZodType<T> = z.any(),
  init?: RequestInit
) => {
  const url = new URL("https://thehitless.com/api");

  url.pathname = `${url.pathname}${
    endpoint[0] === "/" ? endpoint : `/${endpoint}`
  }`;

  try {
    const res = await fetch(url.toString(), init);

    const resJson = await res.json();

    const validation = validator.safeParse(resJson);
    if (!validation.success) {
      return undefined;
    } else {
      return validation.data;
    }
  } catch {
    return undefined;
  }
};

export const getHealthcheck = async () => {
  try {
    const res = await get(
      "/health",
      z.object({
        status: z.literal("OK").or(z.literal("OFFLINE")).or(z.literal("ERROR")),
      })
    );

    if (res === undefined) {
      return false;
    }

    const isReady = res.status === "OK";
    return isReady;
  } catch {
    return false;
  }
};

export const getBadges = async () => {
  const res = await get<any[]>("/badges");
  const obj = res ? res.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {}) : {}
  return obj;
};

export const getUser = async (username: string) => {
  if (userFetchingCache[username] !== undefined) {
    return await userFetchingCache[username];
  }

  const promise = new Promise<User | undefined>(async (res, rej) => {
    try {
      const response = await get(
        "/users/browser-ext/" + username,
        UserValidator
      );

      res(response);
    } catch (ex) {
      rej(ex);
    }
  });

  userFetchingCache[username] = promise;

  setTimeout(() => {
    delete userFetchingCache[username];
  }, 15 * 60 * 1000);

  return await promise;
};
