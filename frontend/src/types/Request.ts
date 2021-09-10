export interface IRequestInfo {
  url: string;
  config: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: string | BodyInit;
    headers?: {
      [field: string]: string;
    };
  };
}
