export interface Artist {
    url: string,
    name: string,
}

export interface Image {
    "#text": string,
    size: "small" | "medium" | "large" | "extralarge",
}

export interface Album {
    artist: Artist,
    image: Image[],
    name: string,
    playcount: number,
    url: string,
}