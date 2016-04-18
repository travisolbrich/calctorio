#!/usr/bin/env lua

-- Sourced from https://github.com/sparr/factorio-data-extract/blob/master/recipes-to-json.lua

json = require("json")

data = {}

function data.extend (target, new_data)
	for i=1,#new_data do
	        target[#target+1] = new_data[i]
	end
end

dofile("core-0-12-1.lua")

print(json.encode(data))


