"use strict"

const DefaultSettings = {
	skills: {
		jitterCompensation:		true,
		retryCount:				2,		//	Number of times to retry each skill (0 = disabled). Recommended 1-3.
		retryMs:				30,		/*	Time to wait between each retry.
											SKILL_RETRY_MS * SKILL_RETRY_COUNT should be under 100, otherwise skills may go off twice.
										*/
		longRetryCount:			3,		//	Only used for Warrior: Blade Waltz
		longRetryMs:			80,
		retryJittercomp:		15,		//	Skills that support retry will be sent this much earlier than estimated by jitter compensation.
		retryAlways:			false,	//	Setting this to true will reduce ghosting for extremely short skills, but may cause other skills to fail.
		delayOnFail:			true,	//	Basic initial desync compensation. Useless at low ping (<50ms).
		chargeJitterMax:		50,		/*	Maximum jitter delay to add to charging skills.
											Detected network jitter will be capped by this number. Skill-specific jitter is not capped.
										*/
		serverTimeout:			200,	/*	This number is added to your maximum ping + skill retry period to set the failure threshold for skills.
											If animations are being cancelled while damage is still applied, increase this number.
										*/
		forceClipStrict:		true,	/*	Set this to false for smoother, less accurate iframing near walls.
											Warning: Will cause occasional clipping through gates when disabled. Do NOT abuse this.
										*/
		defendSuccessStrict:	true	//	[Brawler] Set this to false to see the Perfect Block icon at very high ping (warning: may crash client).
	},
	ping: {
		interval:	6000,	//	Interval between pings. Recommended 2000-3000ms for WiFi or unstable connections, 6000ms for wired.
		timeout:	30000,	//	Milliseconds to wait before giving up and retrying ping.
		maxHistory: 20		//	Maximum number of ping samples used to calculate min/max/avg values.
	},
	debug: {
		skills:			false,
		loc:			false,
		glyphs:			false,
		projectiles:	false,
		abnormals:		false
	}
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) {
		// Migrate legacy config file
		return DefaultSettings;
	} else if (from_ver === null) {
		// No config file exists, use default settings
		return DefaultSettings;
	} else {
		// Migrate from older version (using the new system) to latest one
		if (from_ver + 1 < to_ver) {
			// Recursively upgrade in one-version steps
			settings = MigrateSettings(from_ver, from_ver + 1, settings);
			return MigrateSettings(from_ver + 1, to_ver, settings);
		}

		switch (to_ver)
		{
			default:
				settings = Object.assign(settings, DefaultSettings);
				break;
		}
	
		return settings;
	}
}
