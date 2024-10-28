/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Pages {
  body: Json;
  created_at: Generated<Timestamp>;
  created_by: string;
  database_id: string;
  page_id: string;
  updated_at: Generated<Timestamp>;
  updated_by: string;
}

export interface Properties {
  created_at: Generated<Timestamp>;
  field_id: string;
  page_id: string;
  type: string;
  updated_at: Generated<Timestamp>;
  value: Json;
}

export interface DB {
  pages: Pages;
  properties: Properties;
}