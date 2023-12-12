from flask import Flask, request, jsonify
from flask_cors import CORS
from json import loads
import rainbow as rb
import pandas as pd
from pandas import DataFrame
import numpy as np
from scipy.integrate import simpson
from scipy.integrate import trapezoid
from scipy.interpolate import UnivariateSpline

# Create the app instance
app = Flask(__name__)
CORS(app)

defaultFilename = "../assests/data/001-D3F-A1-5068080-0015-4.D"
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
        # print(data)
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

# Route that will apply baseline correction and re-calculate area


@app.route('/baselineCorrection', methods=['POST'])
def baselineCorrection():
    try:
        # Retreive data from the POST request
        data = request.get_json()
        x_data = data.get("xData")
        y_data = data.get("yData")
        baseline_time_ranges = data.get("baselineTimeRange")
        region_time = data.get("regionTime")
        # update the arrays to numpy so operation can be easier
        x_np = np.array(x_data)
        y_np = np.array(y_data)
        # perform baseline correction here
        noise_mask = np.zeros_like(x_np, dtype=bool)
        for noise_region in baseline_time_ranges:
            x = x_np
            noise_start, noise_end = noise_region
            noise_mask |= (x >= noise_start) & (x <= noise_end)

            noise_x = x[noise_mask]
            noise = y_data[noise_mask]
            spline = UnivariateSpline(noise_x, noise, k=1, s=1)
            baseline = spline(x)

        # update the raw data with the baseline
        y_np = y_np - baseline

        # extract the time region
        min_time, max_time = region_time.min_time, region_time.max_time
        time_indices = [i for i, time in enumerate(
            x_np) if min_time <= time <= max_time]
        # perform slicing to calculate area
        y_np = y_np[time_indices]
        selected_times = x_np[time_indices]
        # calculate area by trapezoidal rule
        area = np.trapz(y_np, selected_times)
        response = {"area": area, "baseline": baseline}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, port=7000)
