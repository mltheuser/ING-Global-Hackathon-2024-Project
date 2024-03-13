import xmltodict
from transformers import pipeline

pipe = pipeline("image-to-text", model="selvakumarcts/sk_invoice_receipts", device="mps")

def call_model(image):
    image = image.convert("RGB")

    parsed_text = pipe(image)

    print(parsed_text)

    parsed_text = parsed_text[0]['generated_text'] + "</s_receipt>"
    parsed_text = xmltodict.parse(parsed_text)
    parsed_text = parsed_text['s_receipt']

    items = []
    total = parsed_text["s_total"]
    num_items = len(parsed_text["s_line_items"]["s_item_name"])
    for i in range(num_items):
        items.append({
            "name": parsed_text["s_line_items"]["s_item_name"][i],
            "amount": parsed_text["s_line_items"]["s_item_quantity"][i],
            "price": parsed_text["s_line_items"]["s_item_value"][i],
        })

    result = {
        "items": items,
        "total": total,
    }

    return result
