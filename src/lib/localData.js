import fsPromises from "fs/promises";
import path from "path";

export const readFromFile = async () => {
  const jsonDirectory = path.join(process.cwd(), "json", "users.json");
  const fileContent = await fsPromises.readFile(jsonDirectory);
  const data = JSON.parse(fileContent);
  return data;
};
