export interface ApiResponse<T> {
  statuscode: number;
  success: boolean;
  message: string;
  data: T;
}
export interface ApiGeneralResponse {
  statuscode: number;
  success: boolean;
  message: string;
}
