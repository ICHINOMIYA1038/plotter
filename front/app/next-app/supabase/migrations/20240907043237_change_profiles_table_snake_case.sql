-- Up Migration
-- カラム名をスネークケースに変更
ALTER TABLE profiles
  RENAME COLUMN organizationName TO organization_name;

ALTER TABLE profiles
  RENAME COLUMN membershipPlan TO membership_plan;

ALTER TABLE profiles
  RENAME COLUMN isTrialUsed TO is_trial_used;

ALTER TABLE profiles
  RENAME COLUMN ageGroup TO age_group;
