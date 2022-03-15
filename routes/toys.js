const express = require("express");
const { auth } = require("../middlewares/atuh");
const { validateToy, ToyModel } = require("../models/toyModel");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let data = await ToyModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
    res.json(data);

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})

router.get("/cat/:catname", async (req, res) => {
  try {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let category = new RegExp(req.params.catname, 'i');
    let data = await ToyModel.find({ category })
      .limit(perPage)
      .skip((page - 1) * perPage)
    res.json(data);

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})

//?s=
//
router.get("/search", async (req, res) => {
  try {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let searchQ = req.query.s;
    let searchReg = new RegExp(searchQ, "i")
    let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})

router.get("/userToys", auth, async (req, res) => {
  try {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let data = await ToyModel.find({ user_id: req.tokenData._id })
      .limit(perPage)
      .skip((page - 1) * perPage)

      .sort({ _id: -1 })
    res.json(data);

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})


router.get('/prices', async (req, res) => {
  try {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let max = req.query.max || 9999;
    let min = req.query.min || 0;
    let data = await ToyModel.find({ price: { $gt: min, $lt: max } })
      .limit(perPage)
      .skip((page - 1) * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }
})


router.post("/", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)

  }
  catch (err) {
    console.log(err);
  }
})

router.put("/:editId", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idToy = req.params.editId;
    let data = await ToyModel.updateOne({ _id: idToy, user_id: req.tokenData._id }, req.body);

    res.json(data)
  }
  catch (err) {
    console.log(err);
  }
})

router.delete("/:delId", auth, async (req, res) => {
  try {
    let idDel = req.params.delId;
    let data = await ToyModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
  }
})


module.exports = router;