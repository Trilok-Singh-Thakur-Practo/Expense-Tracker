-- Insert departments if they don't exist
INSERT INTO departments (id, name) 
VALUES (1, 'Engineering') 
ON CONFLICT DO NOTHING;

INSERT INTO departments (id, name) 
VALUES (2, 'Marketing') 
ON CONFLICT DO NOTHING;

INSERT INTO departments (id, name) 
VALUES (3, 'Finance') 
ON CONFLICT DO NOTHING;

INSERT INTO departments (id, name) 
VALUES (4, 'Human Resources') 
ON CONFLICT DO NOTHING; 