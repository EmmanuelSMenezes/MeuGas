export type Rating = 0 | 1 | 2 | 3 | 4 | 5

export interface PartnerRating {
  rating_id: string,
  user_id: string,
  rating_type_id: string,
  rating_value: Rating,
  note: string,
  partner_id: string,
}

export interface EvaluatePartnerProps {
  rating_value: Rating,
  note: string,
  branch_id: string,
  created_by: string
}
