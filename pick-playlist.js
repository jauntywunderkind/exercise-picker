#!/usr/bin/env node
import { gets} from "voodoo-opt/gets.js"

import isMain from "./is-main.js"

// generate a m3u playlist with start & stop times in it
// see https://www.vlchelp.com/skipping-and-playing-audio-and-video-portions-in-vlc/

async function m3u( opt){
	const { ndjson, preroll }= await gets({ ndjson: undefined, preroll: 3}, opt)
	
	console.log( "#EXTM3U")
	// unhappy for at least vlc:
	//console.log( "#EXT-X-VERSION:6")
	console.log( "#EXT-X-PLAYLIST-TYPE:VOD")
	for await( const { file, chapter} of ndjson){
		console.log( `#EXTINF:${chapter.end- chapter.start+ preroll},${chapter.title||''}`)

		// vlc has an extension we can use, but i fear it is not well supported
		console.log( `#EXTVLCOPT:start-time=${chapter.start- preroll}`)
		console.log( `#EXTVLCOPT:stop-time=${chapter.end}`)

		// probably not useful per-Media-Segment like we are trying to do here?
		//console.log( `#EXT-X-START:TIME-OFFSET=${chapter.start}`)
		// thought maybe it was, but I don't think so:
		//console.log( `#EXT-X-START:${chapter.start}`)
		console.log( encodeURIComponent(file.name))
	}
}

isMain( import.meta.url).then(isMain => {
	if (!isMain){
		return
	}
	m3u()
})
