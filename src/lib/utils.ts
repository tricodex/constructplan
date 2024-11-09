// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GenericObject = Record<string, unknown>;

export function isObject(item: unknown): item is GenericObject {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

export function deepMerge<T extends GenericObject>(target: T, source: GenericObject): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          (output as GenericObject)[key] = deepMerge({ ...(target[key] as GenericObject) }, source[key] as GenericObject);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}