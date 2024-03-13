const express = require('express');
const uuid = require('uuid');
const app = express();

app.use(express.json());


class Item {
  constructor(id, name, quantity, unit_price, total_price) {
      this._id = id;
      this._name = name;
      this._quantiy = quantity;
      this._unit_price = unit_price;
      this._total_price = total_price;
      this._price_paid = 0;
      this._quantity_paid = 0;
  }

  get id() {
    return this.id;
  }

  get name() {
    return this._name;
  }

  get quantity() {
    return this._quantity;
  }

  get unit_price() {
    return this._unit_price;
  }

  get total_price() {
    return this._total_price;
  }

  get pricePaid() {
    return this._price_paid;
  }

  get quantityPaid() {
    return this._quantity_paid;
  }

  get isFullyPaid() {
      return this._price_paid == this._total_price;
  }

  get isFullyPaid() {
    return (this._price_paid == this._total_price) ||
      (this._quantity_paid == this._quantiy) ;
}

  setQuantityPaid(quantity) {
    this._quantity_paid += quantity;
  }

  setPricePaid(price) {
    this._price_paid += price;
  }

  jsonify() {
    return {"id" : this._id, "name": this._name, "quantity" : this._quantiy, "unit_price" : this._unit_price, "total_price" : this._total_price,
          "price_paid": this._price_paid, "quantity_paid": this._quantity_paid};
  }
}

class Bill {
  constructor(items, total) {
      this._items = items;
      this._total = total;
  }

  get items() {
      return this._items;
  }

  get total() {
    return this._total;
}

  getItem(id) {
    return this._items.get(id);
  }

  setItem(id, item) {
    this._items.set(id, item)
  }

  jsonify() {
    var item_jsons = []
    this._items.forEach(item => item_jsons.push(item.jsonify()));
    return { "items" : item_jsons, "total" : this._total};
  }
}

//sample = {id: 1, name: 'donuts', price: 3.0, amount: 2, totalPrice: 9.0} 

const db = new Map();

// API endpoints
app.get('/bill/:bill_uuid/get', (req, res) => {
  const bill_uuid = req.params.bill_uuid;
  if (! db.has(bill_uuid)) {
    res.status(400).json({error: "Bill_uuid " + bill_uuid + " does not exist."});
    return;
  }
  res.status(200).json({ "bill": db.get(bill_uuid).jsonify() });
});


app.post('/bill/generate-link', (req, res) => {
  const bill_uuid = uuid.v4()
  const bill_json = JSON.parse(JSON.stringify(req.body));

  if (db.has(bill_uuid)) {
    res.status(400).json({ error: "Bill_uuid " + bill_uuid + " already exists."});
    return;
  }

  const items = bill_json.bill;
  const total = bill_json.total;

  var items_map = new Map();

  items.forEach(item => {
    items_map.set(item.id, new Item(item.id, item.name, item.price, item.amount, item.total_price));
  });

  const new_bill = new Bill(items_map, total);

  db.set(bill_uuid, new_bill);
  res.status(200).json({message:"Bill " + bill_uuid + " created successfully.", uuid: bill_uuid });
});

app.put('/bill/:bill_uuid/settle', (req, res) => {
  // const changes_sample = {"changes":[{"id": 2, "quantity_paid": 13}] }

  const bill_uuid = req.params.bill_uuid;

  if (! db.has(bill_uuid)) {
    res.status(400).json({error: "Bill_uuid " + bill_uuid + " does not exist."});
    return;
  }

  const bill = db.get(bill_uuid);

  const changed_bill_json = JSON.parse(JSON.stringify(req.body));
  const changes = changed_bill_json.changes;
  

  changes.forEach(change => {
    const item = bill.getItem(change.id);
    (change.quantity_paid != null) ? item.setQuantityPaid(change.quantity_paid) :
      item.setPricePaid(change.price_paid);
    bill.setItem(change.id, item);
  });

  db.set(bill_uuid, bill);
  res.status(200).json({message:"Bill " + bill_uuid + " settled successfully."});
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
