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
      this._total_price = total_price
      this._amountPaid = 0
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

  get amountPaid() {
    return this._amountPaid;
  }

  get isFullyPaid() {
      return this._amountPaid == this._total_price;
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
}

//sample = {id: 1, name: 'donuts', price: 3.0, amount: 2, totalPrice: 9.0} 

const db = new Map();

// API endpoints
app.get('/bill/get/:bill_uuid', (req, res) => {
  const bill_uuid = req.params.bill_uuid;
  res.json({ bill:  db.get(bill_uuid)});
});


app.post('/bill/generate-link', (req, res) => {
  const bill_uuid = uuid.v4()
  const bill_json = JSON.parse(JSON.stringify(req.body));

  const items = bill_json.bill;
  const total = bill_json.total;

  var items_list = [];

  items.forEach(item => {
    items_list.push(new Item(item.id, item.name, item.price, item.amount, item.total_price));
  });

  const new_bill = new Bill(items_list, total)

  console.log(new_bill.total);

  db.set(bill_uuid, new_bill);
  res.json({ uuid: bill_uuid });
});

app.put('/bill/:bill_uuid/settle', (req, res) => {
  db.set(req.params.bill_uuid, req.body);
  res.sendStatus(200);
})

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
