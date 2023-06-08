const router = require("express").Router()

const stateController = require('../../controllers/state/state')

router.post("/add", stateController.addState)
router.get("/single-state/:country_Id", stateController.viewStateByCountry);
router.get("/all-state", stateController.viewAllStates);
router.post("/update/:id", stateController.editState)
router.delete("/delete/:id", stateController.deleteState)


module.exports = router;