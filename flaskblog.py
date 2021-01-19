from flask import Flask, render_template, url_for, request,jsonify,Response
import json
import uuid
import numpy as np
import pandas as pd
app = Flask(__name__)

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', id=str(uuid.uuid4()))

@app.route("/getdata")
def getdata():
    with open('Data1.json') as f:
        data = json.load(f)
        return jsonify(data)
        
@app.route("/generateData",methods=["POST"])
def generateData():
    query = request.form['dataQuery']
    totalCount = request.form['totalCount']
    # totalData = None
    # if request.method == "POST":
    #     totalData = request.json
    data =json.loads(query)
    output = generateRandomData(data,int(totalCount))
    #     print(output)
        # outputJson = json.dumps(output)
    #return jsonify(outputJson)
    csv=output.to_csv(index=False)
    return Response(csv,mimetype="text/csv",headers={"Content-disposition":
                 "attachment; filename=generateddata.csv"})
    #return render_template('datagrid.html',  tables=[output.to_html(classes='data')], titles=output.columns.values)


def generateRandomData(data,totalCount):
    datadict = {}
    for i in data:
        if(i['Attribute Name'] =='Loading...'):
            continue
        if(i['Attribute Type'] =='Categorical'):
            options = [value.strip() for value in i['List of Options'].split('|')]
            datadict[i['Attribute Name']] = np.random.choice(options,totalCount)
        elif(i['Attribute Type'] =='Continous (int)'):
            datadict[i['Attribute Name']] = np.random.randint(int(i['Lower bound']),int(i['Upper bound']),totalCount)
        elif(i['Attribute Type'] =='Continous (float)'):
            datadict[i['Attribute Name']] = np.random.uniform(float(i['Lower bound']),float(i['Upper bound']),totalCount)
    return pd.DataFrame(datadict)
    ##outputJson = pd.DataFrame(datadict).to_json(orient='records')
    # outputJson = json.dumps(pd.DataFrame(datadict).values.tolist())
    # columns = pd.DataFrame(datadict).columns.tolist()
    # columnList = []
    # for i in columns:
    #     data={}
    #     data['data'] = i
    #     columnList.append(data)
    # outputColumns = json.dumps(columnList)
    # outputDict = {}
    # outputDict['Columns'] = outputColumns
    # outputDict['Output']=outputJson
    # return outputDict

if __name__ == '__main__':
    app.run()
