import { defineConfig } from "drizzle-kit";

 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://Form_Db_owner:bn4zZtI2WEPM@ep-misty-frost-a5bonhmr.us-east-2.aws.neon.tech/Form_Db?sslmode=require',
  }
});
