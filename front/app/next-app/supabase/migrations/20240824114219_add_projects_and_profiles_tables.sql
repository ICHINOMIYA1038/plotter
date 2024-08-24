-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  oid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  name TEXT,
  description TEXT,
  createdAt TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  fullName TEXT,
  createdAt TIMESTAMPTZ DEFAULT now()
);
