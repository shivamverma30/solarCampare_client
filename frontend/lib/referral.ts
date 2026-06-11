export const REFERRAL_PROMPT_EVENT = "solar-referral-prompt";

export type ReferralRewardSlab = {
  label: string;
  reward: string;
  minimum: number;
  maximum?: number;
};

export const REFERRAL_REWARD_SLABS: ReferralRewardSlab[] = [
  { label: "1-5 Referrals", reward: "₹1500 Amazon Voucher", minimum: 1, maximum: 5 },
  { label: "5-15 Referrals", reward: "₹2500 Amazon Voucher", minimum: 5, maximum: 15 },
  { label: "15+ Referrals", reward: "₹4000 Amazon Voucher", minimum: 15 },
];
