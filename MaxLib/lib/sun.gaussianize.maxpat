{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 6,
			"minor" : 0,
			"revision" : 8
		}
,
		"rect" : [ 77.0, 62.0, 1166.0, 892.0 ],
		"bglocked" : 0,
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 0,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 0,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"boxanimatetime" : 200,
		"imprint" : 0,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"boxes" : [ 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-20",
					"maxclass" : "flonum",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "float", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 153.0, 758.0, 50.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"comment" : "",
					"id" : "obj-13",
					"maxclass" : "outlet",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 100.0, 784.0, 25.0, 25.0 ]
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-12",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 100.0, 686.0, 63.0, 20.0 ],
					"text" : "sun.interp"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-8",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 464.0, 73.0, 60.0, 20.0 ],
					"text" : "loadbang"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-7",
					"linecount" : 51,
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 470.0, 104.0, 297.0, 688.0 ],
					"text" : "-3. -2.656095 -2.413266 -2.261708 -2.149175 -2.058672 -1.982433 -1.916229 -1.857493 -1.804543 -1.756217 -1.711675 -1.670292 -1.631586 -1.59518 -1.560774 -1.528122 -1.497023 -1.467307 -1.438834 -1.411481 -1.385146 -1.359737 -1.335178 -1.311398 -1.288338 -1.265943 -1.244165 -1.222962 -1.202296 -1.18213 -1.162434 -1.143179 -1.124338 -1.105889 -1.087808 -1.070076 -1.052675 -1.035586 -1.018795 -1.002286 -0.986046 -0.970062 -0.954321 -0.938814 -0.92353 -0.908458 -0.89359 -0.878916 -0.86443 -0.850123 -0.835987 -0.822017 -0.808205 -0.794546 -0.781034 -0.767662 -0.754427 -0.741322 -0.728344 -0.715487 -0.702747 -0.69012 -0.677603 -0.66519 -0.652879 -0.640667 -0.628549 -0.616523 -0.604585 -0.592733 -0.580964 -0.569274 -0.557662 -0.546125 -0.534659 -0.523264 -0.511936 -0.500674 -0.489474 -0.478336 -0.467257 -0.456235 -0.445267 -0.434354 -0.423491 -0.412679 -0.401914 -0.391196 -0.380523 -0.369893 -0.359304 -0.348756 -0.338246 -0.327773 -0.317337 -0.306934 -0.296565 -0.286228 -0.275921 -0.265643 -0.255394 -0.245171 -0.234974 -0.224801 -0.214651 -0.204523 -0.194416 -0.18433 -0.174261 -0.164211 -0.154177 -0.144158 -0.134154 -0.124164 -0.114185 -0.104218 -0.094262 -0.084315 -0.074376 -0.064444 -0.054519 -0.044599 -0.034684 -0.024772 -0.014862 -0.004954 0.004954 0.014862 0.024772 0.034684 0.044599 0.054519 0.064444 0.074376 0.084315 0.094262 0.104218 0.114185 0.124164 0.134154 0.144158 0.154177 0.164211 0.174261 0.18433 0.194416 0.204523 0.214651 0.224801 0.234974 0.245171 0.255394 0.265643 0.275921 0.286228 0.296565 0.306934 0.317337 0.327773 0.338246 0.348756 0.359304 0.369893 0.380523 0.391196 0.401914 0.412679 0.423491 0.434354 0.445267 0.456235 0.467257 0.478336 0.489474 0.500674 0.511936 0.523264 0.534659 0.546125 0.557662 0.569274 0.580964 0.592733 0.604585 0.616523 0.628549 0.640667 0.652879 0.66519 0.677603 0.69012 0.702747 0.715487 0.728344 0.741322 0.754427 0.767662 0.781034 0.794546 0.808205 0.822017 0.835987 0.850123 0.86443 0.878916 0.89359 0.908458 0.92353 0.938814 0.954321 0.970062 0.986046 1.002286 1.018795 1.035586 1.052675 1.070076 1.087808 1.105889 1.124338 1.143179 1.162434 1.18213 1.202296 1.222962 1.244165 1.265943 1.288338 1.311398 1.335178 1.359737 1.385146 1.411481 1.438834 1.467307 1.497023 1.528122 1.560774 1.59518 1.631586 1.670292 1.711675 1.756217 1.804543 1.857493 1.916229 1.982433 2.058672 2.149175 2.261708 2.413266 2.656095 3."
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"frgb" : 0.0,
					"id" : "obj-5",
					"linecount" : 5,
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 28.0, 441.0, 442.0, 74.0 ],
					"text" : "python code to generate the LUT:\nimport scipy, scipy.stats\nD = scipy.stats.norm()\n\" \".join(str(f) for f in scipy.clip(-D.isf(scipy.linspace(0,1,254)), -3, 3))\nJust imagine if this was all python. How sick would that be?"
				}

			}
, 			{
				"box" : 				{
					"comment" : "",
					"id" : "obj-3",
					"maxclass" : "inlet",
					"numinlets" : 0,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 100.0, 633.0, 25.0, 25.0 ]
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"frgb" : 0.0,
					"id" : "obj-2",
					"linecount" : 7,
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 49.0, 247.0, 160.0, 100.0 ],
					"text" : "turn a number in the range 0-1 into an approximate standard gaussian by brute force.nb - no more than 3 sigma in the lookup table. Strictly non-industrial strength."
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-13", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-12", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-20", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-12", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-12", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-12", 1 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-7", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-7", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-8", 0 ]
				}

			}
 ]
	}

}
