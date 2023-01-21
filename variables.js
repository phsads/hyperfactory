var veins = [
	[100,2,"Copper Ore",0.4], // [amount, size, givenOnExtract, fill]
	[100,2,"Iron Ore",0.4],
	[100,2,"Tin Ore",0.4],
	[100,2,"Wood Log",0.8],
	[70,4,"Water",1.1],
	[100,3,"Stone",0.7],
]
var deposits = [
	//80% main, 15% side1, 5% side2
	[40000,"Copper Ore","Chalcopyrite Ore","Chalcopyrite Ore"], //[size, main item, sideItem1, sideItem2]
	[10000,"Oil","Natural Gas","Oil"],
	[40000,"Salt Ore","Rock Salt Ore","Salt Ore"],
	[40000,"Iron Ore","Magnetite Ore","Pyrite Ore"],
	[40000,"Bauxite Ore","Aluminium Ore","Rutile Ore"],
	[4000000,"Water","Water","Water"],
	[40000,"Zinc Ore","Sphalerite Ore","Zinc Ore"],
	[40000,"Magnesite Ore","Magnesite Ore","Magnesite Ore"],
	[40000,"Lead Ore","Galena Ore","Silver Ore"],
	[40000,"Color Ore","Color Ore","Color Ore"],
	[40000,"Tin Ore","Cassiterite Ore","Barite Ore"],
	[40000,"Coal Ore","Graphite Ore","Diamond Ore"],
]
var items = {}
var IDListItems = ["None"]
var recipes = cloneObj(Array(10).fill([]))
//-8: trash cans
//-7: solar panels
//-6: filters
//-5: deposit miner
//-4: harvester
//-3: item storage //logic done
//-2: fluid pipe //logic done
//-1: item pipe //logic done
//0: primitive furnace //logic done: 0-8
//1: anvil 
//2: workstation
//3: steam boiler
//4: compresser
//5: furnace
//6: crusher
//7: assembler (workstation v2) (LV+ assembler can make screws from bolts)
//8: cutter (better rods, bolts)
//9: ore washer (washing ores)
//10: centrifuge
//11: magnetizer
var itemForms = [" Ingot"," Plate"," Rod"," Wire"," Dust"," Bolt"," Screw"]
var materials = {
	"Iron": 1, //time factor
	"Copper": 1,
	"Bronze": 1.5,
	"Tin": 0.8,
	"Steel": 2.8,
	"Zinc": 2,
	"Brass": 2.5,
	"Potin":5,
	"Lead": 0.7,
}
//just the items
for (let m in materials) {
	for (let i in itemForms) {
		var itemName = m + itemForms[i]
		items[itemName] = {
			"itemType": "item", //item, fluids
			"placeBlock": undefined //linked block when placed
		}
	}
}
items["Stone"] = {"itemType": "item","placeBlock": undefined}
items["Wood Log"] = {"itemType": "item","placeBlock": undefined}
items["Wood Plank"] = {"itemType": "item","placeBlock": undefined}
items["Water"] = {"itemType": "fluid","placeBlock": undefined}
items["Oil"] = {"itemType": "fluid","placeBlock": undefined}
items["Natural Gas"] = {"itemType": "item","placeBlock": undefined}
items["Wood Plate"] = {"itemType": "item","placeBlock": undefined}
items["Resistor"] = {"itemType": "item","placeBlock": undefined}
items["Basic Circuit Board"] = {"itemType": "item","placeBlock": undefined}
items["Steam Machine Hull"] = {"itemType": "item","placeBlock": undefined}
items["T1 Circuit"] = {"itemType": "item","placeBlock": undefined}
items["Steam"] = {"itemType": "item","placeBlock": undefined}
items["Coal"] = {"itemType": "item","placeBlock": undefined}
items["Magnetite"] = {"itemType": "item","placeBlock": undefined}
items["template"] = {"itemType": "item","placeBlock": undefined}
items["template"] = {"itemType": "item","placeBlock": undefined}
items["template"] = {"itemType": "item","placeBlock": undefined}
items["template"] = {"itemType": "item","placeBlock": undefined}

//ores
var ores = ["Copper","Chalcopyrite","Salt","Rock Salt","Iron","Magnetite","Pyrite","Bauxite","Aluminium","Rutile","Zinc","Sphalerite","Magnesite","Lead","Galena","Silver","Color","Tin","Cassiterite","Barite","Coal","Graphite"]
for (let o in ores) {
	items[ores[o] + " Ore"] = {"itemType": "item","placeBlock": undefined}
	items["Crushed " + ores[o] + " Ore"] = {"itemType": "item","placeBlock": undefined}
	items["Clean " + ores[o] + " Ore"] = {"itemType": "item","placeBlock": undefined}
	items["Dirty " + ores[o] + " Dust"] = {"itemType": "item","placeBlock": undefined}
	recipes[6].push({
		"in": [[ores[o] + " Ore", 1]],
		"out":[["Crushed " + ores[o] + " Ore"  , 2]],
		"Ft": 8,
		"time": 400,
	}) //crushing ores
	recipes[6].push({
		"in": [["Crushed " + ores[o] + " Ore", 1]],
		"out":[["Dirty " + ores[o] + " Dust"  , 2]],
		"Ft": 8,
		"time": 400,
	}) //crushing crushed ores
	recipes[9].push({
		"in": [["Crushed " + ores[o] + " Ore", 4],["Water", 10]],
		"out":[["Clean " + ores[o] + " Ore"  , 5]],
		"Ft": 8,
		"time": 400,
	}) //washing crushed ores
	recipes[9].push({
		"in": [["Dirty " + ores[o] + " Dust", 1],["Water", 1]],
		"out":[[ores[o] + " Dust"  , 1]],
		"Ft": 8,
		"time": 200,
	}) //washing dirty dust
	recipes[6].push({
		"in": [["Clean " + ores[o] + " Ore", 1]],
		"out":[[ores[o] + " Dust"  , 2]],
		"Ft": 8,
		"time": 200,
	}) //crushing clean ores
	items[ores[o] + " Dust"] = {"itemType": "item","placeBlock": undefined}
}

//recipes
for (let m in materials) {
	//recipes format: {in: [[item1, amount], ...], out:, Ft: number (F per tick), time: 100}
	//recipes is an array, recipes[n] is machine type n

	//anvil: 2 ingot -> 1 plate
	recipes[1].push({
		"in": [[m + " Ingot", 2]],
		"out":[[m + " Plate", 1]],
		"Ft": 2,
		"time": ceil(materials[m]*200),
	})
	recipes[1].push({
		"in": [[m + " Rod", 1]],
		"out":[[m + " Wire", 1]],
		"Ft": 2,
		"time": ceil(materials[m]*200),
	})

	//workstation recipes
	recipes[2].push({
		"in": [[m + " Ingot", 1]],
		"out":[[m + " Rod"  , 1]],
		"Ft": 2,
		"time": ceil(materials[m]*250),
	}) //ingot -> rod
	recipes[2].push({
		"in": [[m + " Rod" , 1]],
		"out":[[m + " Bolt", 2]],
		"Ft": 2,
		"time": ceil(materials[m]*120),
	})//rod -> bolt
	recipes[2].push({
		"in": [[m + " Bolt" , 1]],
		"out":[[m + " Screw", 1]],
		"Ft": 2,
		"time": ceil(materials[m]*60),
	})//bolt -> screw
	recipes[2].push({
		"in": [[m + " Ingot", 1]],
		"out":[[m + " Dust" , 1]],
		"Ft": 2,
		"time": ceil(materials[m]*300),
	})//ingot -> dust

	//crusher recipe
	recipes[6].push({
		"in": [[m + " Ingot", 1]],
		"out":[[m + " Dust" , 1]],
		"Ft": 2,
		"time": ceil(materials[m]*80),
	})//ingot -> dust
	recipes[6].push({
		"in": [[m + " Plate", 1]],
		"out":[[m + " Dust" , 1]],
		"Ft": 2,
		"time": ceil(materials[m]*80),
	})//plate -> dust

	//dust -> ingot recipes
	recipes[5].push({
		"in": [[m + " Dust", 1]],
		"out":[[m + " Ingot" , 1]],
		"Ft": 2,
		"time": 200,
	})//ingot -> dust

	//ingot -> plate compressor recipes
	recipes[4].push({
		"in": [[m + " Ingot", 1]],
		"out":[[m + " Plate", 1]],
		"Ft": 2,
		"time": ceil(materials[m]*100),
	})
}
//wood recipes
recipes[2].push({
	"in": [["Wood Log"  , 1]],
	"out":[["Wood Plank", 3]],
	"Ft": 2,
	"time": 200,
})
recipes[2].push({
	"in": [["Wood Plank"   , 10]],
	"out":[["Storage Box I", 1]],
	"Ft": 2,
	"time": 100,
})
recipes[7].push({
	"in": [["Wood Log"  , 1]],
	"out":[["Wood Plank", 3]],
	"Ft": 2,
	"time": 200,
})
recipes[7].push({
	"in": [["Wood Plank"   , 10]],
	"out":[["Storage Box I", 1]],
	"Ft": 2,
	"time": 100,
})
recipes[2].push({
	"in": [["Stone"  , 15]],
	"out":[["Primitive Furnace", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[2].push({
	"in": [["Stone"  , 5],["Iron Ingot", 10]],
	"out":[["Anvil", 1]],
	"Ft": 2,
	"time": 500,
})

//furnace recipes
recipes[0].push({
	"in": [["Wood Log"  , 5],["Iron Ore", 2]],
	"out":[["Iron Ingot", 2]],
	"Ft": 0,
	"time": 200,
})
recipes[0].push({
	"in": [["Wood Log"  , 5],["Copper Ore", 2]],
	"out":[["Copper Ingot", 2]],
	"Ft": 0,
	"time": 200,
})
recipes[0].push({
	"in": [["Wood Log"  , 5],["Iron Ore", 2]],
	"out":[["Copper Ingot", 2]],
	"Ft": 0,
	"time": 200,
})
recipes[0].push({
	"in": [["Wood Log"  , 5],["Bronze Dust", 2]],
	"out":[["Bronze Ingot", 2]],
	"Ft": 0,
	"time": 200,
})
recipes[5].push({
	"in": [["Iron Ore", 1]],
	"out":[["Iron Ingot", 1]],
	"Ft": 0,
	"time": 200,
})
recipes[5].push({
	"in": [["Copper Ore", 1]],
	"out":[["Copper Ingot", 1]],
	"Ft": 0,
	"time": 200,
})
recipes[5].push({
	"in": [["Tin Ore", 1]],
	"out":[["Tin Ingot", 1]],
	"Ft": 0,
	"time": 200,
})
var machines = {
	"Primitive Furnace": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": 0,
		"CN": 0,
		"ticksRunning": 0,
		"maxSlotSize":64,
		"in": [[],[]],
		"out": [[]],
		"name": "Primitive Furnace",
		"color": "#85837f",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Anvil": {
		//blocks data:
		"power": 0,
		"maxPower": 2,
		"powerConsumption": 2,
		"isSteam": false,
		"isPrimitive": true,
		"machineType": 1,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[]],
		"out": [[]],
		"name": "Anvil",
		"color": "#ccc8be",
		"maxSlotSize":64,
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Workstation": {
		//blocks data:
		"power": 0,
		"maxPower": 2,
		"powerConsumption": 2,
		"isSteam": false,
		"isPrimitive": true,
		"machineType": 2,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[],[],[],[],[]],
		"maxSlotSize":64,
		"out": [[],[]],
		"name": "Workstation",
		"color":"#632c10",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Boiler": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": 3,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[]],
		"maxSlotSize":200,
		"out": [[],[]],
		"name": "Steam Boiler",
		"color":"rgb(193,78,0)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Harvester": {
		//blocks data:
		"power": 0,
		"maxPower": 512,
		"powerConsumption": 8,
		"isSteam": true,
		"isPrimitive": false,
		"machineType": -4,
		"CN": 0,
		"ticksRunning": 0,
		"range": 1,
		"in": [[]],
		"maxSlotSize":64,
		"out": [[],[],[]],
		"currentMine": 0,
		"name": "Steam Harvester",
		"color":"rgb(193,78,0)",
		"overclock":3,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Deposit Miner": {
		//blocks data:
		"power": 0,
		"maxPower": 512,
		"powerConsumption": 8,
		"isSteam": true,
		"isPrimitive": false,
		"machineType": -5,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[]],
		"maxSlotSize":64,
		"out": [[],[],[]],
		"name": "Steam Deposit Miner",
		"color":"rgb(193,78,0)",
		"overclock":3,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Filter": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -6,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[]],
		"maxSlotSize":64,
		"out": [[]],
		"name": "Filter",
		"color":"rgb(195,195,195)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Furnace": {
		//blocks data:
		"power": 0,
		"maxPower": 512,
		"powerConsumption": 8,
		"isSteam": true,
		"isPrimitive": false,
		"machineType": 5,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[],[]],
		"maxSlotSize":64,
		"out": [[],[],[]],
		"name": "Steam Furnace",
		"color":"rgb(193,78,0)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Crusher": {
		//blocks data:
		"power": 0,
		"maxPower": 512,
		"powerConsumption": 8,
		"isSteam": true,
		"isPrimitive": false,
		"machineType": 6,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[],[]],
		"maxSlotSize":64,
		"out": [[],[],[]],
		"name": "Steam Crusher",
		"color":"rgb(193,78,0)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Assembler": {
		//blocks data:
		"power": 0,
		"maxPower": 512,
		"powerConsumption": 8,
		"isSteam": true,
		"isPrimitive": false,
		"machineType": 7,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[],[],[],[],[]],
		"maxSlotSize":64,
		"out": [[],[],[]],
		"name": "Steam Assembler",
		"color":"rgb(193,78,0)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Steam Ore Washer": {
		//blocks data:
		"power": 0,
		"maxPower": 512,
		"powerConsumption": 8,
		"isSteam": true,
		"isPrimitive": false,
		"machineType": 9,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[],[]],
		"maxSlotSize":64,
		"out": [[],[],[]],
		"name": "Steam Ore Washer",
		"color":"rgb(193,78,0)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box I": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[]],
		"out": [[]],
		"maxSlotSize":64,
		"name": "Storage Box I",
		"color":"rgb(34,0,1)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box II": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": [[],[],[]],
		"out": [[],[],[]],
		"maxSlotSize":64,
		"name": "Storage Box II",
		"color":"rgb(83,0,2)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box III": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(5).fill([])),
		"out": cloneObj(Array(5).fill([])),
		"maxSlotSize":128,
		"name": "Storage Box III",
		"color":"rgb(132,0,3)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box IV": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(9).fill([])),
		"out": cloneObj(Array(9).fill([])),
		"maxSlotSize":128,
		"name": "Storage Box IV",
		"color":"rgb(174,0,4)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box V": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(15).fill([])),
		"out": cloneObj(Array(15).fill([])),
		"maxSlotSize":128,
		"name": "Storage Box V",
		"color":"rgb(215,0,5)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box VI": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(18).fill([])),
		"out": cloneObj(Array(18).fill([])),
		"maxSlotSize":256,
		"name": "Storage Box VI",
		"color":"rgb(255,15,21)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box VII": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(27).fill([])),
		"out": cloneObj(Array(27).fill([])),
		"maxSlotSize":512,
		"name": "Storage Box VII",
		"color":"rgb(255,62,67)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box VIII": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(36).fill([])),
		"out": cloneObj(Array(36).fill([])),
		"maxSlotSize":1024,
		"name": "Storage Box VIII",
		"color":"rgb(255,111,114)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box IX": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(64).fill([])),
		"out": cloneObj(Array(64).fill([])),
		"maxSlotSize":4096,
		"name": "Storage Box IX",
		"color":"rgb(255,159,162)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Storage Box X": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -3,
		"CN": 0,
		"ticksRunning": 0,
		"in": cloneObj(Array(256).fill([])),
		"out": cloneObj(Array(256).fill([])),
		"maxSlotSize":65536,
		"name": "Storage Box X",
		"color":"rgb(255,215,216)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Fluid Pipe I": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -2,
		"simulated": false,
		"pipeSpeed": 50, //ticks per pipe operation
		"CN": 0,
		"ticksRunning": 0,
		"in": [[]],
		"out": [[]],
		"maxSlotSize":4,
		"name": "Fluid Pipe I",
		"color":"rgb(0,0,79)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
	"Item Pipe I": {
		//blocks data:
		"power": 0,
		"maxPower": 0,
		"powerConsumption": 0,
		"isSteam": false,
		"isPrimitive": false,
		"machineType": -1,
		"simulated": false,
		"pipeSpeed": 50, //ticks per pipe operation
		"CN": 0,
		"ticksRunning": 0,
		"in": [[]],
		"out": [[]],
		"maxSlotSize":4,
		"name": "Item Pipe I",
		"color":"rgb(0,79,0)",
		"overclock":2,
		"logicSides": [0,0,0,0] //NESW, for non pipes, side = allow output (1 = allow, 0 = no); for pipes (1 = output to that side, 0 = dont output)  
	},
}
for (let m in machines) {
	items[m] = {"itemType":"item","placeBlock":m}
}

//steam age recipes
recipes[3].push({
	"in": [["Coal"  , 1], ["Water", 10]],
	"out":[["Steam", 200]],
	"Ft": 0,
	"time": 750,
})
recipes[3].push({
	"in": [["Wood Log"  , 1], ["Water", 5]],
	"out":[["Steam", 100]],
	"Ft": 2,
	"time": 375,
})
recipes[3].push({
	"in": [["Oil"  , 1], ["Water", 7]],
	"out":[["Steam", 140]],
	"Ft": 2,
	"time": 525,
})
recipes[2].push({
	"in": [["Coal Dust"  , 1], ["Copper Wire", 1],["Wood Plate",1]],
	"out":[["Resistor", 1]],
	"Ft": 2,
	"time": 60,
})
recipes[7].push({
	"in": [["Coal Dust"  , 1], ["Copper Wire", 1],["Wood Plate",1]],
	"out":[["Resistor", 1]],
	"Ft": 2,
	"time": 60,
})

recipes[2].push({
	"in": [["Copper Wire", 3],["Wood Plate",2]],
	"out":[["Basic Circuit Board", 1]],
	"Ft": 2,
	"time": 300,
})
recipes[7].push({
	"in": [["Copper Wire", 3],["Wood Plate",2]],
	"out":[["Basic Circuit Board", 1]],
	"Ft": 2,
	"time": 300,
})

recipes[2].push({
	"in": [["Resistor", 4],["Basic Circuit Board",1],["Copper Wire", 2]],
	"out":[["T1 Circuit", 1]],
	"Ft": 2,
	"time": 800,
})
recipes[7].push({
	"in": [["Resistor", 4],["Basic Circuit Board",1],["Copper Wire", 2]],
	"out":[["T1 Circuit", 1]],
	"Ft": 2,
	"time": 800,
})

recipes[2].push({
	"in": [["Bronze Plate", 8],["Bronze Screw", 6]],
	"out":[["Steam Machine Hull", 1]],
	"Ft": 2,
	"time": 600,
})
recipes[7].push({
	"in": [["Bronze Plate", 8],["Bronze Screw", 6]],
	"out":[["Steam Machine Hull", 1]],
	"Ft": 2,
	"time": 600,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 1],["Iron Plate",8]],
	"out":[["Steam Boiler", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 1],["Iron Plate",8]],
	"out":[["Steam Boiler", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 1],["Iron Plate",6],["Tin Plate", 2]],
	"out":[["Steam Harvester", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 1],["Iron Plate",6],["Tin Plate", 2]],
	"out":[["Steam Harvester", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 1],["Copper Plate",4],["Tin Plate", 12]],
	"out":[["Steam Deposit Miner", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 1],["Copper Plate",4],["Tin Plate", 12]],
	"out":[["Steam Deposit Miner", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 1],["Bronze Plate",8]],
	"out":[["Steam Furnace", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 1],["Bronze Plate",8]],
	"out":[["Steam Furnace", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 1],["Tin Ingot",4],["Bronze Plate", 12]],
	"out":[["Steam Crusher", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 1],["Tin Ingot",4],["Bronze Plate", 12]],
	"out":[["Steam Crusher", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 1],["Water",4],["Copper Plate", 6]],
	"out":[["Steam Ore Washer", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 1],["Water",4],["Copper Plate", 6]],
	"out":[["Steam Ore Washer", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Iron Dust", 49],["Coal Dust", 1]],
	"out":[["Steel Dust", 50]],
	"Ft": 2,
	"time": 2500,
})
recipes[7].push({
	"in": [["Iron Dust", 49],["Coal Dust", 1]],
	"out":[["Steel Dust", 50]],
	"Ft": 2,
	"time": 2500,
})

recipes[2].push({
	"in": [["Steam Machine Hull", 4],["Fluid Pipe I",8],["Storage Box II", 2],["T1 Circuit", 2]],
	"out":[["Steam Assembler", 1]],
	"Ft": 2,
	"time": 1000,
})
recipes[7].push({
	"in": [["Steam Machine Hull", 4],["Fluid Pipe I",8],["Storage Box II", 2],["T1 Circuit", 2]],
	"out":[["Steam Assembler", 1]],
	"Ft": 2,
	"time": 1000,
})

recipes[2].push({
	"in": [["Steel Plate", 2]],
	"out":[["Fluid Pipe I", 1]],
	"Ft": 2,
	"time": 200,
})
recipes[7].push({
	"in": [["Steel Plate", 2]],
	"out":[["Fluid Pipe I", 1]],
	"Ft": 2,
	"time": 200,
})

recipes[2].push({
	"in": [["Steel Plate", 4],["Bronze Plate",8]],
	"out":[["Storage Box II", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Steel Plate", 4],["Bronze Plate",8]],
	"out":[["Storage Box II", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Storage Box I", 1],["T1 Circuit",1]],
	"out":[["Filter", 1]],
	"Ft": 2,
	"time": 500,
})
recipes[7].push({
	"in": [["Storage Box I", 1],["T1 Circuit",1]],
	"out":[["Filter", 1]],
	"Ft": 2,
	"time": 500,
})

recipes[2].push({
	"in": [["Copper Dust", 3],["Tin Dust",1]],
	"out":[["Bronze Dust", 4]],
	"Ft": 2,
	"time": 100,
})
recipes[7].push({
	"in": [["Copper Dust", 3],["Tin Dust",1]],
	"out":[["Bronze Dust", 4]],
	"Ft": 2,
	"time": 100,
})

recipes[2].push({
	"in": [["T1 Circuit", 1],["Bronze Plate",24]],
	"out":[["Item Pipe I", 12]],
	"Ft": 2,
	"time": 600,
})
recipes[7].push({
	"in": [["T1 Circuit", 1],["Bronze Plate",24]],
	"out":[["Item Pipe I", 12]],
	"Ft": 2,
	"time": 600,
})

recipes[2].push({
	"in": [["Storage Box I", 1],["Iron Plate",3]],
	"out":[["Trash Can", 1]],
	"Ft": 2,
	"time": 100,
})
recipes[7].push({
	"in": [["Storage Box I", 1],["Iron Plate",3]],
	"out":[["Trash Can", 1]],
	"Ft": 2,
	"time": 100,
})

recipes[4].push({
	"in": [["Wood Plank", 1]],
	"out":[["Wood Plate", 1]],
	"Ft": 2,
	"time": 500,
})

//ore -> final product skip (with workstation, terrible efficiceny)
recipes[2].push({
	"in": [["Coal Ore"  , 1]],
	"out":[["Coal", 1]],
	"Ft": 2,
	"time": 400,
})
recipes[2].push({
	"in": [["Magnetite Ore", 1]],
	"out":[["Magnetite", 1]],
	"Ft": 2,
	"time": 400,
})

recipes[7].push({
	"in": [["Copper Dust", 3],["Zinc Dust",1]],
	"out":[["Brass Dust", 4]],
	"Ft": 2,
	"time": 100,
})
recipes[7].push({
	"in": [["Copper Dust", 3],["Tin Dust",1],["Lead Dust", 1]],
	"out":[["Potin Dust", 5]],
	"Ft": 2,
	"time": 100,
})
for (let k in items) {
	IDListItems.push(k)
}