const fs = require("fs");
const path = require("path");

const env = process.argv[2]; // 'dev' または 'prod'

const sourceFile = path.join(__dirname, "..", "prisma", `schema.${env}.prisma`);
const targetFile = path.join(__dirname, "..", "prisma", "schema.prisma");

try {
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✓ Copied schema.${env}.prisma to schema.prisma`);
  } else {
    console.error(`✗ Source file not found: ${sourceFile}`);
    process.exit(1);
  }
} catch (error) {
  console.error("Error copying schema file:", error);
  process.exit(1);
}
