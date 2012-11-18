{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 6,
			"minor" : 0,
			"revision" : 8
		}
,
		"rect" : [ 77.0, 62.0, 1267.0, 892.0 ],
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
					"id" : "obj-6",
					"maxclass" : "flonum",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "float", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 203.0, 599.0, 50.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-1",
					"maxclass" : "newobj",
					"numinlets" : 6,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 100.0, 642.0, 96.0, 20.0 ],
					"text" : "scale -3. 3. 0. 1."
				}

			}
, 			{
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
					"linecount" : 42,
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 464.0, 142.0, 358.0, 568.0 ],
					"text" : "0 0.00135 0.00146 0.001578 0.001704 0.00184 0.001985 0.002141 0.002308 0.002487 0.002678 0.002882 0.0031 0.003332 0.003581 0.003846 0.004128 0.004428 0.004748 0.005089 0.005451 0.005836 0.006245 0.006679 0.007139 0.007627 0.008144 0.008692 0.009272 0.009885 0.010534 0.011219 0.011943 0.012707 0.013513 0.014362 0.015257 0.0162 0.017192 0.018236 0.019333 0.020485 0.021696 0.022966 0.024298 0.025695 0.027158 0.02869 0.030294 0.031971 0.033723 0.035554 0.037466 0.039461 0.041542 0.04371 0.045969 0.048321 0.050768 0.053313 0.055958 0.058705 0.061557 0.064516 0.067585 0.070765 0.074058 0.077468 0.080996 0.084643 0.088412 0.092305 0.096323 0.100469 0.104743 0.109147 0.113683 0.118352 0.123154 0.128092 0.133165 0.138375 0.143722 0.149207 0.15483 0.160591 0.16649 0.172528 0.178703 0.185016 0.191465 0.19805 0.204771 0.211625 0.218611 0.225729 0.232975 0.240349 0.247849 0.255471 0.263215 0.271076 0.279053 0.287142 0.295341 0.303645 0.312053 0.320559 0.329161 0.337854 0.346635 0.355498 0.364441 0.373458 0.382544 0.391696 0.400909 0.410176 0.419494 0.428858 0.438261 0.4477 0.457169 0.466661 0.476173 0.485698 0.495232 0.504768 0.514302 0.523827 0.533339 0.542831 0.5523 0.561739 0.571142 0.580506 0.589824 0.599091 0.608304 0.617455 0.626542 0.635559 0.644502 0.653365 0.662146 0.670839 0.679441 0.687947 0.696355 0.704659 0.712858 0.720947 0.728924 0.736785 0.744529 0.752151 0.759651 0.767025 0.774271 0.781389 0.788375 0.795229 0.80195 0.808535 0.814984 0.821297 0.827472 0.83351 0.839409 0.84517 0.850793 0.856278 0.861625 0.866835 0.871908 0.876846 0.881648 0.886317 0.890853 0.895257 0.899531 0.903677 0.907695 0.911588 0.915357 0.919004 0.922532 0.925942 0.929235 0.932415 0.935484 0.938443 0.941295 0.944042 0.946687 0.949232 0.951679 0.954031 0.95629 0.958458 0.960539 0.962534 0.964446 0.966277 0.968029 0.969706 0.97131 0.972842 0.974305 0.975702 0.977034 0.978304 0.979515 0.980667 0.981764 0.982808 0.9838 0.984743 0.985638 0.986487 0.987293 0.988057 0.988781 0.989466 0.990115 0.990728 0.991308 0.991856 0.992373 0.992861 0.993321 0.993755 0.994164 0.994549 0.994911 0.995251 0.995572 0.995872 0.996154 0.996419 0.996668 0.9969 0.997118 0.997322 0.997513 0.997692 0.997859 0.998015 0.99816 0.998296 0.998422 0.99854 0.99865 1"
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
					"text" : "python code to generate the LUT:\nimport scipy, scipy.stats\nD = scipy.stats.norm()\n\" \".join(str(f) for f in ([0] + list(D.cdf(scipy.linspace(-3,3,252))) + [1]))\nJust imagine if this was all python. How sick would that be?"
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
					"patching_rect" : [ 100.0, 566.0, 25.0, 25.0 ]
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"frgb" : 0.0,
					"id" : "obj-2",
					"linecount" : 5,
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 49.0, 247.0, 221.0, 74.0 ],
					"text" : "turn a standard  gaussian variate  in the range -3-3 into an uniform by brute force. nb - no more than 3 sigma in the lookup table. Strictly non-industrial strength."
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-12", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
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
					"destination" : [ "obj-1", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-6", 0 ]
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
 ],
		"dependency_cache" : [ 			{
				"name" : "sun.interp.maxpat",
				"bootpath" : "/Users/dan/AbletonLibrary/MaxLib/lib",
				"patcherrelativepath" : "",
				"type" : "JSON",
				"implicit" : 1
			}
 ]
	}

}
