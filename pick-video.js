#!/usr/bin/env node
import { promises as fs } from "fs"
import glob from "fast-glob"

import isMain from "./is-main.js"

const { readdir}= fs

export const defaults= {
	n: 3,
	glob: ["*mp4", "*avi", "*mkv"]
}

export async function pickVideos( opts){
	opts= Object.assign({}, defaults, opts)
	const candidates= await glob( opts.glob)

	let n= opts.n
	const picks= []
	while( n--> 0){
		const pick= Math.floor(Math.random()* candidates.length)
		picks.push( candidates[ pick])
		candidates.splice( pick, 1)
	}
	return picks
}

isMain( import.meta.url).then( main=> {
	if( !main){
		return
	}
	pickVideos().then(videos => console.log( videos.join("\n")))
})
