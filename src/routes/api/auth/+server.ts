import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "$env/static/private";
import { redirect, type RequestHandler } from '@sveltejs/kit';
import queryString from 'query-string';

export const GET: RequestHandler = () => {
    const query = queryString.stringify({
		client_id: SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: SPOTIFY_REDIRECT_URI,
		scope: "user-read-private user-read-email",
        // TODO: add state
	});
	throw redirect(301, "https://accounts.spotify.com/authorize?" + query);
};