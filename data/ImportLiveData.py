from bson import decode_all
from bson.json_util import dumps
 
with open('./words.bson','rb') as f:
    data = decode_all(f.read())
 
with open("./words.json", "w") as outfile:
    outfile.write(dumps(data, indent=2))