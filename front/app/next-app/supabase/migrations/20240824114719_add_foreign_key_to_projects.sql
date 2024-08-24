-- Add foreign key to user_id in projects table
ALTER TABLE projects
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;