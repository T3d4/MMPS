// Under Development
import { AppController } from "../controllers";
import { Router } from "express";
const { Home } = new AppController();

export const router = Router();

router.route("/").get(Home);
