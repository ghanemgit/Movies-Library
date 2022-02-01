DROP TABLE IF EXISTS movietable;

CREATE TABLE IF NOT EXISTS movietable (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(10000),
    comment VARCHAR(255)
    
);