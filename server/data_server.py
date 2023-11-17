from flask import Flask, jsonify
from flask_cors import CORS
from json import loads
import rainbow as rb
import pandas as pd
from pandas import DataFrame

# Create the app instance
app = Flask(__name__)
CORS(app)

defaultFilename = "../assests/data/001-D3F-A1-5068080-0015-4.D"
# Extract the file from the directory
datadir = rb.read(defaultFilename)
datafile = datadir.get_file("DAD1A.ch")
data = datafile.data.T

# Well data information that uses the path to the well we are looking for 
@app.route('/well')
def well():
    # Extract the requested masses from the file
    df = DataFrame(data, columns=datafile.xlabels.tolist(), index=datafile.ylabels.tolist())
    #df = df.query("260 < index < 340")

    # Create the json object that will return the result from the data frame 
    result = df.to_json(orient="split")
    parsed = loads(result)
    wellData = {
        "columns": parsed['columns'],
        "index": parsed['index'],
        "values": parsed['data']
    }
    
    return jsonify(wellData)

if __name__ == '__main__':
    app.run(debug=True, port=8001)