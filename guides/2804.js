//Phantom's Hideout
//
//

module.exports = (dispatch, handlers, guide, lang) => {
	guide.type = SP;

	const { entity } = dispatch.require.library;

	let triple_attack = false;
	let back_print = false;
	let back_time = 0;
	let end_back_time = 0;
	let is_one_back = false;
	let timer1 = null;
	let timer2 = null;
	let enrage = 0;
	let enrage_time = 0;
	let counter = 0;
	// let is_hp_79 = false;
	let is_hp_49 = false;
	let mech_total = 0;
	let mech_counter = 0;


	// Floor 2 Antaroth

	function thirdboss_cage_event(clockwise, ent) {
		const colour_order = clockwise ? ["red", "yellow", "blue"] : ["blue", "yellow", "red"];
		const colour_offsets = { "red": 0, "yellow": 120, "blue": 240 };

		const colour_messages = {
			"red": { message: "Red", message_RU: "Красный" },
			"yellow": { message: "Yellow", message_RU: "Желтый" },
			"blue": { message: "Blue", message_RU: "Синий" }
		};

		if (thirdboss_colour_to_use) {
			handlers.text({
				sub_type: "message",
				message: colour_messages[thirdboss_colour_to_use].message,
				message_RU: colour_messages[thirdboss_colour_to_use].message_RU
			});
		}

		for (let i = 0; i < 3; i++) {
			const current_colour = colour_order[(colour_order.indexOf(thirdboss_colour_to_use) + i) % 3];

			handlers.spawn({
				func: "marker",
				args: [false, colour_offsets[current_colour], 150, i * 2600, (i + 1) * 3000, true, null]
			}, ent);
		}
	}

	// Floor 3 Regent
	let boss = null;

	// Floor 4 Lakan
	let seventh_fifty = false;

	function seventh_message_event(skillid) {
		switch (skillid) {
			// Lakan has noticed you.
			case 1043:
				if (!seventh_fifty) {
					handlers.text({
						sub_type: "notification",
						message: "Debuffs > Circles > Bombs",
						message_RU: "ДКБ"
					});
				} else {
					handlers.text({
						sub_type: "notification",
						message: "Debuffs > Bombs > Circles",
						message_RU: "ДБК"
					});
				}
				break;
			// Lakan is trying to take you on one at a time.
			case 1044:
				if (!seventh_fifty) {
					handlers.text({
						sub_type: "notification",
						message: "Circles > Bombs > Debuffs",
						message_RU: "КБД"
					});
				} else {
					handlers.text({
						sub_type: "notification",
						message: "Circles > Debuffs > Bombs",
						message_RU: "КДБ"
					});
				}
				break;
			// Lakan intends to kill all of you at once.
			case 1045:
				if (!seventh_fifty) {
					handlers.text({
						sub_type: "notification",
						message: "Bombs > Debuffs > Circles",
						message_RU: "БДК"
					});
				} else {
					handlers.text({
						sub_type: "notification",
						message: "Bombs > Circles > Debuffs",
						message_RU: "БКД"
					});
				}
				break;
		}
	}

	function seventh_spawn_tables(is_normal_world, ent) {
		const regularWorld = [
			// dps
			{ type: "spawn", func: "marker", args: [false, 180, 225, 0, 2000, true, ["Safe", "Spot"]] },
			{ type: "spawn", func: "marker", args: [false, 210, 225, 2000, 1500, true, ["Safe", "Spot"]] },
			// tank
			{ type: "spawn", func: "marker", args: [false, -45, 225, 0, 2000, true, ["Safe", "Spot"]] },
			{ type: "spawn", func: "marker", args: [false, 0, 225, 2000, 1500, true, ["Safe", "Spot"]] },
			// general safe spots
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 2.8, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 3.46, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 4.12, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 4.75, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 5.38, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 5.97, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 6.58, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 7.2, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 7.8, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 8.44, "ownerName": "SAFE SPOT", "message": "SAFE" }
		];

		const soulWorld = [
			// dps
			{ type: "spawn", func: "marker", args: [false, 210, 225, 0, 2000, true, ["Safe", "Spot"]] },
			{ type: "spawn", func: "marker", args: [false, 180, 225, 2000, 1500, true, ["Safe", "Spot"]] },
			// tank
			{ type: "spawn", func: "marker", args: [false, 0, 225, 0, 2000, true, ["Safe", "Spot"]] },
			{ type: "spawn", func: "marker", args: [false, -45, 225, 2000, 1500, true, ["Safe", "Spot"]] },
			// general safe spots
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 2.8, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 3.46, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 4.12, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 4.75, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 5.38, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 5.97, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 6.58, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 7.2, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 7.8, "ownerName": "SAFE SPOT", "message": "SAFE" },
			{ "type": "spawn", "sub_type": "build_object", "id": 1, "sub_delay": 4000, "distance": 525, "offset": 8.44, "ownerName": "SAFE SPOT", "message": "SAFE" }
		];

		if (is_normal_world) {
			handlers.event(regularWorld);
		} else {
			handlers.event(soulWorld);
		}
	}

	let boss_data = null;
	function set_boss_data(ent) {
		boss_data = ent;
	}




	// 4th floor darkan

	function boss_backcombo_event() {
		dispatch.clearTimeout(timer2);
		counter++;

		if (counter >= 2) {
			handlers.text({
				sub_type: "message",
				message: "Back Combo",
				message_RU: "Задняя комба"
			});
		}

		timer2 = dispatch.setTimeout(() => counter = 0, enrage == 1 ? 2200 : 2500);
	}

	function boss_backattack_event() {
		end_back_time = new Date() - back_time;

		if (!back_print) {
			back_print = true;
			is_one_back = end_back_time > 0 && end_back_time < 1500;

			handlers.text({
				sub_type: "message",
				message: is_one_back ? "Back!" : "!!!",
				message_RU: is_one_back ? "Задняя!" : "!!!"
			});
		}

		dispatch.setTimeout(() => back_print = false, 3500);
	}

	function boss_tripleattack_event() {
		dispatch.clearTimeout(timer1);
		triple_attack = true;
		timer1 = dispatch.setTimeout(() => triple_attack = false, 3500);
	}

	function boss_mech_eventP1(skillid) {
		handlers.event([
			{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 1500] },
			{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 1500] }
		]);

		if ([1402].includes(skillid)) {
			handlers.event([ // left
				{ type: "text", sub_type: "alert", speech: false,
					message: "Left",
					message_RU: "Левый"
				},
				{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 20, 160, 0, 1500] },
				{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 12, 220, 0, 1500] },
				{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 10, 300, 0, 1500] },
				{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 8, 360, 0, 1500] }
			]);
		} else {
			handlers.event([ // right
				{ type: "text", sub_type: "alert", speech: false,
					message: "Right",
					message_RU: "Правый"
				},
				{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 20, 160, 0, 1500] },
				{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 12, 220, 0, 1500] },
				{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 10, 300, 0, 1500] },
				{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 8, 360, 0, 1500] }
			]);
		}
	}

	// 5th floor Bahaar
	function waves_event() {
		handlers.event([
			{ type: "spawn", func: "vector", args: [553, 90, 50, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 270, 50, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 90, 50, 180, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 270, 50, 180, 500, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 6, 400, 0, 6000] }
		]);
	}
	
	// 5th queen

	let next_debuff = 0;
	function debuff_event(send_msg, debuff, ent) {
		if (next_debuff === 0) {
			next_debuff = debuff;
		}

		if (send_msg) {
			const debuff_messages = {
				0: { message: "Debuff", message_RU: "Дебаф (бублик)" },
				1: { message: "Debuff 1", message_RU: "Дебаф (бублик) 1" },
				2: { message: "Debuff 2", message_RU: "Дебаф (бублик) 2" },
				3: { message: "Debuff 3", message_RU: "Дебаф (бублик) 2" },
				4: { message: "Debuff 4", message_RU: "Дебаф (бублик) 3" }
			};

			handlers.text({
				sub_type: "notification",
				message: debuff_messages[next_debuff].message,
				message_RU: debuff_messages[next_debuff].message_RU,
				speech: true
			});

			if (next_debuff !== 0) {
				next_debuff++;
			}

			if (next_debuff > 4) {
				next_debuff = 1;
			}
		}
	}


	function debuff_removed() {
		if (next_debuff != 0) {
			handlers.text({
				sub_type: "notification",
				message: `next debuff: ${next_debuff}`,
				message_RU: `Следующий Дебаф (бублик): ${next_debuff}`,
				speech: false
			});
		}

		next_debuff = 0;
	}




	return {
		//floor 1 argog
		"nd-2804-1000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"h-939-3001-30": [{ type: "text", sub_type: "message", message: "Reveal soon...", message_RU: "Скоро разоблачение..." }],
		"s-2804-1000-1201-0": [
			{ type: "text", sub_type: "message", message: "Stun (Pushback)", message_RU: "Рёв (откид)" },
			{ type: "text", sub_type: "message", delay: 1000, message: "3" },
			{ type: "text", sub_type: "message", delay: 2000, message: "2" },
			{ type: "text", sub_type: "message", delay: 3000, message: "1" },
			{ type: "text", sub_type: "message", delay: 4000, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 5000] }
		],
		"s-2804-1000-2178-0": [{ type: "text", sub_type: "message", message: "Spin (bleed)", message_RU: "Несколько ударов" }],
		"s-2804-1000-1107-0": [{ type: "text", sub_type: "message", message: "Many Hits", message_RU: "Несколько ударов" }],
		"s-2804-1000-1112-0": [{ type: "text", sub_type: "message", message: "Target", message_RU: "Таргет" }],
		"s-2804-1000-1115-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1400, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 4000] }
		],
		"s-2804-1000-1118-0": [{ type: "text", sub_type: "message", message: "Spin (bleeding)", message_RU: "Крутилка" }],
		"s-2804-1000-1164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (кровоток)" }],
		"s-2804-1000-1167-0": [{ type: "text", sub_type: "message", message: "Many Hits", message_RU: "Несколько ударов" }],
		"s-2804-1000-1172-0": "s-939-3001-112-0",
		"s-2804-1000-1301-0": "s-939-3001-112-0",
		"s-2804-1000-1302-0": "s-939-3001-112-0",
		"s-2804-1000-1170-0": [
			{ type: "text", sub_type: "message", message: "Turn + Pushback", message_RU: "Разворот + Откид" },
			{ type: "text", sub_type: "message", message: "Pushback", message_RU: "Откид", delay: 2700 }
		],
		"s-2804-1000-1175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 4000] }
		],
		"s-2804-1000-1177-0": [{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" }],
		"s-2804-1000-1178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (кровоток)" }],
		"s-2804-1000-1203-0": [{ type: "text", sub_type: "message", message: "Phantom x3 (bleed)", message_RU: "Прыжки x3 (кровоток)" }],
		"s-2804-1000-1207-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (кровоток)" }],
		"s-2804-1000-1213-0": [{ type: "text", sub_type: "message", message: "Reveal | Phantom (bleed)", message_RU: "Разоблачение | Прыжки (кровоток)" }],
		"s-2804-1000-1212-0": [{ type: "text", sub_type: "message", message: "Flash", message_RU: "Байт" }],



		//floor 1 kashir
		"nd-2804-2000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"s-2804-2000-1164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (Кровоток)" }],
		"s-2804-2000-2164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (Кровоток)" }],
		"s-2804-2000-1166-0": [{ type: "text", sub_type: "message", message: "Turn-back", message_RU: "Оборот назад" }],
		"s-2804-2000-2166-0": [{ type: "text", sub_type: "message", message: "Turn-back", message_RU: "Оборот назад" }],
		"s-2804-2000-1175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1500, message: "Dodge", message_RU: "Эвейд" }
		],
		"s-2804-2000-2175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1500, message: "Dodge", message_RU: "Эвейд" }
		],
		"s-2804-2000-1178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (Кровоток)" }],
		"s-2804-2000-2178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (Кровоток)" }],
		"s-2804-2000-1181-0": [
			{ type: "text", sub_type: "message", message: "Rock Throw", message_RU: "Полоса вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 10, 1000, 0, 4000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 350, 1000, 0, 4000] }
		],
		"s-2804-2000-2181-0": [
			{ type: "text", sub_type: "message", message: "Rock Throw", message_RU: "Полоса вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 10, 1000, 0, 4000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 350, 1000, 0, 4000] }
		],
		"s-2804-2000-1182-0": [{ type: "text", sub_type: "message", message: "Knockdown", message_RU: "Опрокид" }],
		"s-2804-2000-2182-0": [{ type: "text", sub_type: "message", message: "Knockdown", message_RU: "Опрокид" }],
		"s-2804-2000-1185-0": [
			{ type: "text", sub_type: "message", message: "Big jump (Kaia's Shield)", message_RU: "Прыжок (кайа)", class_position: "priest" },
			{ type: "text", sub_type: "message", message: "Big jump (Thrall of Protection)", message_RU: "Прыжок (кайа)", class_position: "mystic" },
			{ type: "text", sub_type: "alert", delay: 110000, message: "Big jump soon...", message_RU: "Скоро прыжок...", class_position: "heal" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 500, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 750, 0, 6000] }
		],
		"s-2804-2000-2185-0": [
			{ type: "text", sub_type: "message", message: "Big jump (Kaia's Shield)", message_RU: "Прыжок (кайа)", class_position: "priest" },
			{ type: "text", sub_type: "message", message: "Big jump (Thrall of Protection)", message_RU: "Прыжок (кайа)", class_position: "mystic" },
			{ type: "text", sub_type: "alert", delay: 110000, message: "Big jump soon...", message_RU: "Скоро прыжок...", class_position: "heal" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 500, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 750, 0, 6000] }
		],
		"s-2804-2000-1202-0": [
			{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 180, 500, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 180, 500, 0, 3000] }
		],
		"s-2804-2000-2202-0": [
			{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 180, 500, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 180, 500, 0, 3000] }
		],
		"s-2804-2000-1207-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (Кровоток)" }],
		"s-2804-2000-2207-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (Кровоток)" }],
		"s-2804-2000-1212-0": [{ type: "text", sub_type: "message", message: "Flash (bleed)", message_RU: "Байт (Кровоток)" }],
		"s-2804-2000-2212-0": [{ type: "text", sub_type: "message", message: "Flash (bleed)", message_RU: "Байт (Кровоток)" }],
		
		//floor 2 hagufna
		"nd-2804-3000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"s-2804-3000-1116-0": [
			{ type: "text", sub_type: "message", message: "Jump", message_RU: "Прыжок" }
		],
		"s-2804-3000-1116-1": [
			{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [true, 912, 0, 110, 8, 480, 0, 3000] }
		],

		// 3 оборота -> прыжок (145 -> 139 -> 140)
		"s-2804-3000-1145-0": [{ type: "text", sub_type: "message", message: "3x360 | Jump", message_RU: "3 оборота | Прыжок" }],
		"s-2804-3000-1139-0": [{ type: "text", sub_type: "message", delay: 1000, message: "Jump", message_RU: "Прыжок" }],
		"s-2804-3000-1140-0": [
			{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 110, 8, 480, 0, 3000] }
		],

		// 109 -> 402 -> 130
		"s-2804-3000-1109-0": [{ type: "text", sub_type: "message", message: "Forward Jump", message_RU: "Прыжок вперед" }],
		"s-2804-3000-1402-0": [{ type: "text", sub_type: "message", message: "Jump", message_RU: "Прыжок" }],

		// 136 -> 144 -> 130
		"s-2804-3000-1136-0": [{ type: "text", sub_type: "message", message: "2x360 | Strike", message_RU: "2 оборота | Меч" }],
		"s-2804-3000-1144-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],
		"s-2804-3000-2144-0": "s-2804-3000-1144-0",
		"s-2804-3000-2136-0": "s-2804-3000-1136-0",

		// 134 -> 147
		"s-2804-3000-1134-0": [{ type: "text", sub_type: "message", message: "Turn around | Back", message_RU: "Поворот | Удар назад" }],
		"s-2804-3000-1134-1": [{ type: "text", sub_type: "message", message: "Back", message_RU: "Удар назад" }],
		"s-2804-3000-1147-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],
		"s-2804-3000-2147-0": "s-2804-3000-1147-0",

		// 142 -> 143 114 130
		"s-2804-3000-1142-0": [{ type: "text", sub_type: "message", message: "2x360 | Strike", message_RU: "2 оборота | Меч" }],
		"s-2804-3000-1143-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],
		"s-2804-3000-1130-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],
		"s-2804-3000-2130-0": "s-2804-3000-1130-0",
		"s-2804-3000-2142-0": "s-2804-3000-1142-0",
		"s-2804-3000-2143-0": "s-2804-3000-1143-0",

		"s-2804-3000-1141-0": [{ type: "text", sub_type: "message", message: "2x360 | Eviscerate", message_RU: "2 оборота | Потрошение" }], // 141 -> 146 114 130
		"s-2804-3000-1146-0": [{ type: "text", sub_type: "message", message: "Eviscerate | Strike", message_RU: "Потрошение | Меч" }],      // 146 ->         114 -> 130
		"s-2804-3000-2141-0": "s-2804-3000-1141-0",
		"s-2804-3000-2146-0": "s-2804-3000-1146-0",

		// стяжка -> бублики (350 -> 302)
		"s-2804-3000-1350-0": [
			{ type: "text", sub_type: "message", message: "Red: Donuts (Out > In)", message_RU: "Стяжка | Бублики (От него > К нему)" },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 240, 0, 5000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 8, 480, 0, 5000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 3, 950, 0, 5000] },
			{ type: "spawn", func: "item", args: [553, 0, 0, 3800, 1000] },
			{ type: "text", sub_type: "message", delay: 3800, message: "In", message_RU: "К нему" },
			{ type: "spawn", func: "marker", args: [false, 180, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "spawn", func: "marker", args: [false, 0, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "spawn", func: "marker", args: [false, 90, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "spawn", func: "marker", args: [false, 270, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "text", sub_type: "alert", delay: 58000, message: "Mechanics soon...", message_RU: "Скоро стяжка..." }
		],
		// стяжка -> волна (357 -> 110)
		"s-2804-3000-1357-0": [
			{ type: "text", sub_type: "message", message: "Purple: Get Out", message_RU: "Стяжка | От него" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 20, 500, 2000, 5000] },
			{ type: "text", sub_type: "alert", delay: 58000, message: "Mechanics soon...", message_RU: "Скоро стяжка..." }
		],

		//"s-2804-3000-1114-0": [{ type: "text", sub_type: "message", message: "Eviscerate (slow)", message_RU: "Потрошение (медленно)" }],
		//"s-2804-3000-1130-0": [{ type: "text", sub_type: "message", message: "Target", message_RU: "Таргет" }],
		"s-2804-3000-1151-0": [{ type: "text", sub_type: "message", message: "Back teleport | Strike", message_RU: "Телепорт назад | Меч" }], // 151 149 148 -> 130
		"s-2804-3000-1149-1": [{ type: "text", sub_type: "message", message: "Back teleport (Target)", message_RU: "Телепорт назад (таргет)" }],
		"s-2804-3000-1117-0": [{ type: "text", sub_type: "message", message: "Teleport (Target)", message_RU: "Телепорт (таргет)" }],         //         117 -> 130
		"s-2804-3000-1356-0": [{ type: "text", sub_type: "message", message: "Teleport (Target)", message_RU: "Телепорт (таргет)" }],         //         356 -> 147
		"s-2804-3000-1148-1": [{ type: "text", sub_type: "message", message: "Teleport (Target)", message_RU: "Телепорт (таргет)" }],

		"s-2804-3000-1351-0": [
			{ type: "text", sub_type: "message", message: "Shield!", message_RU: "Щит!" },
		],
		"s-2804-3000-1401-0": [
			{ type: "text", sub_type: "message", message: "30% AOE!", message_RU: "АОЕ" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" }
		],



		//floor 2 antaroth
		"nd-2804-4000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"s-2804-4000-1105-0": [{ type: "text", sub_type: "message", message: "Target Cage", message_RU: "Клетка (таргет)" }],
		"s-2804-4000-1119-0": [{ type: "spawn", func: "circle", args: [true, 553, 0, -325, 12, 325, 0, 2000] }],
		"s-2804-4000-1107-0": [{ type: "text", sub_type: "message", message: "Random Jump", message_RU: "Прыжок (стан)" }],
		"s-2804-4000-1107-1": [{ type: "spawn", func: "circle", args: [false, 553, 0, 85, 12, 250, 0, 2000] }],
		"s-2804-4000-1109-0": [
			{ type: "text", sub_type: "message", message: "Left", message_RU: "Лево" },
			{ type: "text", sub_type: "message", message: "Inward (In > Out)", message_RU: "Внутрь (к нему > от него)", delay: 1000 },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 200, 0, 1500] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 200, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 20, 160, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 12, 220, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 10, 300, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 8, 360, 0, 1500] },
			{ type: "spawn", func: "marker", args: [false, 270, 300, 0, 1500, true, null] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 18, 157, 1500, 4000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 307, 1500, 4000] }
		],
		"s-2804-4000-1111-0": [
			{ type: "text", sub_type: "message", message: "Right", message_RU: "Право" },
			{ type: "text", sub_type: "message", message: "Outward (Out > In)", message_RU: "Наружу (от него > к нему)", delay: 1000 },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 200, 0, 1500] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 200, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 20, 160, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 12, 220, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 10, 300, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 8, 360, 0, 1500] },
			{ type: "spawn", func: "marker", args: [false, 90, 300, 0, 1500, true, null] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 18, 157, 1500, 4000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 307, 1500, 4000] }
		],
		"s-2804-4000-1113-0": [{ type: "text", sub_type: "message", message: "Front | Back Stun", message_RU: "Передний | Задний" }],
		"s-2804-4000-1115-0": [{ type: "text", sub_type: "message", message: "Spin Attack", message_RU: "Круговая" }],
		"s-2804-4000-1120-0": [{ type: "text", sub_type: "message", message: "Energy Beam (Slow)", message_RU: "Волна (медленно)" }],
		"s-2804-4000-1204-0": [{ type: "text", sub_type: "message", message: "Energy Beam (Fast)", message_RU: "Волна (быстро)" }],
		// "s-2804-4000-1202-0": [{ type: "text", sub_type: "message", message: "Spin or Front | Back Stun", message_RU: "Круговая или передний | Задний" }],
		"s-2804-4000-1206-0": [{ type: "text", sub_type: "message", message: "Orbs", message_RU: "Шары" }],
		"s-2804-4000-1309-0": [{ type: "text", sub_type: "message", message: "AoE", message_RU: "АоЕ" }],
		"s-2804-4000-1310-0": [{ type: "text", sub_type: "message", message: "Puddles", message_RU: "Лужи" }],
		"s-2804-4000-1405-0": [{ type: "text", sub_type: "message", message: "Clones", message_RU: "Копии: круговые" }],
		"s-2804-4000-1311-0": "s-2804-4000-1310-0",
		"s-2804-4000-1312-0": "s-2804-4000-1310-0",
		"s-2804-4000-1313-0": "s-2804-4000-1310-0",
		"s-2804-4000-1314-0": "s-2804-4000-1310-0",
		"s-2804-4000-1315-0": [{ type: "text", sub_type: "message", message: "Pushback", message_RU: "Откид (кайа)" }],
		"s-2804-4000-1400-0": [{ type: "text", sub_type: "message", message: "Clones: Beam", message_RU: "Копии: волны" }],
		"s-2804-4000-1401-0": [{ type: "text", sub_type: "message", message: "Clones: Spin", message_RU: "Копии: круговые" }],
		"s-2804-4000-1119-0": [{ type: "text", sub_type: "message", message: "Stun", message_RU: "Копии: круговые" }],
		"s-2804-4000-2104-0": "s-2804-4000-1104-0",
		"s-2804-4000-2105-0": "s-2804-4000-1105-0",
		"s-2804-4000-2119-0": "s-2804-4000-1119-0",
		"s-2804-4000-2107-0": "s-2804-4000-1107-0",
		"s-2804-4000-2107-1": "s-2804-4000-1107-1",
		"s-2804-4000-2109-0": "s-2804-4000-1109-0",
		"s-2804-4000-2111-0": "s-2804-4000-1111-0",
		"s-2804-4000-2113-0": "s-2804-4000-1113-0",
		"s-2804-4000-2115-0": "s-2804-4000-1115-0",
		"s-2804-4000-2120-0": "s-2804-4000-1120-0",
		"s-2804-4000-2204-0": "s-2804-4000-1204-0",
		"s-2804-4000-2202-0": "s-2804-4000-1202-0",
		"s-2804-4000-2206-0": "s-2804-4000-1206-0",
		"s-2804-4000-1410-0": [{ type: "text", sub_type: "message", message: "Cage", message_RU: "Клетка" }],



		//floor 3 Regent
		"ns-2804-6000": [{ type: "func", func: () => boss = null }],
		"nd-2804-6000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"am-2804-6001-32010224": [
			{ type: "func", func: () => boss = 1 },
			{ type: "text", delay: 52000, sub_type: "notification", message: "True Debuff in 5 seconds", message_RU: "Правда через 5 сек." },
			{ type: "event", delay: 80000, args: [
				{ type: "func", check_func: () => boss === 1, func: () => boss = null },
				{ type: "text", check_func: () => boss === 1, sub_type: "message", message_RU: "Смена дебаффа", message: "Debuff reload" }
			] }
		],
		"am-2804-6001-32010220": [
			{ type: "func", func: () => { boss = 0; } },
			{ type: "text", delay: 52000, sub_type: "notification", message: "False Debuff in 5 seconds", message_RU: "Ложь через 5 сек." },
			{ type: "event", delay: 80000, args: [
				{ type: "func", check_func: () => boss === 0, func: () => boss = null },
				{ type: "text", check_func: () => boss === 0, sub_type: "message", message_RU: "Смена дебаффа", message: "Debuff reload" }
			] }
		],
		"am-2804-6001-32010224-1": "am-2804-6001-32010224",
		"am-2804-6001-32010220-1": "am-2804-6001-32010220",
		"s-2804-6000-1108-0": [{ type: "text", sub_type: "message", message: "Back Attack!", message_RU: "Откид назад!" }],
		"s-2804-6000-1150-0": [{ type: "text", sub_type: "message", message: "Phantom", message_RU: "Фантом" }],
		"s-2804-6000-1228-0": [
			{ type: "text", sub_type: "message", message: "Team Up", message_RU: "Камни (вместе)!!!" },
			{ type: "text", sub_type: "message", delay: 3500, message: "Dodge", message_RU: "Эвейд" }
		],
		"s-2804-6000-1230-0": [
			{ type: "text", sub_type: "message", message: "AOE", message_RU: "АОЕ" },
			{ type: "text", sub_type: "message", delay: 1300, message: "Dodge!", message_RU: "" }
		],
		"s-2804-6000-1231-0": [
			{ type: "text", sub_type: "message", message: "Out Safe", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 3000] }
		],
		"s-2804-6000-1232-0": [
			{ type: "text", sub_type: "message", message: "In Safe", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 3000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 3, 1000, 0, 3000] }
		],
		"s-2804-6000-1235-0": [{ type: "text", sub_type: "message", message: "Debuffs", message_RU: "" }],
		"s-2804-6000-1236-0": [{ type: "text", sub_type: "message", message: "Counter Attack (Bait)", message_RU: "" }],
		"s-2804-6000-1503-0": [{ type: "text", sub_type: "message", message: "Egg Puddle", message_RU: "" }],
		"s-2804-6103-1204-0": [{ type: "text", sub_type: "message", message: "Bombs", message_RU: "" }],
		"s-2804-6105-1201-0": [{ type: "text", sub_type: "message", message: "Bombs", message_RU: "" }],
		"s-2804-6000-1501-0": [
			{ type: "text", sub_type: "message", message: "Front Swipe", message_RU: "" },
			{ type: "text", sub_type: "notification", message: "Go front or dodge!", delay: 1000 }
		],
		"s-2804-6103-2108-0": "s-2804-6000-1108-0",


		//floor 4 Lakan
		"nd-2804-7000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"h-2804-7000-99": [{ type: "func", func: () => seventh_fifty = false }],
		"h-2804-7000-50": [{ type: "func", func: () => seventh_fifty = true }],
		"dm-0-0-90340703": [{ type: "func", func: seventh_message_event, args: [1043] }], // Lakan has noticed you.
		"dm-0-0-90340704": [{ type: "func", func: seventh_message_event, args: [1044] }], // Lakan is trying to take you on one at a time.
		"dm-0-0-90340705": [{ type: "func", func: seventh_message_event, args: [1045] }], // Lakan intends to kill all of you at once.
		"s-2804-7000-1105-0": [
			{ type: "text", sub_type: "message", message: "Discarding", message_RU: "Откид пятка" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, -95, 850, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 95, 850, 0, 3000] }
		],
		"s-2804-7000-2105-0": "s-2804-7000-1105-0",
		"s-2804-7000-2136-0": "s-2804-7000-1136-0",
		"s-2804-7000-2110-0": "s-2804-7000-1110-0",
		"s-2804-7000-2129-0": "s-2804-7000-1129-0",
		"s-2804-7000-2130-0": "s-2804-7000-1130-0",
		"s-2804-7000-2132-0": "s-2804-7000-1132-0",
		"s-2804-7000-2133-0": "s-2804-7000-1133-0",
		"s-2804-7000-2135-0": "s-2804-7000-1135-0",
		"s-2804-7000-1136-0": [{ type: "text", sub_type: "message", message: "Claw", message_RU: "Когти" }],
		"s-2804-7000-1110-0": [{ type: "text", sub_type: "message", message: "Claw", message_RU: "Когти" }],
		"s-2804-7000-1129-0": [{ type: "text", sub_type: "message", message: "IN", message_RU: "К Боссу!" }],
		"s-2804-7000-1130-0": [
			{ type: "text", sub_type: "message", message: "Shield Strike", message_RU: "Удар щитом" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 130, 0, 270, 0, 2500] }
		],
		"s-2804-7000-1132-0": [
			{ type: "text", sub_type: "message", message: "AOE Shield", message_RU: "АОЕ щитом!" },
			{ type: "spawn", func: "semicircle", args: [-65, 65, 553, 0, 0, null, 600, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 0, 40, -65, 600, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 0, 40, 65, 600, 0, 3000] }
		],
		"s-2804-7000-1133-0": [
			{ type: "text", sub_type: "message", message: "AOE Shield", message_RU: "АОЕ щитом!" },
			{ type: "spawn", func: "semicircle", args: [-65, 65, 553, 0, 0, null, 600, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 0, 40, -65, 600, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 0, 40, 65, 600, 0, 6000] }
		],
		"s-2804-7000-1135-0": [{ type: "text", sub_type: "message", message: "IN", message_RU: "К Боссу!" }],
		"s-2804-7000-1240-0": [
			{ type: "text", sub_type: "message", message: "Donuts", message_RU: "Бублики!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 200, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 380, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 520, 0, 6000] }
		],
		"s-2804-7000-2240-0": "s-2804-7000-1240-0",
		"s-2804-7000-2701-0": "s-2804-7000-1701-0",
		"s-2804-7000-2113-0": "s-2804-7000-1113-0",
		"s-2804-7000-2151-0": "s-2804-7000-1151-0",
		"s-2804-7000-2152-0": "s-2804-7000-1152-0",
		"s-2804-7000-2138-0": "s-2804-7000-1138-0",
		"s-2804-7000-2140-0": "s-2804-7000-1140-0",
		"s-2804-7000-1401-0": [{ type: "text", sub_type: "message", message: "Plague/Regress", message_RU: "Регресс!!" }],
		"s-2804-7000-1402-0": [{ type: "text", sub_type: "message", message: "Sleep", message_RU: "Слип!!" }],
		"s-2804-7000-1701-0": [{ type: "text", sub_type: "message", message: "Back + front", message_RU: "Назад + Вперед" }],
		"s-2804-7000-1113-0": [{ type: "text", sub_type: "message", message: "Bait", message_RU: "Байт" }],
		"s-2804-7000-1151-0": [{ type: "text", sub_type: "message", message: "Stun", message_RU: "Стан" }],
		"s-2804-7000-1152-0": [
			{ type: "text", sub_type: "message", message: "Stun + Back", message_RU: "Стан + Откид назад" },
			{ type: "spawn", func: "semicircle", args: [110, 250, 553, 0, 0, null, 1000, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 70, -1000, 70, 1000, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 290, -1000, -70, 1000, 0, 6000] }
		],
		"s-2804-7000-1138-0": [{ type: "spawn", func: "circle", args: [false, 553, 0, 10, 0, 250, 0, 3000] }],
		"s-2804-7000-1140-0": [
			{ type: "text", sub_type: "message", message: "Donuts", message_RU: "Бублики!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 200, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 380, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 520, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 0, 700, 0, 6000] }
		],
		"s-2804-7000-2154-0": "s-2804-7000-1154-0",
		"s-2804-7000-2155-0": "s-2804-7000-1155-0",
		"s-2804-7000-1154-0": [
			{ "type": "text", "sub_type": "message", "message": "Out", message_RU: "От него => К нему" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 10, 0, 250, 0, 3000] }
		],
		"s-2804-7000-1155-0": [
			{ "type": "text", "sub_type": "message", "message": "In", message_RU: "К нему => От него" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 10, 0, 250, 0, 3000] }
		],
		"s-2804-7000-1901-0": [ // normal world
			{ type: "text", sub_type: "notification", message: "Debuffs Closest", message_RU: "Дебафф (ближние)" },
			{ type: "func", func: seventh_spawn_tables, args: [true] }
		],
		"s-2804-7000-1902-0": [ // soul world
			{ type: "text", sub_type: "notification", message: "Debuffs Farthest", message_RU: "Дебафф (дальние)" },
			{ type: "func", func: seventh_spawn_tables, args: [false] }
		],
		"s-2804-7000-1903-0": [ // normal world
			{ type: "text", sub_type: "notification", message: "Gather + Cleanse", message_RU: "Бомбы (вместе!) + клинс" },
			{ type: "func", func: seventh_spawn_tables, args: [true] }
		],
		"s-2804-7000-1904-0": [ // soul world
			{ type: "text", sub_type: "notification", message: "Gather + No cleanse", message_RU: "Бомбы (вместе!) + БЕЗ клинса" },
			{ type: "func", func: seventh_spawn_tables, args: [false] }
		],
		"s-2804-7000-1905-0": [ // normal world
			{ type: "text", sub_type: "notification", message: "Spread", message_RU: "Круги (отдельно!)" },
			{ type: "func", func: seventh_spawn_tables, args: [true] }
		],
		"s-2804-7000-1906-0": [ // soul world
			{ type: "text", sub_type: "notification", message: "Gather", message_RU: "Круги (вместе!)" },
			{ type: "func", func: seventh_spawn_tables, args: [false] }
		],
		"s-2804-7000-2144-0": "s-2804-7000-1144-0",
		"s-2804-7000-2145-0": "s-2804-7000-1145-0",
		"s-2804-7000-1144-0": [
			{ "type": "text", "sub_type": "message", "message": "Out", message_RU: "От него" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 10, 0, 250, 0, 3000] }
		],
		"s-2804-7000-1145-0": [
			{ "type": "text", "sub_type": "message", "message": "In", message_RU: "К нему" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 10, 0, 250, 0, 3000] }
		],



		//floor 4 Darkan
		"ns-2804-8000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],

		"rb-2804-8000": [
			{ type: "func", func: () => enrage = 1 },
			{ type: "func", func: () => enrage_time = new Date() }
		],

		"re-2804-8000": [
			{ type: "func", func: () => enrage = 0 }
		],
		"h-2804-8000-100": [{ type: "func", func: () => is_hp_49 = false }],
		"h-2804-8000-49": [{ type: "text", sub_type: "message", message: "49%" }, { type: "func", func: () => is_hp_49 = true }],

		"s-2804-8000-1401-0": [{ type: "func", func: boss_mech_eventP1, args: [1401] }],
		"s-2804-8000-1402-0": [{ type: "func", func: boss_mech_eventP1, args: [1402] }],
		"s-2804-8000-1303-0": [{ type: "text", sub_type: "message", message: "Spin Attack", message_RU: "Крутилка" }],
		"s-2804-8000-1101-0": [{ type: "func", func: boss_backattack_event }],
		"s-2804-8000-1102-0": [{ type: "func", func: () => back_time = new Date() }],
		"s-2804-8000-1103-0": [{ type: "func", func: boss_backcombo_event }],
		"s-2804-8000-1106-0": [{ type: "func", func: boss_backcombo_event }],
		"s-2804-8000-2101-0": "s-2804-8000-1101-0",
		"s-2804-8000-2102-0": "s-2804-8000-1102-0",
		"s-2804-8000-2103-0": "s-2804-8000-1103-0",
		"s-2804-8000-2106-0": "s-2804-8000-1106-0",
		"s-2804-8000-2112-0": "s-2804-8000-1112-0",
		"s-2804-8000-1117-0": [{ type: "text", sub_type: "message", message: "Front", message_RU: "Удар вперед" }],

		"s-2804-8000-1811-0": [{ type: "text", sub_type: "message", message: "SILENCE", message_RU: "ТИШИНА" }],

		"s-2804-8000-2101-0": "s-2804-8000-1101-0",
		"s-2804-8000-2102-0": "s-2804-8000-1102-0",
		"s-2804-8000-2103-0": "s-2804-8000-1103-0",
		"s-2804-8000-2105-0": "s-2804-8000-1105-0",
		"s-2804-8000-2106-0": "s-2804-8000-1106-0",
		"s-2804-8000-2108-0": "s-2804-8000-1108-0",
		"s-2804-8000-2111-0": "s-2804-8000-1111-0",
		"s-2804-8000-2117-0": "s-2804-8000-1117-0",

		"s-2804-8000-1115-0": [
			{ type: "text", sub_type: "message", message: "Puddle" }
		],
		"s-2804-8000-1114-0": [
			{ type: "text", sub_type: "message", message: "Target Attack", message_RU: "Таргет" },
			{ type: "spawn", func: "vector", args: [553, 90, 150, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 90, 75, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 270, 75, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 270, 150, 0, 1300, 0, 2500] }
		],
		"s-2804-8000-1302-0": [
			{ type: "text", sub_type: "message", message: "AOE", message_RU: "AOE" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 500, 100, 6000] }
		],

		"s-2804-8000-1801-0": [{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Стан" }],
		"qb-2804-8000-3036039": [
			{ type: "text", sub_type: "message", delay: 75000, message: "Triple Soon", message_RU: "Скоро тройная" },
			{ type: "text", sub_type: "notification", delay: 75000, message: "Triple Soon", message_RU: "Скоро тройная", speech: false },
			{ type: "func", func: boss_tripleattack_event }
		],
		"qb-2804-8000-3036040": [{ type: "func", func: boss_tripleattack_event }],
		"qb-2804-8000-3036041": [{ type: "func", func: boss_tripleattack_event }],
		"s-2804-8000-2103-0": "s-2804-8000-1103-0",
		"s-2804-8000-2106-0": "s-2804-8000-1106-0",
		"s-2804-8000-2112-0": "s-2804-8000-1112-0",
		"s-2804-8000-2114-0": "s-2804-8000-1114-0",
		"s-2804-8000-2115-0": "s-2804-8000-1115-0",
		"s-2804-8000-2117-0": "s-2804-8000-1117-0",
		"s-2804-8000-2118-0": "s-2804-8000-1118-0",



		//floor 5 Bahaar
		"nd-2804-9000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		// Not enraged
		"s-2804-9000-1101-0": [
			{ type: "text", sub_type: "message", message: "4 Hit Combo", message_RU: "270 (сейф-зона)" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 195, 500, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 270, 500, 0, 3000] }
		],
		"s-2804-9000-1103-0": [
			{ type: "text", sub_type: "message", message: "Front (Dodge)", message_RU: "Удар вперед (эвейд)" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 400, 8, 350, 100, 3000] }
		],
		"s-2804-9000-1107-0": [{ type: "text", sub_type: "message", message: "4 Hit (3)", message_RU: "4" }],
		"s-2804-9000-1108-0": [
			{ type: "text", sub_type: "message", message: "Back Throw", message_RU: "Стан назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 180, 250, 12, 300, 100, 3000] }
		],
		"s-2804-9000-1111-0": [
			{ type: "text", sub_type: "message", message: "Back", message_RU: "Удар назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 185, 500, 8, 490, 1500, 2000] }
		],
		"s-2804-9000-1112-0": [
			{ type: "text", sub_type: "message", message: "Perfect Defense (Fast)", message_RU: "Идеальный блок (быстро)" },
			{ type: "text", sub_type: "message", delay: 1200, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 3000] }
		],
		"s-2804-9000-1113-0": [{ type: "text", sub_type: "message", message: "Throw (Bait)", message_RU: "Молот (байт)" }],
		"s-2804-9000-1114-0": [
			{ type: "text", sub_type: "message", message: "Front Slam", message_RU: "Удар назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 260, 10, 320, 100, 3000] }
		],
		"s-2804-9000-1115-0": [{ type: "text", sub_type: "message", delay: 1100, message: "Dodge", message_RU: "Эвейд" }], // Knockup
		"s-2804-9000-1116-0": [
			{ type: "text", sub_type: "message", message: "Donuts (In)", message_RU: "Бублики (к нему)" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 12, 290, 100, 2000] }
		],
		"s-2804-9000-1116-1": [
			{ type: "text", sub_type: "message", message: "Out > In", message_RU: "От него > К нему" },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 290, 100, 4000] }
		],
		"s-2804-9000-1117-0": [{ type: "text", sub_type: "message", message: "Jump (Bait)", message_RU: "Прыжок (байт)" }],
		"s-2804-9000-1118-0": [{ type: "text", sub_type: "message", message: "Jump (Tank)", message_RU: "Прыжок (танк)" }],
		"s-2804-9000-1118-1": [{ type: "spawn", func: "circle", args: [false, 553, 0, 400, 12, 300, 100, 2000] }],
		"s-2804-9000-1119-0": [
			{ type: "text", sub_type: "message", message: "Left Swipe", message_RU: "Слева" },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 20, 160, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 12, 220, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 10, 300, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 8, 360, 0, 2000] },
			{ type: "spawn", func: "marker", args: [false, 270, 300, 100, 2000, true, null] }
		],
		"s-2804-9000-1120-0": [
			{ type: "text", sub_type: "message", message: "Right Swipe", message_RU: "Справа" },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 20, 160, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 12, 220, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 10, 300, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 8, 360, 0, 2000] },
			{ type: "spawn", func: "marker", args: [false, 90, 300, 100, 2000, true, null] }
		],
		"s-2804-9000-1121-0": [
			{ type: "text", sub_type: "message", message: "Waves (Left)", message_RU: "Волны (левая)" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 37, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 143, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-1122-0": [
			{ type: "text", sub_type: "message", message: "Waves (Left) 3nd fast", message_RU: "Волны (левая) 3-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 37, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 143, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-1123-0": [
			{ type: "text", sub_type: "message", message: "Waves (Left) 2nd fast", message_RU: "Волны (левая) 2-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 37, 125, 0, 2500, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 143, 125, 0, 2500, false, ["safe", "safe"]] }
		],
		"s-2804-9000-1125-0": [
			{ type: "text", sub_type: "message", message: "Front | Right Scratch", message_RU: "Удар вперед | Правый черкаш" },
			{ type: "text", sub_type: "message", delay: 1750, message: "Dodge", message_RU: "Эвейд" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 400, 8, 350, 100, 2000] },
			{ type: "spawn", func: "vector", args: [553, 60, 290, 175, 800, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 60, 290, -5, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 290, 95, -5, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 290, 95, 175, 800, 0, 3500] }
		],
		"s-2804-9000-1131-0": [
			{ type: "text", sub_type: "message", message: "Front | Left Scratch", message_RU: "Удар вперед | Левый черкаш" },
			{ type: "text", sub_type: "message", delay: 1200, message: "Dodge", message_RU: "Эвейд" },
			{ type: "spawn", func: "circle", args: [false, 553, 358, 340, 6, 630, 100, 2000] },
			{ type: "spawn", func: "vector", args: [553, 90, 115, 186, 800, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 90, 115, 6, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 270, 250, 6, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 270, 250, 186, 800, 0, 3500] }
		],
		"s-2804-9000-1135-0": [
			{ type: "text", sub_type: "message", message: "Perfect Defense", message_RU: "Идеальный блок" },
			{ type: "text", sub_type: "message", delay: 800, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 3000] }
		],
		"s-2804-9000-1137-0": [
			{ type: "text", sub_type: "message", message: "Hammer back", message_RU: "Удар назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 185, 500, 8, 490, 100, 2000] }
		],
		"s-2804-9000-1138-0": [{ type: "text", sub_type: "message", delay: 900, message: "Dodge", message_RU: "Эвейд" }], // Knockup (Bait)
		"s-2804-9000-1139-0": [{ type: "text", sub_type: "message", delay: 200, message: "Dodge!", message_RU: "Эвейд!" }],
		"s-2804-9000-1140-0": [
			{ type: "text", sub_type: "message", message: "Waves (Right)", message_RU: "Волны (правая)" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 323, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 217, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-1141-0": [
			{ type: "text", sub_type: "message", message: "Waves (Right) 3nd fast", message_RU: "Волны (правая) 3-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 323, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 217, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-1142-0": [
			{ type: "text", sub_type: "message", message: "Waves (Right) 2nd fast", message_RU: "Волны (правая) 2-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 323, 125, 0, 2500, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 217, 125, 0, 2500, false, ["safe", "safe"]] }
		],
		"s-2804-9000-1307-0": [
			{ type: "text", sub_type: "message", message: "!", message_RU: "!" },
			{ type: "text", sub_type: "message", delay: 20000, message: "Last aerolite", message_RU: "Последний метеор" }
		],
		"s-2804-9000-1308-0": [{ type: "text", sub_type: "message", message: "Stun (1)", message_RU: "Стан (1)" }],
		"s-2804-9000-1309-0": [{ type: "text", sub_type: "message", message: "Stun (2)", message_RU: "Стан (2)" }],
		"s-2804-9000-1310-0": [{ type: "text", sub_type: "message", message: "Stun (3)", message_RU: "Стан (3)" }],
		"s-2804-9000-1311-0": [
			{ type: "text", sub_type: "message", message: "Wrath", message_RU: "Облепиха" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 500, 0, 6000] }
		],
		"s-2804-9000-1312-0": [
			{ type: "text", sub_type: "message", message: "Wrath", message_RU: "Облепиха" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 500, 0, 6000] }
		],
		// Enraged
		"s-2804-9000-2101-0": "s-2804-9000-1101-0",
		"s-2804-9000-2103-0": "s-2804-9000-1103-0",
		"s-2804-9000-2107-0": "s-2804-9000-1107-0",
		"s-2804-9000-2108-0": "s-2804-9000-1108-0",
		"s-2804-9000-2111-0": "s-2804-9000-1111-0",
		"s-2804-9000-2112-0": [
			{ type: "text", sub_type: "message", delay: 1000, message: "Perfect Defense x2 (Slow)", message_RU: "Идеальный блок x2 (медленно)" },
			{ type: "text", sub_type: "message", delay: 2400, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 4000] }
		],
		"s-2804-9000-2113-0": "s-2804-9000-1113-0",
		"s-2804-9000-2114-0": "s-2804-9000-1114-0",
		"s-2804-9000-2115-0": [{ type: "text", sub_type: "message", delay: 100, message: "Dodge", message_RU: "Эвейд" }], // Knockup
		"s-2804-9000-2116-0": "s-2804-9000-1116-0",
		"s-2804-9000-2116-1": "s-2804-9000-1116-1",
		"s-2804-9000-2117-0": "s-2804-9000-1117-0",
		"s-2804-9000-2118-0": "s-2804-9000-1118-0",
		"s-2804-9000-2118-1": "s-2804-9000-1118-1",
		"s-2804-9000-2119-0": "s-2804-9000-1119-0",
		"s-2804-9000-2120-0": "s-2804-9000-1120-0",
		"s-2804-9000-2121-0": "s-2804-9000-1121-0",
		"s-2804-9000-2122-0": "s-2804-9000-1122-0",
		"s-2804-9000-2123-0": "s-2804-9000-1123-0",
		"s-2804-9000-2125-0": "s-2804-9000-1125-0",
		"s-2804-9000-2131-0": "s-2804-9000-1131-0",
		"s-2804-9000-2135-0": [
			{ type: "text", sub_type: "message", message: "Perfect Defense x2", message_RU: "Идеальный блок x2" },
			{ type: "text", sub_type: "message", delay: 800, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 4000] }
		],
		"s-2804-9000-2802-0": [
			{ type: "text", sub_type: "message", message: "Enraged = Out Normal = In", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 260, 0, 8000] }
		],
		"s-2804-9000-2801-0": [{ type: "text", sub_type: "message", message: "Dunk AOE SLOW!", message_RU: "Эвейд" }], // Knockup
		"s-2804-9000-2137-0": "s-2804-9000-1137-0",
		"s-2804-9000-2138-0": [{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд" }], // Knockup (Bait)
		"s-2804-9000-2139-0": "s-2804-9000-1139-0",
		"s-2804-9000-2140-0": "s-2804-9000-1140-0",
		"s-2804-9000-2141-0": "s-2804-9000-1141-0",
		"s-2804-9000-2142-0": "s-2804-9000-1142-0",
		"ab-2804-9000-90442303": [{ type: "text", sub_type: "message", message: "Plague/Regress", message_RU: "Регресс" }],




		//floor 5 Manaya
		"nd-2804-10000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"die": [{ type: "func", func: debuff_removed }],
		"h-2804-10000-99": [{ type: "func", func: () => next_debuff = 0 }],
		"s-2804-10000-1103-0": [{ type: "text", sub_type: "message", message_RU: "Передняя атака", message: "Frontal Attack" }],
		"s-2804-10000-1205-0": [{ type: "text", sub_type: "message", message_RU: "Телепорт", message: "Teleport" }],
		"s-2804-10000-1102-0": [{ type: "text", sub_type: "message", message_RU: "К нему > От него", message: "In > Out" }],
		"s-2804-10000-1504-0": [{ type: "text", sub_type: "message", message_RU: "Хвост вперед", message: "Out > In" }],
		"s-2804-10000-1113-0": [{ type: "text", sub_type: "message", message_RU: "Левая рука ", message: "Left Hand Attack" }],
		"s-2804-10000-1105-0": [{ type: "text", sub_type: "message", message_RU: "Правая рука ", message: "Right Hand Attack" }],
		"s-2804-10000-1108-0": [{ type: "text", sub_type: "message", message_RU: "Атака (таргет)", message: "Target Attack" }],
		"s-2804-10000-1114-0": [{ type: "text", sub_type: "message", message_RU: "Удар назад", message: "Back Attack" }],
		"s-2804-10000-1115-0": [{ type: "text", sub_type: "message", message_RU: "Хвост", message: "Tail" }],
		"s-2804-10000-1111-0": [{ type: "text", sub_type: "message", message_RU: "Хвост вперед", message: "Frontal Attack" }],
		"s-2804-10000-1109-0": [{ type: "text", sub_type: "message", message_RU: "АоЕ (таргет)", message: "AoE Target" }],
		"s-2804-10000-1104-0": [{ type: "text", sub_type: "message", message: "Stomp" }],
		"s-2804-10000-1112-0": [{ type: "func", func: debuff_event, args: [true, 0] }],
		"s-2804-10000-2103-0": "s-2804-10000-1103-0",
		"s-2804-10000-2205-0": "s-2804-10000-1205-0",
		"s-2804-10000-2113-0": "s-2804-10000-1113-0",
		"s-2804-10000-2105-0": "s-2804-10000-1105-0",
		"s-2804-10000-2108-0": "s-2804-10000-1108-0",
		"s-2804-10000-2114-0": "s-2804-10000-1114-0",
		"s-2804-10000-2115-0": "s-2804-10000-1115-0",
		"s-2804-10000-2111-0": "s-2804-10000-1111-0",
		"s-2804-10000-2109-0": "s-2804-10000-1109-0",
		"s-2804-10000-2104-0": "s-2804-10000-1104-0",
		"s-2804-10000-2107-0": "s-2804-10000-1107-0",
		"s-2804-10000-2106-0": "s-2804-10000-1106-0",
		"s-2804-10000-1107-0": [{ type: "text", sub_type: "message", message_RU: "Лазер", message: "Laser Attack" },
		{ type: "spawn", func: "vector", args: [912, 360, 985, 180, 950, 0, 2500] },
		{ type: "spawn", func: "vector", args: [912, 369, 995, 180, 950, 0, 2500] },
		{ type: "spawn", func: "vector", args: [912, 351, 995, 180, 950, 0, 2500] }
		],
		"s-2804-10000-1501-0": [{ type: "text", sub_type: "message", message_RU: "", message: "Normal Safe" },
		{ type: "spawn", func: "marker", args: [false, 45, 300, 0, 5000, true, ["Safe", "Normal"]] },
		{ type: "spawn", func: "marker", args: [false, 180, 300, 0, 5000, true, ["Safe", "Normal"]] },
		{ type: "spawn", func: "marker", args: [false, 310, 300, 0, 5000, true, ["Safe", "Normal"]] }
		],
		"h-2804-10000-50":[
			{ type: "text", sub_type: "message", message: "50%" },
			{ type: "text", sub_type: "notification", message: "Shield Soon..", message_RU: "", delay: 1000 }
		],
		"h-2804-10000-30":[
			{ type: "text", sub_type: "message", message: "30%" },
			{ type: "text", sub_type: "notification", message: "Shield Soon..", message_RU: "", delay: 1000 }
		],
		"h-2804-10000-20":[
			{ type: "text", sub_type: "message", message: "20%" },
			{ type: "text", sub_type: "notification", message: "Shield Soon..", message_RU: "", delay: 1000 }
		],
		"s-2804-10000-1505-0": [{ type: "text", sub_type: "message", message_RU: "АоЕ (таргет)", message: "Break Shield!!" }],
		"s-2804-10000-1106-0": [{ type: "text", sub_type: "message", message_RU: "Бомба (таргет)", message: "Target Bomb" }],
		"s-2804-10000-1204-0": [{ type: "text", sub_type: "message", message_RU: "Большая АоЕ (бежать)", message: "Big AoE (Run)" },
		{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 550, 0, 4000] }
		],
		"am-2804-10000-428041001": [{ type: "func", func: debuff_event, args: [false, 2] }], // greedy thought #1
		"am-2804-10000-428041002": [{ type: "func", func: debuff_event, args: [false, 3] }], // hateful thought #2
		"am-2804-10000-428041003": [{ type: "func", func: debuff_event, args: [false, 4] }], // desperate thought #3
		"am-2804-10000-428041004": [{ type: "func", func: debuff_event, args: [false, 1] }], // desperate thought #4
		"am-2804-10000-428041001-1": "am-2804-10000-428041001",
		"am-2804-10000-428041002-1": "am-2804-10000-428041002",
		"am-2804-10000-428041003-1": "am-2804-10000-428041002",
		"am-2804-10000-428041004-1": "am-2804-10000-428041002",
		"s-2804-10000-1302-0": [
			{ type: "text", sub_type: "message", message: "Plague of Exhaustion", message_RU: "Чума/Регресс", class_position: "priest" },
			{ type: "text", sub_type: "message", message: "Regression", message_RU: "Регресс", class_position: "mystic" }
		]
	};
};

