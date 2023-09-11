import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";

dotenv.config(); //Read .env file lines as though they were env vars.

const client = new Client({
    connectionString: process.env.LOCAL_DATABASE_URL,
});

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (_req, res) => {
    res.json({ msg: "Hello! There's nothing interesting for GET /" });
});
app.get("/recipes", async (_req, res) => {
    try {
        const sqlQuery = "SELECT * FROM Recipes";
        const response = await client.query(sqlQuery);
        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.get<{ id: string }>("/recipes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const sqlQuery = "SELECT * FROM Recipes WHERE recipe_id = $1";
        const values = [id];
        const response = await client.query(sqlQuery, values);
        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.post<{}>("/recipes", async (req, res) => {
    try {
        const {
            name,
            cuisine,
            allergen_free,
            spice_level,
            cooking_time_minutes,
            popular,
        } = req.body;

        if (spice_level === null || spice_level === undefined) {
            return res.status(400).json({ error: "spice_level is required" });
        }

        const insertQuery =
            "INSERT INTO Recipes (name, cuisine, allergen_free, spice_level, cooking_time_minutes, popular) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        const values = [
            name,
            cuisine,
            allergen_free,
            spice_level,
            cooking_time_minutes,
            popular,
        ];

        const response = await client.query(insertQuery, values);
        console.log(response);
        console.log(values);
        res.status(201).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.delete<{ id: string }>("/recipes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = "delete from recipes where recipe_id = $1";
        const values = [id];
        await client.query(query, values);
        res.status(201).json(`recipe ${id} has been deleted`);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.put<{ id: string }>("/recipes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {
            name,
            cuisine,
            allergen_free,
            spice_level,
            cooking_time_minutes,
            calorie_count,
            popular,
        } = req.body;

        const updateQuery =
            "UPDATE Recipes SET name = $2, cuisine = $3, allergen_free = $4, spice_level = $5, cooking_time_minutes = $6, calorie_count = $7, popular = $8 WHERE recipe_id = $1 RETURNING *";

        const values = [
            id,
            name,
            cuisine,
            allergen_free,
            spice_level,
            cooking_time_minutes,
            calorie_count,
            popular,
        ];

        const response = await client.query(updateQuery, values);
        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
