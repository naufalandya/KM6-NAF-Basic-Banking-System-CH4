const router = require("express").Router();

const {userModel, accountModel, transactionModel} = require("../../../model/model.prisma")

router.get("/users", userModel.getAll);
router.get("/users/:id", userModel.getById);
router.post("/users", userModel.create)

router.get("/accounts", accountModel.getAll)
router.get("/accounts/:id", accountModel.getById)
router.post("/accounts", accountModel.create)

router.get("/transactions", transactionModel.getAll);
router.get("/transactions/:id", transactionModel.getById);
router.post("/transactions", transactionModel.create);



module.exports = router;