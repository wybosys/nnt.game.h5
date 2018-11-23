import os

def ismatchs(str, rexs, non=False):
    if rexs == None:
        return non
    for be in rexs:
        bl = len(be.findall(str))
        if bl:
            return True
    return False

def listfiles(dir, rets = None, blacklist = None, whitelist = None, depth = -1):
    if depth == 0:
        return rets
    elif depth != -1:
        depth -= 1
    if rets == None:
        rets = []
    if os.path.isdir(dir) == False:
        return rets
    for each in os.listdir(dir):        
        path = dir + '/' + each
        if os.path.isdir(path):
            listfiles(path, rets, blacklist, whitelist, depth)
        else:
            ignore = False
            if blacklist:
                for be in blacklist:
                    ignore = len(be.findall(each))
                    if ignore:
                        break        
                if ignore:
                    continue            
            if whitelist:
                for we in whitelist:
                    ignore = not len(we.findall(each))
                    if not ignore:
                        break
                if ignore:
                    continue
            rets.append(path)
    return rets

def listdirs(dir, rets = None, blacklist = None, depth = -1):
    if depth == 0:
        return rets
    elif depth != -1:
        depth -= 1
    if rets == None:
        rets = []
    if os.path.isdir(dir) == False:
        return rets
    for each in os.listdir(dir):
        bl = False
        if blacklist:
            for be in blacklist:
                bl = len(be.findall(each))
                if bl:
                    break
        if bl:
            continue
        path = dir + '/' + each
        if os.path.isdir(path):
            rets.append(path)
            listdirs(path, rets, blacklist, depth)
    return rets

def processdirs(dir, proc, blacklist = None, depth = -1, curdir = None):
    if depth == 0:
        return
    elif depth != -1:
        depth -= 1
    if os.path.isdir(dir) == False:
        return
    for each in os.listdir(dir):
        bl = False
        if blacklist:
            for be in blacklist:
                bl = len(be.findall(each))
                if bl:
                    break
        if bl:
            continue
        path = dir + '/' + each
        if not os.path.isdir(path):
            continue
        if curdir == None:
            cd = each
        else:
            cd = curdir + '/' + each
        proc(path, cd)
        processdirs(path, proc, blacklist, depth, cd)
