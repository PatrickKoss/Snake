import { Request, Response, Router } from "express";
import * as fs from "fs";
import * as path from "path";

const router: Router = Router();

const normalizedPath: string = path.join(__dirname);

fs.readdirSync(normalizedPath).forEach(file => {
    if (file.includes(".routes.") && !file.includes("index.")) {
        router.use("/", require(`./${file}`).router);
    }
});

router.get("/", (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', "true"); // If needed
    const msg = {
        message: "Main route is empty"
    };
    // @ts-ignore
    res.json(msg);
});

export default router;
