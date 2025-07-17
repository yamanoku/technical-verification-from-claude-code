// TypeScript 5.9 Beta - Template Literal Types の強化例

// 1. Enhanced pattern matching with template literals
type ExtractRouteParams<T extends string> = T extends `${string}/:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractRouteParams<Rest>
  : T extends `${string}/:${infer Param}`
  ? { [K in Param]: string }
  : {};

// 使用例
type UserRoute = "/users/:id/posts/:postId";
type RouteParams = ExtractRouteParams<UserRoute>; // { id: string; postId: string }

// 2. Advanced string manipulation with better type narrowing
type Capitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

type PascalCase<S extends string> = S extends `${infer Word}_${infer Rest}`
  ? `${Capitalize<Word>}${PascalCase<Rest>}`
  : Capitalize<S>;

// 使用例
type DatabaseField = "user_name" | "created_at" | "updated_at";
type ModelProperty = PascalCase<DatabaseField>; // "UserName" | "CreatedAt" | "UpdatedAt"

// 3. SQL-like query builder with template literals
type SQLQuery<T extends string> = T extends `SELECT ${infer Fields} FROM ${infer Table}`
  ? {
      fields: Fields extends `${infer Field}, ${infer Rest}`
        ? [Field, ...SQLQuery<`SELECT ${Rest} FROM ${Table}`>["fields"]]
        : [Fields];
      table: Table;
    }
  : never;

// 使用例
type Query = SQLQuery<"SELECT id, name, email FROM users">;
// { fields: ["id", "name", "email"]; table: "users" }

// 4. Enhanced CSS-in-JS type safety
type CSSProperty = 
  | `margin-${"top" | "right" | "bottom" | "left"}`
  | `padding-${"top" | "right" | "bottom" | "left"}`
  | `border-${"width" | "style" | "color"}`;

type CSSValue<T extends CSSProperty> = T extends `margin-${string}` | `padding-${string}`
  ? `${number}px` | `${number}rem` | `${number}em`
  : T extends `border-width`
  ? `${number}px`
  : T extends `border-style`
  ? "solid" | "dashed" | "dotted"
  : T extends `border-color`
  ? `#${string}` | `rgb(${number}, ${number}, ${number})`
  : string;

// 使用例
type MarginValue = CSSValue<"margin-top">; // "1px" | "1rem" | "1em"
type BorderStyleValue = CSSValue<"border-style">; // "solid" | "dashed" | "dotted"

// 5. Advanced URL pattern matching
type ParseURL<T extends string> = T extends `${infer Protocol}://${infer Domain}${infer Path}`
  ? {
      protocol: Protocol;
      domain: Domain extends `${infer Host}:${infer Port}`
        ? { host: Host; port: Port }
        : { host: Domain; port: never };
      path: Path extends `/${infer PathSegments}`
        ? ParsePath<PathSegments>
        : never;
    }
  : never;

type ParsePath<T extends string> = T extends `${infer Segment}/${infer Rest}`
  ? [Segment, ...ParsePath<Rest>]
  : T extends ""
  ? []
  : [T];

// 使用例
type ParsedURL = ParseURL<"https://api.example.com:8080/v1/users/123">;
// {
//   protocol: "https";
//   domain: { host: "api.example.com"; port: "8080" };
//   path: ["v1", "users", "123"];
// }

// 6. Form validation with template literals
type EmailPattern = `${string}@${string}.${string}`;
type PhonePattern = `${number}-${number}-${number}`;

type ValidateField<T extends string, Pattern extends string> = T extends Pattern
  ? T
  : never;

// 使用例
type ValidEmail = ValidateField<"user@example.com", EmailPattern>; // "user@example.com"
type InvalidEmail = ValidateField<"invalid-email", EmailPattern>; // never

export {
  ExtractRouteParams,
  PascalCase,
  SQLQuery,
  CSSValue,
  ParseURL,
  ValidateField,
  type RouteParams,
  type ModelProperty,
  type Query,
  type MarginValue,
  type BorderStyleValue,
  type ParsedURL,
  type ValidEmail,
  type EmailPattern,
  type PhonePattern
};