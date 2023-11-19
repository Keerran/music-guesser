import { LASTFM_BASE_URL, LASTFM_KEY } from "$env/static/private";
import type { Album } from "$lib/types";
import queryString from "query-string";
import type { PageServerLoad } from "./$types";

interface AlbumResponse {
    topalbums: {
        album: Album[];
    }
}

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { user } = params;

    let albums: Album[] = []
    let page = 1;
    do {
        const res: AlbumResponse = await fetch(LASTFM_BASE_URL + "?" + queryString.stringify({
            method: "user.gettopalbums",
            format: "json",
            api_key: LASTFM_KEY,
            page,
            user,
        })).then(res => res.json());

        albums = [...albums, ...res.topalbums.album]
        console.log(albums.at(-1)?.playcount)
        page++;
    }
    while ((albums.at(-1)?.playcount ?? 0) > 100)

    return { albums }
}