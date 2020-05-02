

DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_in_cents INTEGER NOT NULL,
  thumbnail_image_url TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  posted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deactivated_at TIMESTAMP,
  sold_at TIMESTAMP
)
