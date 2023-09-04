import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (_req, res) => {
    res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/recipes", async (_req, res) => {
    try {
        const sqlQuery = "SELECT * FROM Recipes ";
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
            calorie_count,
            popular,
        } = req.body;
        const insertQuery =
            "INSERT INTO Recipes (name, cuisine, allergen_free, spice_level, cooking_time_minutes, calorie_count, popular) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const values = [
            name,
            cuisine,
            allergen_free,
            spice_level,
            cooking_time_minutes,
            calorie_count,
            popular,
        ];

        const response = await client.query(insertQuery, values);
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
