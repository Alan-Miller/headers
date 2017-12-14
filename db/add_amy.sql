INSERT INTO students (name)
SELECT 'Amy'
WHERE NOT EXISTS (
    SELECT * FROM students WHERE name = 'Amy'
);

SELECT * FROM students;