from flask import Flask, request, jsonify
from flask_cors import CORS
from json import loads
import rainbow as rb
import pandas as pd
from pandas import DataFrame
import numpy as np
from scipy.integrate import simpson
from scipy.integrate import trapezoid

# Create the app instance
app = Flask(__name__)
CORS(app)

defaultFilename = "/Users/nemati/Documents/Trial-Data/5087258-0018 2023-07-11-SecondTrialData/5087258-0018_Data/018-D2F-B6-5087258-0018.D"
# Extract the file from the directory
datadir = rb.read(defaultFilename)
datafile = datadir.get_file("MSD1.MS")
well_data = datafile.data.T

# Well data information that uses the path to the well we are looking for
@app.route('/well')
def well():
    # Extract the requested masses from the file
    df = DataFrame(well_data, columns=datafile.xlabels.tolist(),
                   index=datafile.ylabels.tolist())
    df = df.query("260 < index < 340")

    # Create the json object that will return the result from the data frame
    result = df.to_json(orient="split")
    parsed = loads(result)
    wellData = {
        "columns": parsed['columns'],
        "index": parsed['index'],
        "values": parsed['data']
    }

    return jsonify(wellData)

# Route that gives the baseline for the extracted (m/z)
@app.route('/baseline', methods=['POST'])
def baseline():
    try:
        # Retrieve data from the POST request
        data = request.get_json()
        #print(data)
        yData = data.get("yData")
        # create the most generic baseline
        baseline = [min(yData)] * len(yData)
        # update the raw data according to baseline 
        newYdata = [y - b for y, b in zip(yData, baseline)]
        response = {"baseline": baseline, "newYdata": newYdata}
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)})

# Route that gives the path and channel that we need to process
@app.route('/area', methods=['POST'])
def area():
    try:
        # Retrieve data from the POST request
        data = request.get_json()
        yData = data.get("yData")
        xData = data.get("xData")
        range = data.get("range")
        baseline = data.get("baseline")
        # update the raw data according to baseline 
        newYdata = [y - b for y, b in zip(yData, baseline)]
        # slice the x and y data axis given the left and right side keys 
        leftside = range['leftside']
        rightside = range['rightside']

        xDataRange = xData[leftside:rightside]  
        yDataRange = newYdata[leftside:rightside]
        # calulate the area given the updated yData
        area = trapezoid(
            y=yDataRange,
            x=xDataRange
        )
        response = {"area": area}
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, port=7000)
