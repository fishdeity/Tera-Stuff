//Aesir's End Hardmode
//
//

module.exports = (dispatch, handlers, guide, lang) => {
	guide.type = SP;
	
	return {
		"nd-2802-1000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"s-2802-1000-1101-0": [{ type: "text", sub_type: "message", message: "", message_RU: "" }],
		"s-2802-1000-1102-0": [{ type: "text", sub_type: "message", message: "", message_RU: "" }],
		"s-2802-1000-1103-0": [{ type: "text", sub_type: "message", message: "Leaping", message_RU: "" }],
		"s-2802-1000-1104-0": [{ type: "text", sub_type: "message", message: "spin", message_RU: "" }],
		"s-2802-1000-1105-0": [{ type: "text", sub_type: "message", message: "Bloodflower", message_RU: "" }],
		"s-2802-1000-1106-0": [{ type: "text", sub_type: "message", message: "spinning death", message_RU: "" }],
		"s-2802-1000-1107-0": [
			{ type: "text", sub_type: "message", message: "dreamslash", message_RU: ""},
			{ type: "text", sub_type: "notification", message: "dodge!", message_RU: "", class_position: "tank"}
		],
		"s-2802-1000-1108-0": [
			{ type: "text", sub_type: "message", message: "ground bash", message_RU: ""},
			{ type: "text", sub_type: "notification", message: "dodge!", message_RU: "", class_position: "tank"}
		],
		"s-2802-1000-1109-0": [
			{ type: "text", sub_type: "notification", message: "Glaive Strike", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 360, 0, 3000] }
		],
		"s-2802-1000-1110-0": [{ type: "text", sub_type: "message", message: "Spinning death 3rd", message_RU: "" }],
		"s-2802-1000-1112-0": [{ type: "text", sub_type: "message", message: "Gungnir", message_RU: "" }],
		"s-2802-1000-1113-0": [{ type: "text", sub_type: "message", message: "overhead slash", message_RU: "" }],
		"s-2802-1000-1305-0": [{ type: "text", sub_type: "message", message: "runeburst", message_RU: "" }],
		"s-2802-1000-1306-0": [
			{ type: "text", sub_type: "message", message: "Ragnarok", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 7000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 500, 0, 7000] }
		],
		"s-2802-1000-1307-0": [
			{ type: "text", sub_type: "message", message: "Glaive Strike", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 360, 0, 3000] }
		],
		"s-2802-1000-1308-0": [
			{ type: "text", sub_type: "message", message: "sc1", message_RU: "" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 140, 250, 0, 2000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 270, 250, 0, 2000] }
		],
	
		"s-2802-1000-1309-0": [
			{ type: "text", sub_type: "message", message: "sc2", message_RU: "" },
			{ type: "text", sub_type: "notification", message: "dodge!", message_RU: "" }
		],
		
		"s-2802-1000-1310-0": [{ type: "text", sub_type: "notification", message: "Twilight Stomp!", message_RU: "" }],
		"s-2802-1000-1311-0": [{ type: "text", sub_type: "message", message: "Twilight Poke", message_RU: "" }],
		"s-2802-1000-1312-0": [{ type: "text", sub_type: "message", message: "Twilight Ending", message_RU: "" }],
		"s-2802-1000-1313-0": [{ type: "text", sub_type: "notification", message: "dodge", message_RU: ""}],
		
		//enraged
		"s-2802-1000-2101-0": "s-2802-1000-1101-0",
		"s-2802-1000-2102-0": "s-2802-1000-1102-0",
		"s-2802-1000-2103-0": "s-2802-1000-1103-0",
		"s-2802-1000-2104-0": "s-2802-1000-1104-0",
		"s-2802-1000-2105-0": "s-2802-1000-1105-0",
		"s-2802-1000-2106-0": "s-2802-1000-1106-0",
		"s-2802-1000-2108-0": "s-2802-1000-1108-0",
		"s-2802-1000-2109-0": "s-2802-1000-1109-0",
		"s-2802-1000-2110-0": "s-2802-1000-1110-0",
		"s-2802-1000-2112-0": "s-2802-1000-1112-0",
		
		"s-2802-1000-1301-0": [
			{ type: "text", sub_type: "message", message: "Shield!", message_RU: "" },
			{ type: "text", sub_type: "notification", delay: 2000, message: "Plague/Regress", message_RU: "" }
		]
	};
};

