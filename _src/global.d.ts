import { T_ValidLanguages } from "./Constants/Languages/languageTypes";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      language?: T_Language; // Assuming this is a defined type
      headers: {
        language?: T_ValidLanguages; // Assuming this is a defined type
        "auth-token"?: string;
      };
    }
  }
}

declare module "bodyParser";
