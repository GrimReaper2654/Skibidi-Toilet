xList = [-20,-30,30,20,-20]
yList = [20,30,30,20,20]
arr = '[\n'

for i in range(len(xList)-1):
    arr += f'{"{"}x: {xList[i]}, y: {yList[i]}{"}"}, \n'

arr += '],\n'

print(arr)
