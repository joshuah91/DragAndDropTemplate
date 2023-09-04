import fsPromises from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "json/users.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Read the existing data from the JSON file
      const jsonData = await fsPromises.readFile(dataFilePath);
      const objectData = JSON.parse(jsonData);

      res.status(200).json(objectData);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        response: false,
        status: 500,
        message: "Error fetching data",
      });
    }
  } else if (req.method === "POST") {
    try {
      // Read the existing data from the JSON file
      const jsonData = await fsPromises.readFile(dataFilePath);
      let objectData = JSON.parse(jsonData);

      // Get the data from the request body
      const newData = req.body;

      //replace the current data in json object
      objectData = newData;

      // Convert the object back to a JSON string
      const updatedData = JSON.stringify(objectData);

      // Write the updated data to the JSON file
      await fsPromises.writeFile(dataFilePath, updatedData);

      // Send a success response
      res.status(200).json({
        response: true,
        status: 200,
        message: "Success updating data!",
      });
    } catch (error) {
      console.error(error);
      // Send an error response
      res.status(500).json({
        response: false,
        status: 500,
        message: "Error updating data! ",
      });
    }
  }
}
