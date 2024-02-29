xList = [14,14.5,17.5,18,18,17.5,14.5,14,14]
yList = [2.5,2,2,2.5,12.5,13,13,12.5,2.5]

arr = '[\n'

for i in range(len(xList)-1):
    arr += f'{"{"}x: {xList[i]}, y: {yList[i]}{"}"}, \n'

arr += '],\n'

print(arr)
