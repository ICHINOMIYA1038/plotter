-- Up Migration
ALTER TABLE profiles
  RENAME COLUMN fullName TO nickname;

ALTER TABLE profiles
  ALTER COLUMN nickname SET NOT NULL;

ALTER TABLE profiles
  ADD COLUMN organizationName TEXT;

CREATE TYPE membership_plan AS ENUM ('Free', 'Paid', 'Trial', 'Withdrawn');
ALTER TABLE profiles
  ADD COLUMN membershipPlan membership_plan NOT NULL DEFAULT 'Free';

ALTER TABLE profiles
  ADD COLUMN isTrialUsed BOOLEAN DEFAULT false;

ALTER TABLE profiles
  ADD COLUMN gender TEXT;

CREATE TYPE age_group AS ENUM ('teens', 'twenties', 'thirties', 'forties', 'fifties', 'sixties_plus', 'unknown');
ALTER TABLE profiles
  ADD COLUMN ageGroup age_group
