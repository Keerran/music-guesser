import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from "$env/static/private";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import queryString from "query-string";

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
    const code = url.searchParams.get("code");
    // const state = url.searchParams.get("state");

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(
                SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
        body: queryString.stringify({
            grant_type: "authorization_code",
            code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
    }).then(res => res.json());

    if(response.error) {
        throw error(400, response.error_description);
    }

    cookies.set("spotify_refresh_token", response.refresh_token, { path: "/" });
    cookies.set("spotify_access_token", response.access_token, { path: "/" });

    throw redirect(301, "/");
}