import { deployChocoshop } from "../helpers/migrations";

deployChocoshop()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
