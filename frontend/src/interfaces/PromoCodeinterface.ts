import { ApiResponse } from "./GenericResponse";

export interface AddPromoCode {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  expiryDate: Date;
  usageLimit: number;
}
export interface PromoCode {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  expiryDate: string; // ISO date string
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface validatePromoData {
  discountAmount: number;
  discountType: "percentage" | "flat";
}
export interface validatereq {
  code: string;
}

export type AllPromoCodeResponse = ApiResponse<PromoCode[]>;
export type ValidatePromoResponse = ApiResponse<validatePromoData>;
export type PromoCodebyIdResponse = ApiResponse<PromoCode>;
