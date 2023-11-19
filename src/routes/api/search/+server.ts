import { LASTFM_BASE_URL, LASTFM_KEY } from "$env/static/private";
import type { Album } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";
import queryString from "query-string";

export const GET: RequestHandler = async ({ url, fetch }) => { 
    const query = url.searchParams.get("query");

    const res = await fetch(LASTFM_BASE_URL + "?" + queryString.stringify({
        album: query,
        api_key: LASTFM_KEY,
        method: "album.search",
        format: "json",
    })).then(res => res.json());

    const albums: Album[] = res.results.albummatches.album;

    // function rate(a: Album) {
    //     return damLev(displayAlbum(a).toLowerCase(), query!.toLowerCase()).steps;
    // }

    // albums.sort((a, b) => rate(a) - rate(b));

    return json({
        results: albums.slice(0, 10),
    });
}