#!/usr/bin/env python

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as cols
from pymongo import MongoClient

def showheat(x, y):
    map, xe, ye = np.histogram2d(x, y, bins=(720,1280))
    ext = [xe[0], xe[-1], ye[0], ye[-1]]
    plt.clf()
    plt.imshow(map, extent=ext, norm=cols.LogNorm())
    plt.colorbar()
    plt.show()

if __name__=="__main__":
    connector = MongoClient("mongodb://localhost:27017")
    db = connector.h5flower
    records = db.records    
    find = records.find({}, {'_id':False, 'tpnt':True})
    cnt = find.count()
    x = np.empty(cnt, np.int)
    y = np.empty(cnt, np.int)
    idx = 0
    for cursor in find:
        x[idx] = cursor['tpnt']['x']
        y[idx] = cursor['tpnt']['y']
        idx += 1
    showheat(x, y)
