// Sea of Honor
//
// Made by star guild (Arborea Reborn)
module.exports = (dispatch, handlers, guide, lang) => {
	const { player } = dispatch.require.library;

	let green = false;
	let purple = false;
	let boss_sixty = false;

    function boss_mech_event(skillid) {
        if (skillid == 121) { //Starts Green (Out First)
			green = true;
			handlers.event([
				{ type: "spawn", func: "circle", args: [true, 553, 0, 170, 8, 290, 3000, 2000] }, 
				{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 8, 280, 4000, 3000] }, 
				{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 4, 570, 4000, 3000] } 
			]);
		}
		
		if (skillid == 122) { //Starts Purple (In First)
			purple = true;
			handlers.event([
				{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 8, 280, 3000, 2000] },
				{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 4, 570, 3000, 2000] }, 
				{ type: "spawn", func: "circle", args: [true, 553, 0, 170, 8, 290, 4000, 3000] } 
			]);
		}

		if (skillid == 120) { // Ends Purple (Ends In)
			if (purple && !boss_sixty) { //boss above sixty - starts purple (in)
				handlers.event([
					{ type: "text", sub_type: "message", message: "In > Out > In", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 8, 280, 5000, 3000] },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 4, 570, 5000, 3000] }
				]);
				dispatch.setTimeout(() => purple = false, 2000);
			
			} else if (green && !boss_sixty){ //boss above sixty - starts green (out)
				handlers.event([
					{ type: "text", sub_type: "message", message: "Out > In > In", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 8, 280, 5000, 3000] },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 4, 570, 5000, 3000] }
				]);
				dispatch.setTimeout(() => green = false, 2000);

			} else if (purple && boss_sixty) { //boss under sixty - starts purple (in)
				handlers.event([
					{ type: "text", sub_type: "message", message: "In > Out > Wave > In", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 8, 280, 5000, 5000] }, 
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 4, 570, 5000, 5000] } 
				]);
				dispatch.setTimeout(() => purple = false, 2000);
			
			} else if (green && !boss_sixty){ //boss under sixty - starts green (out)
				handlers.event([
					{ type: "text", sub_type: "message", message: "Out > In > Wave > In", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 8, 280, 5000, 3000] },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 150, 4, 570, 5000, 3000] }
				]);
				dispatch.setTimeout(() => green = false, 2000);
			}
		}
		if (skillid == 123) { //Ends Green (Ends Out)
			if (green && !boss_sixty) { //boss above sixty - starts green (out)
				handlers.event([
					{ type: "text", sub_type: "message", message: "Out > In > Out", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 200, 8, 450, 5000, 3000] } 
				]);
				dispatch.setTimeout(() => green = false, 2000);

			} else if (purple && !boss_sixty) { //boss above sixty - starts purple (in)
				handlers.event([
					{ type: "text", sub_type: "message", message: "In > Out > Out", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 200, 8, 450, 5000, 3000] } 
				]);
				dispatch.setTimeout(() => purple = false, 2000);

			} else if (green && boss_sixty) { //boss under sixty - starts green (out)
				handlers.event([
					{ type: "text", sub_type: "message", message: "Out > In> Wave > Out", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 200, 8, 450, 5000, 5000] } 
				]);
				dispatch.setTimeout(() => green = false, 2000);

			} else if (purple && boss_sixty) { //boss under sixty - starts purple (in)
				handlers.event([
					{ type: "text", sub_type: "message", message: "In > Out > Wave > Out", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 912, 0, 200, 8, 450, 5000, 5000] } 
				]);
				dispatch.setTimeout(() => purple = false, 2000);
			}
		}
		
		if (skillid == 127) { // Random Jump
			if (boss_sixty) // if boss hp is under 60
				handlers.event([
					{ type: "text", sub_type: "message", message: "Jump > Out", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 553, 0, 170, 8, 290, 1000, 2000] }
				]);
				
			else //if boss hp is above 60
				handlers.event([
					{ type: "text", sub_type: "message", message: "Jump > In", message_RU: "" },
					{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 15, 200, 250, 1000] },
					{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 10, 300, 1000, 4000] }
				]);
		}
	}
	function boss_start_event() { 
		boss_sixty = false;
	}

	function boss_sixty_event() {
		boss_sixty = true;
	};
	function start_dungeon_event() {
		const abnormality_change = (added, event) => {
			if (debuffs_targe[event.id]) {
				handlers.marker({ id: event.target, color: "blue", sub_delay: 3500 });

				if (player.isMe(event.target.toString()) || player.playersInParty.has(event.target.toString())) {
					if (added) {
						if (debuff_call_event) {
							dispatch.clearTimeout(debuff_call_event);
						}

						debuff_call_event = dispatch.setTimeout(() => {
							handlers.text({
								sub_type: "alert",
								message: debuffs_targe[event.id].message,
								message_RU: debuffs_targe[event.id].message_RU
							});

							debuff_call_event = null;
						}, 1500);
					}
				}
			}
		};

		if (!debuff_tracker_started) {
			dispatch.hook("S_ABNORMALITY_BEGIN", dispatch._mod.majorPatchVersion >= 107 ? 5 : 4, abnormality_change.bind(null, true));
			dispatch.hook("S_ABNORMALITY_END", 1, abnormality_change.bind(null, false));

			debuff_tracker_started = true;
		}
	}
	return {
		"dm-0-0-30209203": [{ type: "func", func: start_dungeon_event }],
		"dm-0-0-30209204": [{ type: "func", func: start_dungeon_event }],

		"nd-2811-2200": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],

		"h-2811-2200-99": [{ type: "func", func: boss_start_event }],
		"h-2811-2200-59": [
			{ type: "text", sub_type: "message", message: "60%", message_RU: "" },
		],
		//Boss health
		"h-2811-2200-59": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-58": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-57": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-56": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-55": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-54": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-53": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-52": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-51": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-50": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-49": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-48": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-47": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-46": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-45": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-44": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-43": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-42": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-41": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-40": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-39": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-38": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-37": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-36": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-35": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-34": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-33": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-32": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-31": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-30": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-29": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-28": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-27": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-26": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-25": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-24": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-23": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-22": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-21": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-20": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-19": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-18": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-17": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-16": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-15": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-14": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-13": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-12": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-11": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-10": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-9": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-8": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-7": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-6": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-5": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-4": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-3": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-2": [{ type: "func", func: boss_sixty_event }],
		"h-2811-2200-1": [{ type: "func", func: boss_sixty_event }],

		//Boss attacks/mechs
		"s-2811-2200-108-0": [
			{ type: "text", sub_type: "message", message: "Front Stun", message_RU: "" },
			{ type: "spawn", func: "circle", args: [true, 553, 0, 170, 20, 120, 200, 2000] }
		],
		"s-2811-2200-121-0": [{ type: "func", func: boss_mech_event, args: [121] }], 
		"s-2811-2200-122-0": [{ type: "func", func: boss_mech_event, args: [122] }],
		"s-2811-2200-120-0": [{ type: "func", func: boss_mech_event, args: [120] }], 
		"s-2811-2200-123-0": [{ type: "func", func: boss_mech_event, args: [123] }], 
		"s-2811-2200-127-0": [{ type: "func", func: boss_mech_event, args: [127] }],
		"s-2811-2200-128-0": [{ type: "text", sub_type: "message", message: "Knockup - Dodge", message_RU: "" }],
		"s-2811-2200-129-0": [
			{ type: "text", sub_type: "message", message: "Hammer Toss - Dodge", message_RU: "" },
			{ type: "spawn", func: "vector", args: [553, 90, 100, 0, 500, 200, 2000] },
			{ type: "spawn", func: "vector", args: [553, 270, 100, 0, 500, 200, 2000] }
		],
		"s-2811-2200-133-1": [
			{ type: "text", sub_type: "message", message: "Donuts", message_RU: "" },
			{ type: "spawn", func: "circle", args: [true, 445, 0, 0, 10, 300, 200, 5000] },
			{ type: "spawn", func: "circle", args: [true, 445, 0, 0, 6, 600, 200, 5000] },
			{ type: "spawn", func: "circle", args: [true, 445, 0, 0, 4, 900, 200, 5000] }
		],
		"s-2811-2200-137-0":[{ type: "text", sub_type: "message", message: "Inner Wave", message_RU: "" }],
		"s-2811-2200-139-0":[{ type: "text", sub_type: "message", message: "Outer Wave", message_RU: "" }],
		"s-2811-2200-301-0":[
			{ type: "text", sub_type: "message", message: "Suction - Dodge", message_RU: "", delay: 0},
			{ type: "text", sub_type: "message", message: "Block for your party", message_RU: "", class_position: "tank", delay:1000},
			{ type: "text", sub_type: "message", message: "Go to the tank for block", message_RU: "", class_position: ["dps", "priest", "mystic"], delay:1000},
			{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 15, 450, 10, 1000] }
		],

		//Debuffs
		"s-3020-9102-122-0": [{ type: "text", sub_type: "message", message: "Lightning - Dodge", message_RU: "" }], 
		"s-3020-9101-123-0": [{ type: "text", sub_type: "message", message: "Witch - Fear", message_RU: "" }]
	};
};
