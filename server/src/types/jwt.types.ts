export interface JwtPayload {
  userId: string;
  role: "BORROWER" | "ADMIN";
}