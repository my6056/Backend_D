const { Router } = require("express");
const router = Router();
const { AccountCreate, LoginUser } = require("../controllers/UserController");

router.post("/sign_up", AccountCreate);
router.post("/login", LoginUser);
module.exports = router;
