// Phantom hideout
//
// made by star

module.exports = (dispatch, handlers, guide, lang) => {
	guide.type = ES;

	let debuff = null; // default debuff
	const { HIGHLIGHT_ITEM } = module.parent.exports.spawn;
	const { player } = dispatch.require.library;
    const Vec3 = require("tera-vec3");
	
	let shield_timer1 = null;
	let shield_timer2 = null;
	let print_shield = true;
	let print_hp = true;
	let is_hp_74_39 = false;
	let thirdboss_colour_to_use = null;
	let thirdboss_counter = 0;
	let thirdboss_timer = null;
	let boss = null;
	let print_loading = true;
	let print_lasers = true;
	let boss7_hp_49 = false;
	let sec_aggro = false;
	let enrage_time = 0;
	let enrage = 0;
	let debuff_list = [];
	let type = -1;
	let back_print = false;
	let back_time = 0;
	let end_back_time = 0;
	let is_one_back = false;
	let counter = 0;
	let counter1_date = null;
	let prev_back_attack = 0;
	let prev_date = 0;
	let ninth_triple_swipe_remaining = 0;
	let triples_timer = null;
	let secondary_timer = null;
	let secondary_aggro_date = 0;
	let is_ninth_floor = false;
	let ninth_floor_fifty = false;
	


	dispatch.hook("S_USER_EFFECT", "*", e => {
		if (!is_ninth_floor) return;
		if (e.circle == 3 && e.operation == 1 && e.source == boss_data.gameId) {
			secondary_aggro_date = new Date();
		}
	});

	function shield_event() {
		dispatch.clearTimeout(shield_timer1);
		dispatch.clearTimeout(shield_timer2);

		shield_timer1 = dispatch.setTimeout(() => {
			if (!is_hp_74_39) {
				handlers.text({
					sub_type: "message",
					message: "Shield in 5 seconds!",
					message_RU: "Через 5 сек. щит!"
				});
			}
		}, 85000);

		shield_timer2 = dispatch.setTimeout(() => {
			if (!is_hp_74_39) {
				handlers.text({
					sub_type: "message",
					message: "Shield in 15 seconds!",
					message_RU: "Через 15 сек. щит!"
				});
			}
		}, 75000);
	}

	function boss_hp_event(hp) {
		if ([74, 39].includes(hp)) {
			if (print_hp) {
				dispatch.clearTimeout(shield_timer1);
				dispatch.clearTimeout(shield_timer2);
				print_hp = false;
				is_hp_74_39 = true;
				dispatch.setTimeout(() => print_hp = true, 15000);
			}
		}
		if ([89, 59, 29].includes(hp)) { // до щита
			if (print_shield) {
				print_shield = false;
				is_hp_74_39 = false;
				dispatch.setTimeout(() => print_shield = true, 15000);

				handlers.text({
					sub_type: "alert",
					message: "Ready for Shield",
					message_RU: "Готовность ломать щит"
				});
			}
		}
	}

	function thirdboss_backattack_event() {
		dispatch.clearTimeout(thirdboss_timer);
		thirdboss_counter++;

		if (thirdboss_counter >= 2) {
			handlers.text({ sub_type: "message", message: "Back Stun", message_RU: "Задний" });
		}

		thirdboss_timer = dispatch.setTimeout(() => thirdboss_counter = 0, 3000);
	}

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
	

	function waves_event() {
		handlers.event([
			{ type: "spawn", func: "vector", args: [553, 90, 50, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 270, 50, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 90, 50, 180, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 270, 50, 180, 500, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 6, 400, 0, 6000] },
			{ type: "text", sub_type: "alert", delay: 60000, message: "Waves soon...", message_RU: "Скоро волны..." }
		]);
	}

	dispatch.hook("S_ABNORMALITY_BEGIN", dispatch._mod.majorPatchVersion >= 107 ? 5 : 4, event => {
		if (event.id === 90442502) {
			if (dispatch._mod.game.me.is(event.target)) {
				handlers.text({ sub_type: "notification", message: "Laser on you", message_RU: "Лазер на тебе" });
			} else {
				const member = player.playersInParty.get(event.target);
				if (member) {
					handlers.text({
						sub_type: "message",
						message: `Laser on ${member.name}`,
						message_RU: `Лазер на ${member.name}`
					});
				}
			}
		}
	});
	
	//For DARKAN FUNCTIONS
	

	dispatch.hook("S_USER_EFFECT", "*", e => {
		if (!is_ninth_floor) return;
		if (e.circle == 3 && e.operation == 1 && e.source == boss_data.gameId) {
			secondary_aggro_date = new Date();
		}
	});

	function boss_backattack_event() {
		end_back_time = new Date() - back_time;

		if (!back_print) {
			back_print = true;
			is_one_back = end_back_time > 0 && end_back_time < 1500;

			if (is_one_back) {
				handlers.text({
					sub_type: "message",
					message_RU: "360",
					message: "360",
				});
			}
		}
		dispatch.setTimeout(() => back_print = false, 3500);
	}


	function boss_backattack_event_new(curr, ent) {
		let start = new Date();
		let tmp = prev_date;
		prev_date = start;

		let time_diff = start - tmp;

		let prev = prev_back_attack;
		prev_back_attack = curr;

		let back_combo_time_diff = 5000;
		if (counter1_date != null) {
			back_combo_time_diff = start - counter1_date;
		}

		if (curr == 1103 || curr == 1106) {
			let secondary_time_diff = start - secondary_aggro_date;
			const markers = [
				[
					{ type: "text", sub_type: "message", message_RU: "Левый", message: "Left" },
					{ type: "spawn", func: "marker", args: [false, 300, 100, 0, 2500, true, null] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 2500] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 2500] }
				],
				[
					{ type: "text", sub_type: "message", message_RU: "Правый", message: "Right" },
					{ type: "spawn", func: "marker", args: [false, 60, 100, 0, 2500, true, null] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 2500] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 2500] }
				]
			];

			if (secondary_time_diff < 3000) {
				if (ninth_floor_fifty) {
					let safe_spot_index = curr == 1103 ? 0 : 1;
					handlers.event(markers[safe_spot_index]);
				}
				ninth_secondary_event();
			}
		}

		if (prev == 1106 && curr == 1103 && time_diff < 1000) {
			handlers.text({
				sub_type: "message",
				message_RU: "360",
				message: "360"
			});
		} else if (prev === 1103 && curr === 1105 && time_diff < 1000) {
			counter = 1;
			counter1_date = new Date();
		} else if (prev === 1105 && curr === 1106 && counter === 1 && time_diff < 1500 && back_combo_time_diff < 1500) {
			counter = 2;
		} else if (prev === 1106 && curr === 1108 && counter == 2 && time_diff < 1000 && back_combo_time_diff < 2000) {
			handlers.text({
				sub_type: "message",
				message_RU: "2x360",
				message: "2x360"
			});
		} else {
			counter = 0;
			counter1_date = null;
		}
	}


	function ninth_new_swipe_event(curr, ent) {
		ninth_triple_swipe_remaining--;
		if (ninth_triple_swipe_remaining > 0) {
			if (curr == 1407) {
				handlers.event([
					{ type: "text", sub_type: "message", message_RU: "Левый", message: "Left" },
					{ type: "spawn", func: "marker", args: [false, 300, 100, 0, 1000, true, null] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 1000] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 1000] }
				]);
			} else {
				handlers.event([
					{ type: "text", sub_type: "message", message_RU: "Правый", message: "Right" },
					{ type: "spawn", func: "marker", args: [false, 60, 100, 0, 1000, true, null] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 1000] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 1000] }
				]);
			}
		} else {
			// non triple
			if (curr == 1407) {
				handlers.event([
					{ type: "text", sub_type: "message", message_RU: "Левый (Двойной)", message: "Left (Double)" },
					{ type: "spawn", func: "marker", args: [false, 300, 100, 0, 1000, true, null] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 2500] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 2500] },
					{ type: "spawn", func: "marker", args: [false, 60, 100, 1000, 1000, true, null] },

				]);
			} else {
				handlers.event([
					{ type: "text", sub_type: "message", message_RU: "Правый (Двойной)", message: "Right (Double)" },
					{ type: "spawn", func: "marker", args: [false, 60, 100, 0, 1000, true, null] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 2500] },
					{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 2500] },
					{ type: "spawn", func: "marker", args: [false, 300, 100, 1000, 1000, true, null] },
				]);
			}

		}
	}

	function ninth_old_swipe_event(curr, ent) {
		if (ninth_triple_swipe_remaining > 0) {
			ninth_triple_swipe_remaining--;
		}
		if (curr == 1401) {
			handlers.event([
				{ type: "text", sub_type: "message", message_RU: "Левый", message: "Left" },
				{ type: "spawn", func: "marker", args: [false, 300, 100, 0, 1000, true, null] },
				{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 1000] },
				{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 1000] }
			]);
		} else {
			handlers.event([
				{ type: "text", sub_type: "message", message_RU: "Правый", message: "Right" },
				{ type: "spawn", func: "marker", args: [false, 60, 100, 0, 1000, true, null] },
				{ type: "spawn", func: "vector", args: [553, 358, 0, 180, 1100, 100, 1000] },
				{ type: "spawn", func: "vector", args: [553, 358, 0, 0, 1100, 100, 1000] }
			]);
		}
	}


	function ninth_triples_event() {
		if (triples_timer != null) {
			dispatch.clearTimeout(triples_timer);
		}

		triples_timer = dispatch.setTimeout(() => {
			handlers.text({
				sub_type: "notification",
				message: "Triples Soon!",
				message_RU: "тройки Скоро!"
			});
		}, 100000);

	}


	function ninth_secondary_event() {
		if (secondary_timer != null) {
			dispatch.clearTimeout(secondary_timer);
		}

		secondary_timer = dispatch.setTimeout(() => {
			if (ninth_floor_fifty) {
				handlers.text({
					sub_type: "notification",
					message: "Secondary Soon!",
					message_RU: "вторичный скоро!"
				});
			}
		}, 45000);

	}
	function reset_backevent() {
		back_print = false;
		back_time = 0;
		end_back_time = 0;
		is_one_back = false;
		counter = 0;
		counter1_date = null;
		prev_back_attack = 0;
		prev_date = 0;

		// reset aggro event
		secondary_aggro_date = 0;
		is_ninth_floor = false;
		ninth_floor_fifty = false;

		if (triples_timer != null) {
			dispatch.clearTimeout(triples_timer);
			triples_timer = null;
		}

		if (secondary_timer != null) {
			dispatch.clearTimeout(secondary_timer);
			secondary_timer = null;
		}
	}
	
	
	//For Lakan funcs
	function boss7_star_event(str,type) {
		handlers.event([
			{ type: "text", sub_type: "message", message: str, message_RU: str },
			{ type: "spawn", func: "vector", args: [912, 18, 300, 7, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 18, 300, 29, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 54, 300, 43, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 54, 300, 65, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 90, 300, 79, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 90, 300, 102, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 126, 300, 115, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 126, 300, 137, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 162, 300, 151, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, 162, 300, 173, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -18, 300, -7, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -18, 300, -29, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -54, 300, -43, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -54, 300, -65, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -90, 300, -79, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -90, 300, -102, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -126, 300, -115, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -126, 300, -137, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -162, 300, -151, 750, 0, 4000] },
			{ type: "spawn", func: "vector", args: [912, -162, 300, -173, 750, 0, 4000] }
		]);
		if (type == 0) {
			handlers.event([
				{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 16, 175, 0, 4000] },
				{ type: "spawn", func: "item", args: [89141, 0, 250, 2250, 1750] }, // Front
				{ type: "spawn", func: "point", args: [810,  0, 250, 2250, 1750] },
				{ type: "spawn", func: "item", args: [89141, 36, 250, 0, 2500] },
				{ type: "spawn", func: "point", args: [810,  36, 250, 0, 2500] },
				{ type: "spawn", func: "item", args: [89141, -36, 250, 0, 2500] },
				{ type: "spawn", func: "point", args: [810,  -36, 250, 0, 2500] },
				{ type: "spawn", func: "item", args: [89141, 180, 250, 0, 2500] }, // Back
				{ type: "spawn", func: "point", args: [810,  180, 250, 0, 2500] },
				{ type: "spawn", func: "item", args: [89141, 144, 250, 2250, 1750] },
				{ type: "spawn", func: "point", args: [810,  144, 250, 2250, 1750] },
				{ type: "spawn", func: "item", args: [89141, 216, 250, 2250, 1750] },
				{ type: "spawn", func: "point", args: [810,  216, 250, 2250, 1750] },
			]);
		} else if (type == 1) {
			handlers.event([
				{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 16, 175, 0, 4000] },
				{ type: "spawn", func: "item", args: [89141, 0, 250, 0, 2500] }, // Front
				{ type: "spawn", func: "point", args: [810,  0, 250, 0, 2500] },
				{ type: "spawn", func: "item", args: [89141, 36, 250, 2250, 1750] },
				{ type: "spawn", func: "point", args: [810,  36, 250, 2250, 1750] },
				{ type: "spawn", func: "item", args: [89141, -36, 250, 2250, 1750] },
				{ type: "spawn", func: "point", args: [810,  -36, 250, 2250, 1750] },
				{ type: "spawn", func: "item", args: [89141, 180, 250, 2250, 1750] }, // Back
				{ type: "spawn", func: "point", args: [810,  180, 250, 2250, 1750] },
				{ type: "spawn", func: "item", args: [89141, 144, 250, 0, 2500] },
				{ type: "spawn", func: "point", args: [810,  144, 250, 0, 2500] },
				{ type: "spawn", func: "item", args: [89141, 216, 250, 0, 2500] },
				{ type: "spawn", func: "point", args: [810,  216, 250, 0, 2500] },
			]);
		}
	}
	function boss7_message_event(id) {
		switch (id) {
			// Lakan has noticed you.
			case 703:
				if (!boss7_hp_49) { handlers.text({ sub_type: "notification", message: "Debuffs > Circles > Bombs", message_RU: "" }) }
				else { handlers.text({ sub_type: "notification", message: "Debuffs > Bombs > Circles", message_RU: "" }) }
				break;
			// Lakan is trying to take you on (one-1) at a time.
			case 704:
				if (!boss7_hp_49) { handlers.text({ sub_type: "notification", message: "Circles > Bombs > Debuffs", message_RU: "" }) }
				else { handlers.text({ sub_type: "notification", message: "Circles > Debuffs > Bombs", message_RU: "" }) }
				break;
			// Lakan intends to kill all of you at once.
			case 705:
				if (!boss7_hp_49) { handlers.text({ sub_type: "notification", message: "Bombs > Debuffs > Circles", message_RU: "" }) } 
				else { handlers.text({ sub_type: "notification", message: "Bombs > Circles > Debuffs", message_RU: "" }) }
				break;
		}
	}
	
	function enhanced_text(type,message,delay,ent) {
		handlers.text({ sub_type: type, message: message, message_RU: "", delay: enhanced_time(delay,ent) })
	}
	
	function enhanced_time(time,ent) {
		return time - my.ping < 0 ? 0 : (time - my.ping)/ent.speed;
	}
	
	//for manaya
	
	const mech_messages = {
		1: { message: "1 (White)", message_RU: "1 (Белый)" },
		2: { message: "2 (Green)", message_RU: "2 (Зеленый)" },
		3: { message: "3 (Red)", message_RU: "3 (Красный)" },
		4: { message: "4 (Blue)", message_RU: "4 (Синий)" }
	};

	function debuff_text() {
		if (debuff_list.length === 0) return;

		if (type == 0) debuff_list.push(debuff_list.shift()); // Normal
		else debuff_list.unshift(debuff_list.pop()); // Reverse

		handlers.event([
			{ type: "text", sub_type: "message", message: mech_messages[debuff_list[0]].message, message_RU: mech_messages[debuff_list[0]].message_RU },
			{ type: "text", sub_type: "notification", message: mech_messages[debuff_list[0]].message, message_RU: mech_messages[debuff_list[0]].message_RU, speech: false }
		]);
	}

	function debuff_event(id) {
		if (id == 1) debuff_list = [1, 2, 3, 4]; // Greedy Thoughts #White
		else if (id == 2) debuff_list = [2, 3, 4, 1]; // Hateful Thoughts #Green
		else if (id == 3) debuff_list = [3, 4, 1, 2]; // Desperate Thoughts #Red
		else if (id == 4) debuff_list = [4, 1, 2, 3]; // Dreadful Thoughts #Blue

		debuff_text();
	}
	
	return {
		
        //Argog
		
		"h-2804-1000-30": [{ type: "text", sub_type: "message", message: "Reveal soon...", message_RU: "Скоро разоблачение..." }],
		"s-2804-1000-201-0": [
			{ type: "text", sub_type: "message", message: "Stun (Pushback)", message_RU: "Рёв (откид)" },
			{ type: "text", sub_type: "message", delay: 1000, message: "3" },
			{ type: "text", sub_type: "message", delay: 2000, message: "2" },
			{ type: "text", sub_type: "message", delay: 1000, message: "1" },
			{ type: "text", sub_type: "message", delay: 4000, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 5000] }
		],
		"s-2804-1000-107-0": [{ type: "text", sub_type: "message", message: "Many Hits", message_RU: "Несколько ударов" }],
		"s-2804-1000-112-0": [{ type: "text", sub_type: "message", message: "Target", message_RU: "Таргет" }],
		"s-2804-1000-115-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 4000] }
		],
		"s-2804-1000-118-0": [{ type: "text", sub_type: "message", message: "Scratching", message_RU: "Крутилка" }],
		"s-2804-1000-164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (кровоток)" }],
		"s-2804-1000-167-0": [{ type: "text", sub_type: "message", message: "Many Hits", message_RU: "Несколько ударов" }],
		"s-2804-1000-172-0": "s-2804-1000-112-0",
		"s-2804-1000-301-0": "s-2804-1000-112-0",
		"s-2804-1000-302-0": "s-2804-1000-112-0",
		"s-2804-1000-170-0": [
			{ type: "text", sub_type: "message", message: "Turn + Pushback", message_RU: "Разворот + Откид" },
			{ type: "text", sub_type: "message", message: "Pushback", message_RU: "Откид", delay: 2700 }
		],
		"s-2804-1000-175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 4000] }
		],
		"s-2804-1000-177-0": [{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" }],
		"s-2804-1000-178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (кровоток)" }],
		"s-2804-1000-203-0": [{ type: "text", sub_type: "message", message: "Phantom x3 (bleed)", message_RU: "Прыжки x3 (кровоток)" }],
		"s-2804-1000-207-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (кровоток)" }],
		"s-2804-1000-213-0": [{ type: "text", sub_type: "message", message: "Reveal | Phantom (bleed)", message_RU: "Разоблачение | Прыжки (кровоток)" }],
		"s-2804-1000-212-0": [{ type: "text", sub_type: "message", message: "Flash", message_RU: "Байт" }],
		
		//AQ boss
		"nd-2804-2000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"s-2804-2000-164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (Кровоток)" }],
		"s-2804-2000-166-0": [{ type: "text", sub_type: "message", message: "Turn-back", message_RU: "Оборот назад" }],
		"s-2804-2000-175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1500, message: "Dodge", message_RU: "Эвейд" }
		],
		"s-2804-2000-178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (Кровоток)" }],
		"s-2804-2000-214-0": [
			{ type: "text", sub_type: "message", message: "Rock Throw", message_RU: "Полоса вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 10, 1000, 0, 4000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 350, 1000, 0, 4000] }
		],
		"s-2804-2000-182-0": [{ type: "text", sub_type: "message", message: "Knockdown", message_RU: "Опрокид" }],
		"s-2804-2000-185-0": [
			{ type: "text", sub_type: "message", message: "Big jump (Kaia's Shield)", message_RU: "Прыжок (кайа)", class_position: "priest" },
			{ type: "text", sub_type: "message", message: "Big jump (Thrall of Protection)", message_RU: "Прыжок (кайа)", class_position: "mystic" },
			{ type: "text", sub_type: "alert", delay: 110000, message: "Big jump soon...", message_RU: "Скоро прыжок...", class_position: "heal" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 500, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 750, 0, 6000] }
		],
		"s-2804-2000-214-0": [
			{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 180, 500, 0, 1000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 180, 500, 0, 1000] }
		],
		"s-2804-2000-204-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (Кровоток)" }],
		"s-2804-2000-322-0": [{ type: "text", sub_type: "message", message: "Flash (bleed)", message_RU: "Байт (Кровоток)" }],
		"s-2804-2000-164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (Кровоток)" }],
		"s-2804-2000-166-0": [{ type: "text", sub_type: "message", message: "Turn-back", message_RU: "Оборот назад" }],
		"s-2804-2000-175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1500, message: "Dodge", message_RU: "Эвейд" }
		],
		"s-2804-2000-178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (Кровоток)" }],
		"s-2804-2000-181-0": [
			{ type: "text", sub_type: "message", message: "Rock Throw", message_RU: "Полоса вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 10, 1000, 0, 4000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 350, 1000, 0, 4000] }
		],
		"s-2804-2000-182-0": [{ type: "text", sub_type: "message", message: "Knockdown", message_RU: "Опрокид" }],
		"s-2804-2000-185-0": [
			{ type: "text", sub_type: "message", message: "Big jump (Kaia's Shield)", message_RU: "Прыжок (кайа)", class_position: "priest" },
			{ type: "text", sub_type: "message", message: "Big jump (Thrall of Protection)", message_RU: "Прыжок (кайа)", class_position: "mystic" },
			{ type: "text", sub_type: "alert", delay: 110000, message: "Big jump soon...", message_RU: "Скоро прыжок...", class_position: "heal" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 500, 0, 6000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 750, 0, 6000] }
		],
		"s-2804-2000-202-0": [
			{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" },
			{ type: "spawn", func: "vector", args: [553, 90, 80, 180, 500, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 270, 80, 180, 500, 0, 3000] }
		],
		"s-2804-2000-207-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (Кровоток)" }],
		"s-2804-2000-212-0": [{ type: "text", sub_type: "message", message: "Flash (bleed)", message_RU: "Байт (Кровоток)" }],
		
	   //ARGOG 
		"h-2804-1000-30": [{ type: "text", sub_type: "message", message: "Reveal soon...", message_RU: "Скоро разоблачение..." }],
		"s-2804-1000-201-0": [
			{ type: "text", sub_type: "message", message: "Stun (Pushback)", message_RU: "Рёв (откид)" },
			{ type: "text", sub_type: "message", delay: 1000, message: "3" },
			{ type: "text", sub_type: "message", delay: 2000, message: "2" },
			{ type: "text", sub_type: "message", delay: 1000, message: "1" },
			{ type: "text", sub_type: "message", delay: 4000, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 5000] }
		],
		"s-2804-1000-107-0": [{ type: "text", sub_type: "message", message: "Many Hits", message_RU: "Несколько ударов" }],
		"s-2804-1000-112-0": [{ type: "text", sub_type: "message", message: "Target", message_RU: "Таргет" }],
		"s-2804-1000-115-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 4000] }
		],
		"s-2804-1000-118-0": [{ type: "text", sub_type: "message", message: "Scratching", message_RU: "Крутилка" }],
		"s-2804-1000-164-0": [{ type: "text", sub_type: "message", message: "Counter Attack (bleed)", message_RU: "Отпрыжка (кровоток)" }],
		"s-2804-1000-167-0": [{ type: "text", sub_type: "message", message: "Many Hits", message_RU: "Несколько ударов" }],
		"s-2804-1000-172-0": "s-2804-1000-112-0",
		"s-2804-1000-301-0": "s-2804-1000-112-0",
		"s-2804-1000-302-0": "s-2804-1000-112-0",
		"s-2804-1000-170-0": [
			{ type: "text", sub_type: "message", message: "Turn + Pushback", message_RU: "Разворот + Откид" },
			{ type: "text", sub_type: "message", message: "Pushback", message_RU: "Откид", delay: 2700 }
		],
		"s-2804-1000-175-0": [
			{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "Рёв" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 630, 0, 4000] }
		],
		"s-2804-1000-177-0": [{ type: "text", sub_type: "message", message: "Backstab", message_RU: "Назад + Вперед" }],
		"s-2804-1000-178-0": [{ type: "text", sub_type: "message", message: "Scratching (bleed)", message_RU: "Крутилка (кровоток)" }],
		"s-2804-1000-203-0": [{ type: "text", sub_type: "message", message: "Phantom x3 (bleed)", message_RU: "Прыжки x3 (кровоток)" }],
		"s-2804-1000-207-0": [{ type: "text", sub_type: "message", message: "Phantom x5 (bleed)", message_RU: "Прыжки x5 (кровоток)" }],
		"s-2804-1000-213-0": [{ type: "text", sub_type: "message", message: "Reveal | Phantom (bleed)", message_RU: "Разоблачение | Прыжки (кровоток)" }],
		"s-2804-1000-212-0": [{ type: "text", sub_type: "message", message: "Flash", message_RU: "Байт" }],

	  //FA GOOFNA
	  
		"h-2804-3000-89": [{ type: "func", func: boss_hp_event, args: [89] }],
		"h-2804-3000-59": [{ type: "func", func: boss_hp_event, args: [59] }],
		"h-2804-3000-29": [{ type: "func", func: boss_hp_event, args: [29] }],
		"h-2804-3000-74": [{ type: "func", func: boss_hp_event, args: [74] }],
		"h-2804-3000-39": [{ type: "func", func: boss_hp_event, args: [39] }],

		"s-2804-1001-255-0": [{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 1000, 0, 5000] }],  //0
		"s-2804-1002-256-0": [{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 1000, 0, 5000] }],  //60
		"s-2804-1003-257-0": [{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 1000, 0, 5000] }],  //0
		"s-2804-1004-258-0": [{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 1000, 0, 5000] }],  //60

		"s-2804-3000-108-0": [{ type: "text", class_position: "tank", sub_type: "message", message: "Strike (Slow)", message_RU: "Меч (медленный)" }], // 101 121 122 -> 108
		"s-2804-1000-355-0": [{ type: "text", sub_type: "message", message: "Eviscerate", message_RU: "Потрошение" }],                                 // 102 121 103 -> 355 -> 114
		"s-2804-3000-135-0": [{ type: "text", sub_type: "message", message: "Strike (Slow)", message_RU: "Меч (медленный)" }],                         //         104 -> 135 -> 130
		"s-2804-3000-111-0": [{ type: "text", sub_type: "message", message: "Stun | Strike", message_RU: "Стан | Меч" }],                              //         104 -> 111 -> 130
		"s-2804-3000-112-0": [{ type: "text", sub_type: "message", message: "Back Jump | Strike", message_RU: "Прыжок назад | Меч" }],                 //     121 102 -> 112 -> 130

		// прыжок
		"s-2804-3000-116-0": [
			{ type: "text", sub_type: "message", message: "Jump", message_RU: "Прыжок" }
		],
		"s-2804-3000-116-1": [
			{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [true, 912, 0, 110, 8, 480, 0, 1000] }
		],

		// 3 оборота -> прыжок (145 -> 139 -> 140)
		"s-2804-3000-145-0": [{ type: "text", sub_type: "message", message: "3x360 | Jump", message_RU: "3 оборота | Прыжок" }],
		"s-2804-3000-139-0": [{ type: "text", sub_type: "message", delay: 1000, message: "Jump", message_RU: "Прыжок" }],
		"s-2804-3000-140-0": [
			{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд!" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 110, 8, 480, 0, 1000] }
		],

		// 109 -> 402 -> 130
		"s-2804-3000-109-0": [{ type: "text", sub_type: "message", message: "Forward Jump", message_RU: "Прыжок вперед" }],
		"s-2804-3000-402-0": [{ type: "text", sub_type: "message", message: "Jump", message_RU: "Прыжок" }],

		// 136 -> 144 -> 130
		"s-2804-3000-136-0": [{ type: "text", sub_type: "message", message: "2x360 | Strike", message_RU: "2 оборота | Меч" }],
		"s-2804-3000-144-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],

		// 134 -> 147
		"s-2804-3000-134-0": [{ type: "text", sub_type: "message", message: "Turn around | Back", message_RU: "Поворот | Удар назад" }],
		"s-2804-3000-134-1": [{ type: "text", sub_type: "message", message: "Back", message_RU: "Удар назад" }],
		"s-2804-3000-147-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],

		// 142 -> 143 114 130
		"s-2804-3000-142-0": [{ type: "text", sub_type: "message", message: "2x360 | Strike", message_RU: "2 оборота | Меч" }],
		"s-2804-3000-143-0": [{ type: "text", sub_type: "message", message: "Strike", message_RU: "Меч" }],

		"s-2804-3000-141-0": [{ type: "text", sub_type: "message", message: "2x360 | Eviscerate", message_RU: "2 оборота | Потрошение" }], // 141 -> 146 114 130
		"s-2804-3000-146-0": [{ type: "text", sub_type: "message", message: "Eviscerate | Strike", message_RU: "Потрошение | Меч" }],      // 146 ->         114 -> 130

		// стяжка -> бублики (350 -> 302)
		"s-2804-3000-350-0": [
			{ type: "text", sub_type: "message", message: "Red: Donuts (Out > In)", message_RU: "Стяжка | Бублики (От него > К нему)" },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 240, 0, 5000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 8, 480, 0, 5000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 3, 950, 0, 5000] },
			{ type: "spawn", func: "item", args: [HIGHLIGHT_ITEM, 0, 0, 3800, 1000] },
			{ type: "text", sub_type: "message", delay: 3800, message: "In", message_RU: "К нему" },
			{ type: "spawn", func: "marker", args: [false, 180, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "spawn", func: "marker", args: [false, 0, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "spawn", func: "marker", args: [false, 90, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "spawn", func: "marker", args: [false, 270, 100, 3800, 1000, false, ["CENTER", "IN"]] },
			{ type: "text", sub_type: "alert", delay: 58000, message: "Mechanics soon...", message_RU: "Скоро стяжка..." }
		],
		// стяжка -> волна (357 -> 110)
		"s-2804-3000-357-0": [
			{ type: "text", sub_type: "message", message: "Purple: Get Out", message_RU: "Стяжка | От него" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 20, 500, 2000, 5000] },
			{ type: "text", sub_type: "alert", delay: 58000, message: "Mechanics soon...", message_RU: "Скоро стяжка..." }
		],

		"s-2804-1000-114-0": [{ type: "text", sub_type: "message", message: "Eviscerate (slow)", message_RU: "Потрошение (медленно)" }],
		"s-2804-1000-130-0": [{ type: "text", sub_type: "message", message: "Target", message_RU: "Таргет" }],
		"s-2804-3000-151-0": [{ type: "text", sub_type: "message", message: "Back teleport | Strike", message_RU: "Телепорт назад | Меч" }], // 151 149 148 -> 130
		"s-2804-3000-149-1": [{ type: "text", sub_type: "message", message: "Back teleport (Target)", message_RU: "Телепорт назад (таргет)" }],
		"s-2804-3000-117-0": [{ type: "text", sub_type: "message", message: "Teleport (Target)", message_RU: "Телепорт (таргет)" }],         //         117 -> 130
		"s-2804-3000-356-0": [{ type: "text", sub_type: "message", message: "Teleport (Target)", message_RU: "Телепорт (таргет)" }],         //         356 -> 147
		"s-2804-3000-148-1": [{ type: "text", sub_type: "message", message: "Teleport (Target)", message_RU: "Телепорт (таргет)" }],

		"s-2804-3000-351-0": [
			{ type: "text", sub_type: "message", message: "Shield!", message_RU: "Щит!" },
			{ type: "func", func: shield_event }
		],
		"s-2804-3000-401-0": [
			{ type: "text", sub_type: "message", message: "30% AOE!", message_RU: "АОЕ" },
			{ type: "text", sub_type: "message", delay: 1600, message: "Dodge!", message_RU: "Эвейд!" }
		],
		
		//antaroth
		
		"s-2804-4000-104-0": [{ type: "func", func: thirdboss_backattack_event }],
		"s-2804-4000-105-0": [{ type: "text", sub_type: "message", message: "Target Cage", message_RU: "Клетка (таргет)" }],
		"s-2804-4000-119-0": [{ type: "spawn", func: "circle", args: [true, 553, 0, -325, 12, 325, 0, 2000] }],
		"s-2804-4000-107-0": [{ type: "text", sub_type: "message", message: "Random Jump", message_RU: "Прыжок (стан)" }],
		"s-2804-4000-107-1": [{ type: "spawn", func: "circle", args: [false, 553, 0, 85, 12, 250, 0, 2000] }],
		"s-2804-4000-109-0": [
			{ type: "text", sub_type: "message", message: "Left", message_RU: "Лево" },
			{ type: "text", sub_type: "message", message: "Inward (In > Out)", message_RU: "Внутрь (к нему > от него)", delay: 1000 },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 500, 0, 1500] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 500, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 20, 160, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 12, 220, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 10, 300, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 8, 360, 0, 1500] },
			{ type: "spawn", func: "marker", args: [false, 270, 300, 0, 1500, true, null] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 18, 157, 1500, 4000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 307, 1500, 4000] }
		],
		"s-2804-4000-111-0": [
			{ type: "text", sub_type: "message", message: "Right", message_RU: "Право" },
			{ type: "text", sub_type: "message", message: "Outward (Out > In)", message_RU: "Наружу (от него > к нему)", delay: 1000 },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 500, 0, 1500] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 500, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 20, 160, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 12, 220, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 10, 300, 0, 1500] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 8, 360, 0, 1500] },
			{ type: "spawn", func: "marker", args: [false, 90, 300, 0, 1500, true, null] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 18, 157, 1500, 4000] },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 307, 1500, 4000] }
		],
		"s-2804-4000-113-0": [{ type: "text", sub_type: "message", message: "Front | Back Stun", message_RU: "Передний | Задний" }],
		"s-2804-4000-115-0": [{ type: "text", sub_type: "message", message: "Spin Attack", message_RU: "Круговая" }],
		"s-2804-4000-120-0": [{ type: "text", sub_type: "message", message: "Energy Beam (Slow)", message_RU: "Волна (медленно)" }],
		"s-2804-4000-204-0": [{ type: "text", sub_type: "message", message: "Energy Beam (Fast)", message_RU: "Волна (быстро)" }],
		// "s-2804-4000-1202-0": [{ type: "text", sub_type: "message", message: "Spin or Front | Back Stun", message_RU: "Круговая или передний | Задний" }],
		"s-2804-4000-206-0": [{ type: "text", sub_type: "message", message: "Orbs", message_RU: "Шары" }],
		"s-2804-4000-309-0": [{ type: "text", sub_type: "message", message: "AoE", message_RU: "АоЕ" }],
		"s-2804-4000-314-0": [{ type: "text", sub_type: "message", message: "Puddles", message_RU: "Лужи" }],
		/*"s-2804-4000-314-0": "s-2804-4000-310-0",
		"s-2804-4000-314-0": "s-2804-4000-310-0",
		"s-2804-4000-314-0": "s-2804-4000-310-0",
		"s-2804-4000-314-0": "s-2804-4000-310-0",*/
		"s-2804-4000-315-0": [{ type: "text", sub_type: "message", message: "Pushback", message_RU: "Откид (кайа)" }],
		"s-2804-4000-317-0": [{ type: "func", func: thirdboss_cage_event, args: [false], delay: 1000 }],
		"s-2804-4000-318-0": [{ type: "func", func: thirdboss_cage_event, args: [true], delay: 1000 }],
		"s-2804-4000-400-0": [{ type: "text", sub_type: "message", message: "Clones: Beam", message_RU: "Копии: волны" }],
		"s-2804-4000-401-0": [{ type: "text", sub_type: "message", message: "Clones: Spin", message_RU: "Копии: круговые" }],
		/*"s-2804-4000-104-0": "s-2804-4000-104-0",
		"s-2804-4000-105-0": "s-2804-4000-105-0",
		"s-2804-4000-119-0": "s-2804-4000-119-0",
		"s-2804-4000-107-0": "s-2804-4000-107-0",
		"s-2804-4000-107-1": "s-2804-4000-107-1",
		"s-2804-4000-109-0": "s-2804-4000-109-0",
		"s-2804-4000-111-0": "s-2804-4000-111-0",
		"s-2804-4000-113-0": "s-2804-4000-113-0",
		"s-2804-4000-115-0": "s-2804-4000-115-0",
		"s-2804-4000-120-0": "s-2804-4000-20-0",
		"s-2804-4000-204-0": "s-2804-4000-204-0",
		"s-2804-4000-202-0": "s-2804-4000-202-0",
		"s-2804-4000-206-0": "s-2804-4000-206-0",*/
		"s-2804-4000-410-0": [{ type: "text", sub_type: "message", message: "Cage", message_RU: "Клетка" }],
		"ae-0-0-98043037": [{ type: "func", func: () => thirdboss_colour_to_use = "red" }],
		"ae-0-0-98043038": [{ type: "func", func: () => thirdboss_colour_to_use = "yellow" }],
		"ae-0-0-98043039": [{ type: "func", func: () => thirdboss_colour_to_use = "blue" }],
		
		//GVH 2ND BOSS
		
		"ns-2804-6000": [{ type: "func", func: () => boss = null }],
	
		"am-2804-280426-28040224": [
			{ type: "func", func: () => boss = 1 },
			{ type: "text", delay: 52000, sub_type: "notification", message: "True Debuff in 5 seconds", message_RU: "Правда через 5 сек." },
			{ type: "event", delay: 80000, args: [
				{ type: "func", check_func: () => boss === 1, func: () => boss = null },
				{ type: "text", check_func: () => boss === 1, sub_type: "message", message_RU: "Смена дебаффа", message: "Debuff reload" }
			] }
		],
		"am-2804-6000-28040220": [
			{ type: "func", func: () => { boss = 0; } },
			{ type: "text", delay: 52000, sub_type: "notification", message: "False Debuff in 5 seconds", message_RU: "Ложь через 5 сек." },
			{ type: "event", delay: 80000, args: [
				{ type: "func", check_func: () => boss === 0, func: () => boss = null },
				{ type: "text", check_func: () => boss === 0, sub_type: "message", message_RU: "Смена дебаффа", message: "Debuff reload" }
			] }
		],
		"am-2804-280421-28040222": [{ type: "text", sub_type: "notification", message: "Spike in 5 seconds", message_RU: "Шип через 5 сек." }],
		"h-2804-6000-81": [{ type: "text", sub_type: "message", message: "80%", message_RU: "Дебафф" }],
		"h-2804-6000-76": [{ type: "text", sub_type: "message", message: "75%", message_RU: "Камни" }],
		"s-2804-6000-108-0": [{ type: "text", sub_type: "message", message: "Back Attack!", message_RU: "Откид назад!" }],
		"s-2804-6000-150-0": [{ type: "text", sub_type: "message", message: "Phantom", message_RU: "Фантом" }],
		"s-2804-6000-228-0": [
			{ type: "text", sub_type: "message", message: "Team Up", message_RU: "Камни (вместе)!!!" },
			{ type: "text", sub_type: "message", delay: 3500, message: "Dodge", message_RU: "Эвейд" }
		],
		"s-2804-6000-230-0": [{ type: "text", sub_type: "message", message: "AOE", message_RU: "AOE!!" }],

		"s-2804-6000-231-0": [
			{ type: "text", sub_type: "message", message: "Out Safe", message_RU: "От него" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 3000] }
		],
		"s-2804-6000-232-0": [{ type: "text", sub_type: "message", message: "In Safe", message_RU: "К нему" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 3000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 3, 1000, 0, 3000] }
		],
		"s-2804-6000-236-0": [{ type: "text", sub_type: "message", message: "Counter Attack (Bait)", message_RU: "Конус вперед (байт)" }],
		"s-2804-6000-238-0": [
			{ type: "text", sub_type: "message", message: "Out > In", message_RU: "От него > К нему" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 3000] }
		],
		"s-2804-6000-239-0": [
			{ type: "text", sub_type: "message", message: "In > Out", message_RU: "К нему > От него" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 10, 300, 0, 3000] },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 3, 1000, 0, 3000] }
		],
		
		//Lakan 
		"nd-2804-7000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" },
			{ type: "func", func: () => boss7_hp_49 = false }
		],
		"h-2804-7000-49": [{ type: "func", func: () => boss7_hp_49 = true }],
		"s-2804-7000-103-0": [{ type: "text", sub_type: "message", message: "Back + Front", message_RU: "" }],
		"s-2804-7000-110-0": [{ type: "text", sub_type: "message", message: "Claw", message_RU: "" }],
		"s-2804-7000-110-1": [{ type: "func", func: enhanced_text, args: ["alert","Dodge",1100] }], //900 w/o pingtax
		"s-2804-7000-113-0": [{ type: "text", sub_type: "message", message: "Bait", message_RU: "" }],
		"s-2804-7000-135-0": [{ type: "text", sub_type: "message", message: "In", message_RU: "" }],
		"s-2804-7000-136-0": [{ type: "text", sub_type: "message", message: "Claw", message_RU: "" }],
		"s-2804-7000-136-1": [{ type: "func", func: enhanced_text, args: ["alert","Dodge",1100] }], //900 w/o pingtax
		"s-2804-7000-138-0": [{ type: "spawn", func: "circle", args: [false, 912, 0, 15, 10, 250, 0, 6000] }],
		"s-2804-7000-144-0": [{ type: "text", sub_type: "message", message: "Out", message_RU: "" }],
		"s-2804-7000-145-0": [{ type: "text", sub_type: "message", message: "In", message_RU: "" }],
		"s-2804-7000-151-0": [
			{ type: "text", sub_type: "message", message: "Attention Stun", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 100, 18, 210, 0, 3000] }
		//	{ type: "spawn", func: "circle", args: [false, 912, 0, 100, 18, 165, 0, 2000] } // range based on particle
		],
		"s-2804-7000-152-0": [
			{ type: "text", sub_type: "message", message: "Stun + Back", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 100, 18, 210, 0, 3000] }
		],
		"s-2804-7000-154-0": [{ type: "text", sub_type: "message", message: "Out > In", message_RU: "" }],
		"s-2804-7000-155-0": [{ type: "text", sub_type: "message", message: "In > Out", message_RU: "" }],
		"s-2804-7000-240-0": [
			{ type: "text", sub_type: "message", message: "Donuts (Out > In > Out)", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 50, 18, 210, 0, 5000] },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 50, 10, 360, 0, 5000] },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 50, 8, 520, 0, 5000] }
		],
		"s-2804-7000-301-0": [{ type: "text", sub_type: "message", message: "(Bombs) Gather + Cleanse", message_RU: "" }],
		"s-2804-7000-302-0": [{ type: "text", sub_type: "message", message: "(Bombs) Gather + No cleanse", message_RU: "" }],
		"s-2804-7000-401-0": [
			{ type: "text", sub_type: "message", message: "Inward wave", message_RU: "" },
			{ type: "text", sub_type: "message", message: "Plague of Exhaustion", message_RU: "", class_position: "priest", delay: 1000 },
			{ type: "text", sub_type: "message", message: "Regression", message_RU: "", class_position: "mystic", delay: 1000 },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 16, 175, 2000, 5000] }
		],
		"s-2804-7000-402-0": [
			{ type: "text", sub_type: "message", message: "Inward wave", message_RU: "" },
			{ type: "text", sub_type: "message", message: "Sleep Boss", message_RU: "", class_position: "heal", delay: 1000 },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 16, 175, 2000, 5000] }
		],
		"s-2804-7000-901-0": [{ type: "func", func: boss7_star_event, args: ["(Debuffs) Closest",0] }],
		"s-2804-7000-902-0": [{ type: "func", func: boss7_star_event, args: ["(Debuffs) Farthest",1] }],
		"s-2804-7000-903-0": [{ type: "func", func: boss7_star_event, args: ["(Bombs) Gather + Cleanse",0] }],
		"s-2804-7000-904-0": [{ type: "func", func: boss7_star_event, args: ["(Bombs) Gather + No cleanse",1] }],
		"s-2804-7000-905-0": [{ type: "func", func: boss7_star_event, args: ["(Circles) Spread",0] }],
		"s-2804-7000-906-0": [{ type: "func", func: boss7_star_event, args: ["(Circles) Gather",1] }],
		"dm-0-0-90340703": [{ type: "func", func: boss7_message_event, args: [703] }], // Lakan has noticed you.
		"dm-0-0-90340704": [{ type: "func", func: boss7_message_event, args: [704] }], // Lakan is trying to take you on (one-1) at a time.
		"dm-0-0-90340705": [{ type: "func", func: boss7_message_event, args: [705] }], // Lakan intends to kill all of you at once.
		
		//Darkan
		/*"nd-2804-8000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" },
			{ type: "func", func: () => boss9_50_swipe_timer = enrage = enrage_time = boss9_one_back = 0 },
			{ type: "func", func: () => boss9_hp_49 = boss9_hp_94 = false }
		],
		"h-2804-8000-75": [{ type: "text", sub_type: "notification", message: "Triple Soon", message_RU: "" }],
		"h-2804-8000-51": [{ type: "text", sub_type: "alert", message: "50% Triple!", message_RU: "" }],
		"h-2804-8000-49": [{ type: "func", func: () => boss9_hp_49 = true }],
		"h-2804-8000-94": [{ type: "func", func: () => boss9_hp_94 = true }],
		"h-2804-9999-9999": [{ type: "func", func: () => sec_aggro = true }], // test usage
		"rb-2804-8000": [
			{ type: "func", func: () => enrage = 1 },
			{ type: "func", func: () => enrage_time = new Date() }
		],
		"re-2804-8000": [{ type: "func", func: () => enrage = enrage_time = 0 }],
		"s-2804-8000-101-0": [{ type: "func", func: boss9_sword_event, args: [101] }],
		"s-2804-8000-102-0": [{ type: "func", func: boss9_sword_event, args: [102] }],
		"s-2804-8000-103-0": [{ type: "func", func: boss9_sword_event, args: [103] }],
		"s-2804-8000-104-0": [{ type: "func", func: boss9_swipe_event, args: [104, 1500], check_func: () => enrage }],
		"s-2804-8000-106-0": [{ type: "func", func: boss9_sword_event, args: [106] }],
		"s-2804-8000-107-0": [{ type: "func", func: boss9_swipe_event, args: [107, 1500], check_func: () => enrage }],
		"s-2804-8000-111-0": [{ type: "func", func: () => boss9_sword_counter = 0 }],
		"s-2804-8000-112-0": [{ type: "text", sub_type: "message", message: "Move Back", message_RU: "" }],
		"s-2804-8000-114-0": [
			{ type: "text", sub_type: "message", message: "Invisible Fire", message_RU: "" },
			{ type: "spawn", func: "vector", args: [912, 90, 150, 0, 1300, 0, 5830] },
			{ type: "spawn", func: "vector", args: [912, 90, 75, 0, 1300, 0, 5830] },
			{ type: "spawn", func: "vector", args: [912, 0, 0, 0, 1300, 0, 5830] },
			{ type: "spawn", func: "vector", args: [912, 270, 75, 0, 1300, 0, 5830] },
			{ type: "spawn", func: "vector", args: [912, 270, 150, 0, 1300, 0, 5830] }
		],
		"s-2804-8000-115-0": [
			{ type: "text", sub_type: "warning", message: "3" },
			{ type: "text", sub_type: "warning", message: "2", delay: 1000 },
			{ type: "text", sub_type: "warning", message: "1", delay: 2000 },
			{ type: "func", func: enhanced_text, args: ["warning","Dodge",3400] } //3200 w/o pingtax
		],
		"s-2804-8000-301-0": [{ type: "text", sub_type: "message", message: "Incoming Stun", message_RU: "" }],
		"s-2804-8000-302-0": [
			{ type: "text", sub_type: "message", message: "AoE", message_RU: "" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 8, 500, 100, 6000] }
		],
		"s-2804-8000-303-0": [{ type: "text", sub_type: "message", message: "Drill Attack", message_RU: "" }],
		"s-2804-8000-306-0": [
			{ type: "text", sub_type: "message", message: "Ghost", message_RU: "" },
			{ type: "text", sub_type: "message", message: "Ghost soon...", message_RU: "", delay: 55000 },
		],
		"s-2804-8000-312-0": [{ type: "text", sub_type: "message", message: "Ghost", message_RU: "" }],
		"s-2804-8000-401-0": [{ type: "func", func: boss9_swipe_event, args: [401] }],
		"s-2804-8000-402-0": [{ type: "func", func: boss9_swipe_event, args: [402] }],
		"s-2804-8000-407-0": [{ type: "func", func: boss9_swipe_event, args: [407] }],
		"s-2804-8000-408-0": [{ type: "func", func: boss9_swipe_event, args: [408] }],
		"dm-0-0-9034901": [
			{ type: "func", func: boss9_tripleattack_event },
			{ type: "text", sub_type: "notification", delay: 85000, message: "Triple Soon", message_RU: "", check_func: () => boss9_50_swipe_timer == 0 || Date.now() - boss9_50_swipe_timer >= 85000 },
			{ type: "func", func: () => boss9_50_swipe_timer = Date.now() }
		],*/
		"ns-2804-8000": [
			{ type: "func", func: () => is_ninth_floor = true },
			{ type: "func", func: ninth_triples_event },
			{ type: "func", func: ninth_secondary_event },
			//{ type: "func", func: set_boss_data },
		],
		"nd-2804-8000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" },
			{ type: "func", func: reset_backevent },
			{ type: "func", func: () => boss_data = null },
		],
		"h-2804-8000-99": [{ type: "func", func: () => is_ninth_floor = true }],
		"h-2804-8000-49": [
			{ type: "text", sub_type: "message", message: "49%" },
			{ type: "func", func: () => ninth_floor_fifty = true },
			{ type: "text", sub_type: "notification", message: "Triples Soon!", message_RU: "тройки Скоро!", delay: 1000 }
		],
		"dm-0-0-9034901": [
			{ type: "text", sub_type: "message", message: "Triples!", message_RU: "тройки!" },
			{ type: "func", func: () => ninth_triple_swipe_remaining = 3 },
			{ type: "func", func: ninth_triples_event },
		],
		"s-2804-8000-112-0": [{ type: "text", sub_type: "message", message_RU: "Рывок назад", message: "Back Move" }],
		"s-2804-8000-102-0": [{ type: "func", func: () => back_time = new Date() }],
		"s-2804-8000-101-0": [{ type: "func", func: boss_backattack_event }],
		"s-2804-8000-106-0": [{ type: "func", func: boss_backattack_event_new, args: [1106] }],
		"s-2804-8000-105-0": [{ type: "func", func: boss_backattack_event_new, args: [1105] }],
		"s-2804-8000-103-0": [{ type: "func", func: boss_backattack_event_new, args: [1103] }],
		"s-2804-8000-108-0": [{ type: "func", func: boss_backattack_event_new, args: [1108] }],
		"s-2804-8000-114-0": [
			{ type: "text", sub_type: "message", message_RU: "Таргет", message: "Target Attack" },
			{ type: "spawn", func: "vector", args: [553, 90, 150, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 90, 75, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 270, 75, 0, 1300, 0, 2500] },
			{ type: "spawn", func: "vector", args: [553, 270, 150, 0, 1300, 0, 2500] }
		],
		"s-2804-8000-115-0": [
			{ type: "text", sub_type: "message", message: "3" },
			{ type: "text", sub_type: "message", delay: 1000, message: "2" },
			{ type: "text", sub_type: "message", delay: 2000, message: "1" },
			{ type: "text", sub_type: "message", delay: 3200, message_RU: "Эвейд", message: "Dodge" }
		],
		"s-2804-8000-117-0": [{ type: "text", sub_type: "message", message_RU: "Удар вперед", message: "Front" }],
		"s-2804-8000-302-0": [
			{ type: "text", sub_type: "message", message_RU: "АоЕ", message: "AOE" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 500, 100, 6000] }
		],
		"s-2804-8000-407-0": [{ type: "func", func: ninth_new_swipe_event, args: [1407] }],
		"s-2804-8000-408-0": [{ type: "func", func: ninth_new_swipe_event, args: [1408] }],
		/*"s-2804-8000-101-0": "s-2804-8000-1101-0",
		"s-2804-8000-102-0": "s-2804-8000-1102-0",
		"s-2804-8000-103-0": "s-2804-8000-1103-0",
		"s-2804-8000-105-0": "s-2804-8000-1105-0",
		"s-2804-8000-106-0": "s-2804-8000-1106-0",
		"s-2804-8000-108-0": "s-2804-8000-1108-0",
		"s-2804-8000-212-0": "s-2804-8000-1112-0",*/
		"s-2804-8000-303-0": [{ type: "text", sub_type: "message", message_RU: "Крутилка", message: "Spin Attack" }],
		"s-2804-8000-401-0": [{ type: "func", func: ninth_old_swipe_event, args: [1401] }],
		"s-2804-8000-402-0": [{ type: "func", func: ninth_old_swipe_event, args: [1402] }],
		"s-2804-8000-301-0": [{ type: "text", sub_type: "message", message_RU: "вопль", message: "Scream" }],
		"s-2804-8000-312-0": [{ type: "text", sub_type: "message", message_RU: "ДУХ", message: "ghost" }],
		/*"s-2804-8000-114-0": "s-2804-8000-1114-0",
		"s-2804-8000-115-0": "s-2804-8000-1115-0",
		"s-2804-8000-117-0": "s-2804-9000-1117-0",*/
		
		//Bahaar 
		
		"nd-2804-9000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"ns-2804-9000": [
			{ type: "spawn", func: "marker", args: [false, 0, -700, 100, 60000000, false, ["Throne", "Throne Direction"]] },
			{ type: "spawn", func: "point", args: [513, 0, 800, 100, 60000000] },
			{ type: "func", func: () => print_loading = true },
			{ type: "func", func: () => print_lasers = true }
		],
		// Not enraged
		"s-2804-9000-101-0": [
			{ type: "text", sub_type: "message", message: "4 Hit Combo", message_RU: "270 (сейф-зона)" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 195, 500, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 270, 500, 0, 3000] }
		],
		"s-2804-9000-103-0": [
			{ type: "text", sub_type: "message", message: "Front (Dodge)", message_RU: "Удар вперед (эвейд)" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 400, 8, 350, 100, 3000] }
		],
		"s-2804-9000-107-0": [{ type: "text", sub_type: "message", message: "4 Hit (3)", message_RU: "4" }],
		"s-2804-9000-108-0": [
			{ type: "text", sub_type: "message", message: "Back Throw", message_RU: "Стан назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 180, 250, 12, 300, 100, 3000] }
		],
		"s-2804-9000-111-0": [
			{ type: "text", sub_type: "message", message: "Back", message_RU: "Удар назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 185, 500, 8, 490, 1500, 2000] }
		],
		"s-2804-9000-112-0": [
			{ type: "text", sub_type: "message", message: "Perfect Defense (Fast)", message_RU: "Идеальный блок (быстро)" },
			{ type: "text", sub_type: "message", delay: 1200, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 3000] }
		],
		"s-2804-9000-113-0": [{ type: "text", sub_type: "message", message: "Throw (Bait)", message_RU: "Молот (байт)" }],
		"s-2804-9000-114-0": [
			{ type: "text", sub_type: "message", message: "Front Slam", message_RU: "Удар назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 260, 10, 320, 100, 3000] }
		],
		"s-2804-9000-115-0": [{ type: "text", sub_type: "message", delay: 1100, message: "Dodge", message_RU: "Эвейд" }], // Knockup
		"s-2804-9000-116-0": [
			{ type: "text", sub_type: "message", message: "Donuts (In)", message_RU: "Бублики (к нему)" },
			{ type: "spawn", func: "circle", args: [false, 912, 0, 0, 12, 290, 100, 2000] }
		],
		"s-2804-9000-116-1": [
			{ type: "text", sub_type: "message", message: "Out > In", message_RU: "От него > К нему" },
			{ type: "spawn", func: "circle", args: [false, 445, 0, 0, 12, 290, 100, 4000] }
		],
		"s-2804-9000-117-0": [{ type: "text", sub_type: "message", message: "Jump (Bait)", message_RU: "Прыжок (байт)" }],
		"s-2804-9000-118-0": [{ type: "text", sub_type: "message", message: "Jump (Tank)", message_RU: "Прыжок (танк)" }],
		"s-2804-9000-118-1": [{ type: "spawn", func: "circle", args: [false, 553, 0, 400, 12, 300, 100, 2000] }],
		"s-2804-9000-119-0": [
			{ type: "text", sub_type: "message", message: "Left Swipe", message_RU: "Слева" },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 20, 160, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 12, 220, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 10, 300, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [0, 180, 912, 0, 0, 8, 360, 0, 2000] },
			{ type: "spawn", func: "marker", args: [false, 270, 300, 100, 2000, true, null] }
		],
		"s-2804-9000-120-0": [
			{ type: "text", sub_type: "message", message: "Right Swipe", message_RU: "Справа" },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 20, 160, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 12, 220, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 10, 300, 0, 2000] },
			{ type: "spawn", func: "semicircle", args: [180, 360, 912, 0, 0, 8, 360, 0, 2000] },
			{ type: "spawn", func: "marker", args: [false, 90, 300, 100, 2000, true, null] }
		],
		"s-2804-9000-121-0": [
			{ type: "text", sub_type: "message", message: "Waves (Left)", message_RU: "Волны (левая)" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 37, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 143, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-122-0": [
			{ type: "text", sub_type: "message", message: "Waves (Left) 3nd fast", message_RU: "Волны (левая) 3-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 37, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 143, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-123-0": [
			{ type: "text", sub_type: "message", message: "Waves (Left) 2nd fast", message_RU: "Волны (левая) 2-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 37, 125, 0, 2500, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 143, 125, 0, 2500, false, ["safe", "safe"]] }
		],
		"s-2804-9000-125-0": [
			{ type: "text", sub_type: "message", message: "Front | Right Scratch", message_RU: "Удар вперед | Правый черкаш" },
			{ type: "text", sub_type: "message", delay: 1750, message: "Dodge", message_RU: "Эвейд" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 400, 8, 350, 100, 2000] },
			{ type: "spawn", func: "vector", args: [553, 60, 290, 175, 800, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 60, 290, -5, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 290, 95, -5, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 290, 95, 175, 800, 0, 3500] }
		],
		"s-2804-9000-131-0": [
			{ type: "text", sub_type: "message", message: "Front | Left Scratch", message_RU: "Удар вперед | Левый черкаш" },
			{ type: "text", sub_type: "message", delay: 1200, message: "Dodge", message_RU: "Эвейд" },
			{ type: "spawn", func: "circle", args: [false, 553, 358, 340, 6, 630, 100, 2000] },
			{ type: "spawn", func: "vector", args: [553, 90, 115, 186, 800, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 90, 115, 6, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 270, 250, 6, 300, 0, 3500] },
			{ type: "spawn", func: "vector", args: [553, 270, 250, 186, 800, 0, 3500] }
		],
		"s-2804-9000-135-0": [
			{ type: "text", sub_type: "message", message: "Perfect Defense", message_RU: "Идеальный блок" },
			{ type: "text", sub_type: "message", delay: 800, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 3000] }
		],
		"s-2804-9000-137-0": [
			{ type: "text", sub_type: "message", message: "Hammer back", message_RU: "Удар назад" },
			{ type: "spawn", func: "circle", args: [false, 553, 185, 500, 8, 490, 100, 2000] }
		],
		"s-2804-9000-138-0": [{ type: "text", sub_type: "message", delay: 900, message: "Dodge", message_RU: "Эвейд" }], // Knockup (Bait)
		"s-2804-9000-139-0": [{ type: "text", sub_type: "message", delay: 200, message: "Dodge!", message_RU: "Эвейд!" }],
		"s-2804-9000-140-0": [
			{ type: "text", sub_type: "message", message: "Waves (Right)", message_RU: "Волны (правая)" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 323, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 217, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-141-0": [
			{ type: "text", sub_type: "message", message: "Waves (Right) 3nd fast", message_RU: "Волны (правая) 3-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 323, 125, 0, 2533, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 217, 125, 0, 2533, false, ["safe", "safe"]] }
		],
		"s-2804-9000-142-0": [
			{ type: "text", sub_type: "message", message: "Waves (Right) 2nd fast", message_RU: "Волны (правая) 2-я быстрая" },
			{ type: "func", func: waves_event },
			{ type: "spawn", func: "marker", args: [false, 323, 125, 0, 2500, false, ["safe", "safe"]] },
			{ type: "spawn", func: "marker", args: [false, 217, 125, 0, 2500, false, ["safe", "safe"]] }
		],
		"s-2804-9000-307-0": [
			{ type: "text", sub_type: "message", message: "!", message_RU: "!" },
			{ type: "text", sub_type: "message", delay: 20000, message: "Last aerolite", message_RU: "Последний метеор" }
		],
		"s-2804-9000-308-0": [{ type: "text", sub_type: "message", message: "Stun (1)", message_RU: "Стан (1)" }],
		"s-2804-9000-309-0": [{ type: "text", sub_type: "message", message: "Stun (2)", message_RU: "Стан (2)" }],
		"s-2804-9000-310-0": [{ type: "text", sub_type: "message", message: "Stun (3)", message_RU: "Стан (3)" }],
		"s-2804-9000-311-0": [
			{ type: "text", sub_type: "message", message: "Wrath (Kaia)", message_RU: "Облепиха (кайа)" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 500, 0, 6000] }
		],
		"s-2804-9000-312-0": [
			{ type: "text", sub_type: "message", message: "Wrath (Kaia)", message_RU: "Облепиха (кайа)" },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 0, 500, 0, 6000] },
			{ type: "spawn", func: "vector", args: [553, 0, 0, 180, 500, 0, 6000] }
		],
		// Enraged
		"s-2804-9000-101-0": "s-2804-2000-1101-0",
		"s-2804-9000-103-0": "s-2804-2000-1103-0",
		"s-2804-9000-107-0": "s-2804-2000-1107-0",
		"s-2804-9000-108-0": "s-2804-2000-1108-0",
		"s-2804-9000-111-0": "s-2804-2000-1111-0",
		"s-2804-9000-112-0": [
			{ type: "text", sub_type: "message", delay: 1000, message: "Perfect Defense x2 (Slow)", message_RU: "Идеальный блок x2 (медленно)" },
			{ type: "text", sub_type: "message", delay: 2400, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 4000] }
		],
		/*"s-2804-9000-2113-0": "s-2804-2000-1113-0",
		"s-2804-9000-2114-0": "s-2804-2000-1114-0",*/
		"s-2804-9000-115-0": [{ type: "text", sub_type: "message", delay: 100, message: "Dodge", message_RU: "Эвейд" }], // Knockup
		/*"s-2804-9000-2116-0": "s-2804-2000-1116-0",
		"s-2804-9000-2116-1": "s-2804-2000-1116-1",
		"s-2804-9000-2117-0": "s-2804-2000-1117-0",
		"s-2804-9000-2118-0": "s-2804-2000-1118-0",
		"s-2804-9000-2118-1": "s-2804-2000-1118-1",
		"s-2804-9000-2119-0": "s-2804-2000-1119-0",
		"s-2804-9000-2120-0": "s-2804-2000-1120-0",
		"s-2804-9000-2121-0": "s-2804-2000-1121-0",
		"s-2804-9000-2122-0": "s-2804-2000-1122-0",
		"s-2804-9000-2123-0": "s-2804-2000-1123-0",
		"s-2804-9000-2125-0": "s-2804-2000-1125-0",
		"s-2804-9000-2131-0": "s-2804-2000-1131-0",*/
		"s-2804-9000-135-0": [
			{ type: "text", sub_type: "message", message: "Perfect Defense x2", message_RU: "Идеальный блок x2" },
			{ type: "text", sub_type: "message", delay: 800, message: "Block", message_RU: "Блок" },
			{ type: "spawn", func: "circle", args: [false, 553, 356, 220, 12, 210, 100, 4000] }
		],
		//"s-2804-9000-2137-0": "s-2804-2000-1137-0",
		"s-2804-9000-138-0": [{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд" }], // Knockup (Bait)
		//"s-2804-9000-2139-0": "s-2804-2000-1139-0",
		//"s-2804-9000-2140-0": "s-2804-2000-1140-0",
		//"s-2804-9000-2141-0": "s-2804-9000-1141-0",
		//"s-2804-9000-2142-0": "s-2804-9000-1142-0",
		//
		"s-2804-2500-201-0": [
			{ type: "event", check_func: () => print_loading, args: [
				{ type: "text", sub_type: "alert", message: "Loading lasers...", message_RU: "Зарядка лазеров..." },
				{ type: "func", func: () => print_loading = false }
			] }
		],
		"s-2804-2500-305-0": [
			{ type: "event", check_func: () => print_lasers, args: [
				{ type: "text", sub_type: "message", message: "Laser", message_RU: "Лазер" },
				{ type: "func", func: () => print_lasers = false },
				{ type: "func", func: () => print_lasers = true, delay: 4000 }
			] },
			{ type: "spawn", func: "vector", args: [912, 0, 0, 0, 3000, 0, 4000] }
		],
		"ab-2804-9000-90442303": [{ type: "text", sub_type: "message", message: "Plague/Regress", message_RU: "Регресс" }],
		"ab-2804-9000-90442304": [
			{ type: "text", sub_type: "notification", message: "Stun", message_RU: "Стан!", speech: false },
			{ type: "text", sub_type: "message", message: "Stun", message_RU: "Стан!" }
		],
		
	   //Manaya 

		"ns-2804-10000": [
			{ type: "func", func: () => debuff_list = [] }
		],
		"nd-2804-10000": [
			{ type: "stop_timers" },
			{ type: "despawn_all" }
		],
		"h-2804-10000-40": [{ type: "text", sub_type: "message", message: "40%" }],
		"h-2804-10000-50": [{ type: "text", sub_type: "message", message: "50%" }],
		"h-2804-10000-80": [{ type: "text", sub_type: "message", message: "80%" }],
		// Donuts
		"s-2804-10000-102-0": [{ type: "text", sub_type: "message", message: "In - Out", message_RU: "К нему - От него" }],
		//"s-2804-10000-102-0": "s-2804-10000-3102-0",
		// AoE
		"s-2804-10000-122-0": [
			{ type: "text", sub_type: "message", message: "Roar (AoE) - Inward Waves", message_RU: "Рев (АоЕ) - Волны внутрь" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 500, 0, 9000] }
		],
		"s-2804-1002-212-0": [{ type: "text", sub_type: "message", message: "Dodge", message_RU: "Эвейд", delay: 500 }],
		"s-2804-10000-204-0": [
			{ type: "text", sub_type: "message", message: "Roar (AoE)", message_RU: "Рев (АоЕ)" },
			{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 8, 500, 0, 5000] },
		],
		//"s-2804-10000-122-0": "s-2804-10000-3122-0",
		//"s-2804-10000-204-0": "s-2804-10000-3204-0",
		// Puddle
		"s-2804-10000-116-0": [{ type: "text", sub_type: "message", message: "5 Puddles", message_RU: "5 луж" }],
		//"s-2804-10000-116-0": "s-2804-10000-3116-0",
		// Shield Phase
		"s-2804-10000-303-0": [
			{ type: "text", sub_type: "message", message: "Shield", message_RU: "Щит" },
			{ type: "text", sub_type: "message", message: "Shield soon...!", message_RU: "Скоро щит...", delay: 1000000 }
		],
		// Stuns
		"s-2804-10000-119-0": [{ type: "text", sub_type: "message", message: "Stun Frontal", message_RU: "Передний стан" }],
		"s-2804-10000-104-0": [
			{ type: "text", sub_type: "message", message: "Jump (Stun)", message_RU: "Прыжок (стан)" },
			{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 20, 200, 0, 1500] }
		],
		"s-2804-10000-108-0": [{ type: "text", sub_type: "message", message: "Fly (Puddle)", message_RU: "Полет (лужа)" }],
		"s-2804-10000-108-2": [{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 20, 200, 0, 1250] }],
		/*"s-2804-10000-4119-0": "s-2804-10000-3119-0",
		"s-2804-10000-4104-0": "s-2804-10000-3104-0",
		"s-2804-10000-4108-0": "s-2804-10000-3108-0",
		"s-2804-10000-4108-2": "s-2804-10000-3108-2",*/
		// Attacks
		"s-2804-10000-107-0": [{ type: "text", sub_type: "message", message: "Laser", message_RU: "Лазер" }],
		"s-2804-10000-109-0": [{ type: "text", sub_type: "message", message: "Stun (Puddle)", message_RU: "Стан (лужа)" }],
		"s-2804-10000-115-0": [
			{ type: "text", sub_type: "message", message: "Tail Split", message_RU: "Хвост" },
			{ type: "spawn", func: "vector", args: [553, 0, 10, 220, 350, 0, 3000] },
			{ type: "spawn", func: "vector", args: [553, 0, 10, -220, 350, 0, 3000] }
		],
		"s-2804-10000-120-0": [{ type: "text", sub_type: "message", message: "Tail Pushback", message_RU: "Откид хвостом" }],
		"s-2804-10000-205-0": [{ type: "text", sub_type: "message", message: "Dig Attack", message_RU: "Нижняя атака" }],
		"s-2804-10000-205-1": [{ type: "spawn", func: "circle", args: [true, 553, 0, 0, 20, 185, 0, 1500] }],
		"s-2804-10000-205-1": [{ type: "spawn", func: "circle", args: [false, 553, 0, 0, 20, 185, 0, 1500] }],
		/*"s-2804-10000-107-0": "s-2804-10000-3107-0",
		"s-2804-10000-4109-0": "s-2804-10000-3109-0",
		"s-2804-10000-4115-0": "s-2804-10000-3115-0",
		"s-2804-10000-4205-0": "s-2804-10000-3205-0",
		"s-2804-10000-4120-0": "s-2804-10000-3120-0",*/
		// Debuff Mechs
		"qb-2804-10000-28041004": [
			{ type: "func", func: () => type = 0 },
			{ type: "text", sub_type: "message", message: "Debuff (Normal)", message_RU: "Дебаф (нормал)" }
		],
		"qb-2804-10000-28041002": [
			{ type: "func", func: () => type = 1 },
			{ type: "text", sub_type: "message", message: "Debuff (Reverse)", message_RU: "Дебаф (реверс)" }
		],
		"am-2804-10000-28041008": [{ type: "func", func: debuff_event, args: [1] }],
		"am-2804-10000-28041009": [{ type: "func", func: debuff_event, args: [2] }],
		"am-2804-10000-28041010": [{ type: "func", func: debuff_event, args: [3] }],
		"am-2804-10000-28041011": [{ type: "func", func: debuff_event, args: [4] }],
		// Plague/Regress
		"ab-2804-10000-28040100-1": [{ type: "text", sub_type: "message", message: "Plague/Regress - Stack 1", message_RU: "Регресс - стак 1" }],
		"ab-2804-10000-28040100-2": [{ type: "text", sub_type: "message", message: "Plague/Regress - Stack 2", message_RU: "Регресс - стак 2" }],
	};
};