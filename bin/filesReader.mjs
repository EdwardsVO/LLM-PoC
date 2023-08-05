import fs from "fs";

export const loadFiles = async (dir) => {
  const content = fs.readFileSync(dir , "utf8");
  return(content);
};
