import re
import xmltodict
from transformers import pipeline

pipe = pipeline("image-to-text", model="selvakumarcts/sk_invoice_receipts", device="mps")

def clean_xml(text):
    return re.sub(r"[^a-zA-Z0-9<>/_]+", "", text)

def postprocess_name(name):
    if name == None:
        return None
    return re.sub(r'(?<=[a-z](?=[A-Z]))', ' ', name)

def postprocess_amount(amount):
    if amount == None:
        return None
    return int(amount)

def postprocess_price(price):
    if price == None:
        return None
    return round(float(price) / 100, 2)

def postprocess_total(total):
    if total == None:
        return None
    total = re.sub(r"[^0-9]+", "", total)
    
    # Remove double parsing
    if len(total)%2 == 0 and total[:len(total)//2] == total[len(total)//2:]:
        total = total[:len(total)//2]

    return round(float(total) / 100, 2)

def call_model(image):
    image = image.convert("RGB")

    parsed_text = pipe(image)
    parsed_text = parsed_text[0]['generated_text'] + "</s_receipt>"
    parsed_text = clean_xml(parsed_text)
    parsed_text = xmltodict.parse(parsed_text)
    parsed_text = parsed_text['s_receipt']

    items = []
    total = postprocess_total(parsed_text["s_total"])
    num_items = len(parsed_text["s_line_items"]["s_item_name"])
    for i in range(num_items):
        name = postprocess_name(parsed_text["s_line_items"]["s_item_name"][i])
        amount = postprocess_amount(parsed_text["s_line_items"]["s_item_quantity"][i])
        totalPrice = postprocess_price(parsed_text["s_line_items"]["s_item_value"][i])
        price = round(totalPrice / amount, 2) if (totalPrice != None and amount != None) else None
        items.append({"name": name, "amount": amount, "price": price, "totalPrice": totalPrice})

    result = {
        "items": items,
        "total": total,
    }

    return result
