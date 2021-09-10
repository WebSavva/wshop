import { IRequestInfo } from "./Request";

export interface IHttpState<FetchedTypeData> {
  isFetching: boolean;
  error: string | null;
  fetchedData: FetchedTypeData | null;
}

export interface fetchCb<FetchedTypeData> {
  (data: FetchedTypeData): void;
}

export type fetchFunc<FetchedTypeData> = (
  requestInfo: IRequestInfo,
  cb?: fetchCb<FetchedTypeData>
) => void;

export type actionType<FetchedTypeData> =
  | {
      type: "FETCHING";
    }
  | {
      type: "SUCCESS";
      payload: {
        data: FetchedTypeData;
      };
    }
  | {
      type: "ERROR";
      payload: {
        errorMessage: string;
      };
    };
