import xmltodict

def call_model(image, pipeline):
    parsed_text = pipeline(image)
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
