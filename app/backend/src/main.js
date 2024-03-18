const express = require('express');
const uuid = require('uuid');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

const db = new Map();

db.set("cf087d8a-7504-480e-a4ba-ccc873f5d1e7", { bill: { items: [{ name: "name", amount: 2, totalPrice: 12.5 }, { name: "name2", amount: 5, totalPrice: 22 }] } })

// API endpoints
app.get('/bill/:bill_uuid/get', (req, res) => {
  const bill_uuid = req.params.bill_uuid;
  console.log(bill_uuid)
  if (!db.has(bill_uuid)) {
    res.status(400).json({ error: "Bill_uuid " + bill_uuid + " does not exist." });
    return;
  }
  res.status(200).json(db.get(bill_uuid));
});

app.post('/bill/generate-link', (req, res) => {
  const bill_uuid = uuid.v4()
  const bill_json = JSON.parse(JSON.stringify(req.body));

  if (db.has(bill_uuid)) {
    res.status(400).json({ error: "Bill_uuid " + bill_uuid + " already exists." });
    return;
  }

  const items = bill_json.bill;

  db.set(bill_uuid, { bill: { items: items } });
  res.status(200).json({ message: "Bill " + bill_uuid + " created successfully.", uuid: bill_uuid });
});

app.put('/bill/:bill_uuid/settle', (req, res) => {
  // const changes_sample = {"changes":[{"id": 2, "quantity_paid": 13}] }

  const bill_uuid = req.params.bill_uuid;

  console.log(bill_uuid)

  console.log(req.body)

  if (!db.has(bill_uuid)) {
    res.status(400).json({ error: "Bill_uuid " + bill_uuid + " does not exist." });
    return;
  }

  const bill = db.get(bill_uuid).bill;

  const updates = JSON.parse(JSON.stringify(req.body));

  console.log(Object.keys(updates))

  console.log(bill)

  Object.keys(updates).forEach(updateKey => {

    const { current, currentContribution } = updates[updateKey]

    bill.items[Number(updateKey)].amount -= current
    bill.items[Number(updateKey)].totalPrice -= currentContribution
  });

  bill.items = bill.items.filter(value => value.totalPrice > 0)

  db.set(bill_uuid, {bill: bill});

  console.log(db.get(bill_uuid))
  console.log(db.get(bill_uuid).bill.items)

  res.status(200).json({ message: "Bill " + bill_uuid + " settled successfully." });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
