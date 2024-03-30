## DB

Using Postgres
Not have auto migration, must be create db and table

### QUERY TABLE DATABASE

-- migration_1.sql
CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
age INTEGER
hobby_id INTEGER
);

-- migration_2.sql
CREATE TABLE hobbies (
hobby_id SERIAL PRIMARY KEY,
hobby_name VARCHAR(100) NOT NULL,
is_active BOOLEAN NOT NULL
);

### JWT_SECRET_KEY

example=N0mIN4gAM35
