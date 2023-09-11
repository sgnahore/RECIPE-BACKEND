REATE TYPE level as ENUM('Mild', 'Medium', 'Hot');

DROP TABLE IF EXISTS Recipes;



CREATE TABLE Recipes (
    recipe_id serial primary key ,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    allergen_free BOOLEAN NOT NULL,
    spice_level level,
    cooking_time_minutes INT NOT NULL,
  popular BOOLEAN 
);

INSERT INTO Recipes (name, cuisine, allergen_free, spice_level, cooking_time_minutes, popular)
VALUES
    ('Spaghetti Carbonara', 'Italian', true, 'Medium', 20, true),
    ('Chicken Tikka Masala', 'Indian', false, 'Medium', 30, true),
    ('Caesar Salad', 'American', true, 'Mild', 15, false),
    ('Sushi Rolls', 'Japanese', false, 'Mild', 25, true),
    ('Chili Con Carne', 'Mexican', false, 'Hot', 45, true),
    ('Pasta Alfredo', 'Italian', true, 'Mild', 25, false),
    ('Beef Stir-Fry', 'Chinese', false, 'Medium', 20, true),
    ('Vegetable Curry', 'Indian', true, 'Medium', 35, true),
    ('Taco Salad', 'Mexican', true, 'Medium', 15, false),
    ('Pad Thai', 'Thai', false, 'Hot', 30, true);


SELECT * FROM recipes;