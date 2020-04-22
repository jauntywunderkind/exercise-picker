#!/usr/bin/env node
import ffprobe from "node-ffprobe"
import { basename} from "path"
import { get} from "voodoo-opt/get.js"

import isMain from "./is-main.js"

export async function probe( opt){
	const
		lines= await get("lines", opt),
		probes= []
	for await(const video of lines){
		const info= ffprobe( video)
		probes.push( info)
	}
	const results= await Promise.all( probes)
	return results
}

export async function pickChapters( opt){
	// get existing "probes" or run "probe" 
	opt= Object.assign({probe, pickChapter, chapters: 6}, opt)
	const probes= await (opt.probes|| opt.probe())

	// count how many chapters there are total
	const count= probes.reduce(( acc, cur)=> acc+ cur.chapters.length, 0)

	// start making picks
	const picks= new Array( opt.chapters)
	for( let i= 0; i< picks.length; ++i){
		picks[ i]= opt.pickChapter( probes, count)
	}

	return picks
}
export default pickChapters


export function pickChapter( probes, count){
	if( count=== undefined){
		count= probes.reduce(( acc, cur)=> acc+ cur.chapters.length, 0)
	}

	let number= Math.floor( Math.random()* count)
	let filenum= 0
	let video= probes[ filenum]
	while( number>= video.chapters.length){
		number-= video.chapters.length
		video= probes[ ++filenum]
	}
	const chapter= video.chapters[ number];
	return {
		file: {
			number: filenum,
			name: basename( video.format.filename),
			title: video.format.tags.title,
		},
		chapter: {
			number,
			title: chapter.tags.title,
			start: Number.parseFloat( chapter.start_time),
			end: Number.parseFloat( chapter.end_time)
		}
	}
}

export async function main( opt){
	const chapters= await pickChapters( opt)
	// json output:
	//console.log( JSON.stringify( chapters, null, "\t"))
	// ndjson:
	chapters.forEach( chapter=> console.log( JSON.stringify( chapter)))
	return chapters
}

isMain( import.meta.url).then(isMain => {
	if (!isMain){
		return
	}
	main()
})
