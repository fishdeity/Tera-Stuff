//The Observatory 
//
//

module.exports = (dispatch, handlers, guide, lang) => {
	guide.type = SP;
	
	return {
		"nd-2809-1000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"h-2809-1000-60":[
			{ type: "text", sub_type: "message", message: "60%" },
			{ type: "text", sub_type: "notification", message: "Blue/Red Soon!", message_RU: "", delay: 1000 }
		],
		"h-2809-1000-40":[
			{ type: "text", sub_type: "message", message: "40%" },
			{ type: "text", sub_type: "notification", message: "Pylons!!", message_RU: "", delay: 1000 }
		],
		"h-2809-1000-10":[
			{ type: "text", sub_type: "message", message: "10%" },
			{ type: "text", sub_type: "notification", message: "Waves!!", message_RU: "", delay: 1000 }
		],

		"ns-2809-1001": [{ type: "spawn", func: "marker", args: [false, 0, 0, 0, 60000000, true, ["1111", "Orb"]] },],
		"ns-2809-1002": [{ type: "spawn", func: "marker", args: [false, 0, 0, 0, 60000000, false, ["2222", "Orb"]] },],
		"ns-2809-1003": [{ type: "spawn", func: "marker", args: [false, 0, 0, 0, 60000000, false, ["3333", "Orb"]] },],
		"ns-2809-1004": [{ type: "spawn", func: "marker", args: [false, 0, 0, 0, 60000000, true, ["4444", "Orb"]] },],
		"ns-2809-1005": [{ type: "spawn", func: "marker", args: [false, 0, 0, 0, 60000000, false, ["5555", "Orb"]] },],
//debuff1	"am-2809-1000-428091004":
//	2	"am-2809-1000-428091004": 
//	3	"am-2809-1000-428091004": 
//	4	"am-2809-1000-428091004": 
//	5	"am-2809-1000-428091005": 

		"s-2809-1000-1102-0": [{ type: "text", sub_type: "message", message: "", message_RU: "front" }],
		"s-2809-1000-2102-0": [{ type: "text", sub_type: "message", message: "", message_RU: "front" }],
		"s-2809-1000-1101-0": [{ type: "text", sub_type: "message", message: "", message_RU: "front wave" }],
		"s-2809-1000-2101-0": [{ type: "text", sub_type: "message", message: "", message_RU: "front wave" }],
		"s-2809-1000-1103-0": [{ type: "text", sub_type: "message", message: "back", message_RU: "back" }],
		"s-2809-1000-2103-0": [{ type: "text", sub_type: "message", message: "back", message_RU: "back" }],
		"s-2809-1000-1307-0": [{ type: "text", sub_type: "notification", message: "go to puddle!!", message_RU: "go to puddle!" }],
		"s-2809-1000-1301-0": [{ type: "text", sub_type: "message", message: "# Change", message_RU: "# Change" }],
		"s-2809-1013-1401-0": [{ type: "text", sub_type: "notification", message: "res bait!!", message_RU: "res bait!!" }],
		"s-2809-1013-1403-0": [{ type: "text", sub_type: "message", message: "", message_RU: "LASER" }],
		"s-2809-1000-1303-0": [
			{ type: "text", sub_type: "message", message: "puddle stay close", message_RU: "puddle stay close" },
			{ type: "text", sub_type: "notification", delay: 46000, message: "Orbs or Puddle soon...", message_RU: "" }
		],
		"s-2809-1000-1302-0": [{ type: "text", sub_type: "message", message: "go to orb!!", message_RU: "go to orb!!" },
			{ type: "text", sub_type: "notification", delay: 46000, message: "Orbs or Puddle soon...", message_RU: "" }
		],
		"s-2809-1000-1314-0": [{ type: "text", sub_type: "message", message: "kill pylons", message_RU: "" },
			{ type: "text", sub_type: "notification", delay: 100000, message: "Pylons soon...", message_RU: "" }
		],
		"s-2809-1000-1304-0": [
			{ type: "text", sub_type: "message", message: "Purge Aoe", message_RU: "" },
			{ type: "text", sub_type: "alert", delay: 400, message: "2", message_RU: "" },
			{ type: "text", sub_type: "alert", delay: 1300, message: "1", message_RU: "" }
		],

		// Lifeform
		"s-2809-1000-1309-0": [
			{ type: "text", sub_type: "message", message: "Enraged = IN Normal = OUT", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 5, 275, 0, 5000] }
		],

		// donut mech unenraged
		"s-2809-1000-1310-0": [
			{ type: "text", sub_type: "message", message: "wave in 4", message_RU: "" , delay : 100},
			{ type: "text", sub_type: "message", message: "wave in 3", message_RU: "" , delay : 2000},
			{ type: "text", sub_type: "message", message: "wave in 2", message_RU: "" , delay : 3000},
			{ type: "text", sub_type: "message", message: "wave in 1", message_RU: "" , delay : 4000},
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 5, 275, 0, 8000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 5, 600, 0, 8000] }
		],

		// donut mech
		"s-2809-1000-1311-0": [
			{ type: "text", sub_type: "message", message: "wave in 4", message_RU: "" , delay : 100},
			{ type: "text", sub_type: "message", message: "wave in 3", message_RU: "" , delay : 2000},
			{ type: "text", sub_type: "message", message: "wave in 2", message_RU: "" , delay : 3000},
			{ type: "text", sub_type: "message", message: "wave in 1", message_RU: "" , delay : 4000},
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 5, 275, 0, 8000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 5, 600, 0, 8000] }
		],

		"s-2809-1000-1312-0": [
			{ type: "text", sub_type: "message", message: "Blue Left", message_RU: "" },
			{ type: "spawn", func: "marker", args: [false, 270, 150, 0, 5000, true, null] },
			{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 5000] },
			{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 5000] },
			{ type: "text", sub_type: "alert", delay: 80000, message: "Blue/Red soon...", message_RU: "" }
		],	
		"s-2809-1000-1313-0": [
			{ type: "text", sub_type: "message", message: "Blue Right", message_RU: "" },
			{ type: "spawn", func: "marker", args: [false, 90, 150, 0, 5000, true, null] },
			{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 5000] },
			{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 5000] },
			{ type: "text", sub_type: "alert", delay: 80000, message: "Blue/Red soon...", message_RU: "" }
		]	
	};
};

