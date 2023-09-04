import fsPromises from "fs/promises";
import path from "path";

const originalDataFilePath = path.join(
  process.cwd(),
  "json/originalUsers.json"
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      //Read the original Data from the original JSON file
      const originalJsonData = await fsPromises.readFile(originalDataFilePath);
      const originalObjectData = JSON.parse(originalJsonData);

      res.status(200).json(originalObjectData);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        response: false,
        status: 500,
        message: "Error fetching original data",
      });
    }
  }
}
