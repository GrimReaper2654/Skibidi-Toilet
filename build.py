xList = [-20,-13,-10,-10,-23,-23,-20]
yList = [55,55,60,70,70,60,55]

arr = '[\n'

for i in range(len(xList)-1):
    arr += f'{"{"}x: {xList[i]}, y: {yList[i]}{"}"}, \n'

arr += '],\n'

print(arr)
