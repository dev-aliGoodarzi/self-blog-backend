declare global {
  declare namespace Express {
    interface Request {
      headers: {
        language?: T_ValidLanguages;
      };
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      language: T_Language;
    }
  }
}

declare module "bodyParser";
