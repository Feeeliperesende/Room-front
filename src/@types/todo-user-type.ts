export interface TodoUserType {
  id: string;
  name: string;
  description: string | null;
  date: string;
  date_conclusion: string | null;
  status: "AWAITING" | "FINISHED" | "CANCELED";
  user_id: string;
  created_at: string;
  updated_at: string;
}
