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

	// ahead of time calculations
	let totalChapters= 0
	for( const probe of probes){
		totalChapters+= probe.chapters.length

		// create a new propert with chapter offset, which can be... negative?
		//probe.chapter_offset= Number.POSITIVE_INFINITY
		// uhh perhaps only detect negative offset
		probe.chapter_offset= 0
		for( const chapter of probe.chapters){
			if( chapter.start_time< probe.chapter_offset){
				probe.chapter_offset= chapter.start_time
			}
		}
	}

	// start making picks
	const picks= new Array( opt.chapters)
	for( let i= 0; i< picks.length; ++i){
		picks[ i]= opt.pickChapter( probes, totalChapters)
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
	const
		chapter= video.chapters[ number],
		offset= video.chapter_offset|| 0
	return {
		file: {
			number: filenum,
			name: basename( video.format.filename),
			title: video.format.tags.title,
		},
		chapter: {
			number,
			title: chapter.tags.title,
			start: Number.parseFloat( chapter.start_time- offset),
			end: Number.parseFloat( chapter.end_time- offset)
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
