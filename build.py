xList = [-15,-25,-35,-15,-25,-15]
yList = [10,10,30,70,30,10]

arr = '[\n'

for i in range(len(xList)-1):
    arr += f'{"{"}x: {xList[i]}, y: {yList[i]}{"}"}, \n'

arr += '],\n'

print(arr)
