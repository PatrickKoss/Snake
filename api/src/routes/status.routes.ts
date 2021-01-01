import { Request, Response, Router } from "express";

// basic router for initialising the express app
const router = Router();

router.get("/status", (req: Request, res: Response) => {
    const msg = {
        message: "API is up and running.",
        status: "200 OK"
    };
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', "true"); // If needed
    // @ts-ignore
    res.json(msg);
});

export { router };

