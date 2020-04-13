import { promises as fs} from "fs"
const { realpath} = fs

export async function isMain( importMetaUrl){
	if( !importMetaUrl){
		throw new Error("isMain with no 'importMetaUrl'")
	}

	let resolved= process&& process.argv&& process.argv[ 1]
	while( true){
		const link= await realpath( resolved)
		if( link=== resolved){
			break
		}
		resolved= link
	}
	return importMetaUrl=== `file://${resolved}`
}
export default isMain
