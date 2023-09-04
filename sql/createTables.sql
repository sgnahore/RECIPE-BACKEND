DROP TABLE IF EXISTS Recipes;

CREATE TYPE level as ENUM('Mild', 'Medium', 'Hot');

CREATE TABLE Recipes (
    recipe_id serial primary key,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(50),
    allergen_free BOOLEAN,
    spice_level level,
    cooking_time_minutes INT,
    calorie_count INT,
  popular BOOLEAN
);

INSERT INTO Recipes (name, cuisine, allergen_free, spice_level, cooking_time_minutes, calorie_count, popular) VALUES
    ('Spaghetti Bolognese', 'Italian', false, 'Medium', 45, 500, true),
    ('Chicken Tikka Masala', 'Indian', false, 'Medium', 60, 600, true),
    ('Vegetable Stir-Fry', 'Asian', true, 'Mild', 30, 400, false),
    ('Grilled Salmon', 'Seafood', true, 'Mild', 20, 350, true),
    ('Beef Tacos', 'Mexican', false, 'Hot', 40, 550, false),
    ('Mushroom Risotto', 'Italian', true, 'Mild', 35, 450, false),
    ('Chili Con Carne', 'Mexican', false, 'Hot', 50, 700, true),
    ('Thai Green Curry', 'Asian', false, 'Hot', 55, 650, true),
    ('Caprese Salad', 'Italian', true, 'Mild', 15, 250, false),
    ('Vegan Pad Thai', 'Asian', true, 'Medium', 40, 500, false);


SELECT * FROM recipes;


select * from Recipes where recipe_id = 3;

delete from recipes where recipe_id = 11;