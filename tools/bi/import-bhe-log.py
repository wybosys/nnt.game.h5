#!/usr/bin/env python

import sys, re, json, datetime
from pymongo import MongoClient

PAT = re.compile("^(.+) \[I\] rtca (.+)$")

def importlogfile(page, fpath):
    with open(fpath) as file:
        for line in file:
            res = PAT.findall(line)
            if len(res) == 1:
                time = res[0][0]
                jsonstr = '[' + res[0][1] + ']'
                jsonobjs = json.loads(jsonstr)
                date = datetime.datetime.strptime(time, "%Y/%m/%d %H:%M:%S")
                for jsonobj in jsonobjs:
                    jsonobj["rtime"] = date
                    page.insert_one(jsonobj)

if __name__=="__main__":
    connector = MongoClient("mongodb://localhost:27017")
    db = connector.h5flower
    context = db.context
    records = db.records    
    importlogfile(records, sys.argv[1])
