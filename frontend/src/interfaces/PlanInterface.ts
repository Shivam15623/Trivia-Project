import { ApiResponse } from "./GenericResponse";

export interface CreatePlanRequest {
    name: string;
    price: number;
    gamesIncluded: number;
    promoCodeSupport: boolean;
    color: string;
  }
  export interface Plan {
    _id: string; // Mongoose generated ID
    name: string;
    price: number;
    gamesIncluded: number; // This represents the number of games included
    promoCodeSupport: boolean;
    isActive: boolean;
    color: string;
    createdAt: string;
    updatedAt: string;
  }
  export type AllPlanresponse=ApiResponse<Plan[]>
  export type PlanbyIdresponse=ApiResponse<Plan>