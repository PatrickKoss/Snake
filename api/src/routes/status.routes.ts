import { Request, Response, Router } from "express";

// basic router for initialising the express app
const router = Router();

router.get("/status", (req: Request, res: Response) => {
    const msg = {
        message: "API is up and running.",
        status: "200 OK"
    };
    res.json(msg);
});

export { router };

