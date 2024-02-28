xList = [-25,25,15,-15,-25]
yList = [-50,-50,30,30,-50]
arr = '[\n'

for i in range(len(xList)-1):
    arr += f'{"{"}x: {xList[i]}, y: {yList[i]}{"}"}, \n'

arr += '],\n'

print(arr)
