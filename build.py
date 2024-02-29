xList = [-20,-5,0,5,20,-20]
yList = [-135,-175,-180,-175,-135,-135]
arr = '[\n'

for i in range(len(xList)-1):
    arr += f'{"{"}x: {xList[i]}, y: {yList[i]}{"}"}, \n'

arr += '],\n'

print(arr)
