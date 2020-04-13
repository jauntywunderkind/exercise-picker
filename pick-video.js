#!/usr/bin/env node
import { promises as fs } from "fs"
const { readdir}= fs
import glob from "fast-glob"
import isMain from "./is-main.js"

export const defaults= {
	videos: 3,
	glob: ["*mp4", "*avi", "*mkv"]
}

export async function pickVideo( opts){
	opts= Object.assign({}, defaults, opts)
	const candidates= await glob( opts.glob)

	let n= opts.videos
	const picks= []
	while( n--> 0){
		const pick= Math.floor(Math.random()* candidates.length)
		picks.push( candidates[ pick])
		candidates.splice( pick, 1)
	}
	return picks
}
export default pickVideo

export async function main( opts){
	const videos= await pickVideo( opts)
	console.log( videos.join("\n"))
	return videos
}

isMain( import.meta.url).then( isMain=> {
	if( !isMain){
		return
	}
	main()
})
