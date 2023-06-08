import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { catchErrors } from '../utilities';
import { getCurrentUserProfile, getUsersTopTracks, getUsersTopArtists } from '../spotify';
import '../styles/main.css'
import { getUsersTopGenres } from '../genres'
import Canvas from '../canvas'

const MainPage = () => {

    const [profile, setProfile] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [topGenres, setTopGenres] = useState(null);
    const [image, setImage] = useState(null);

    const getImageUrl = (img) => {
        setImage(img)
    }


    useEffect(() => {
        const fetchData = async () => {
            const userProfile = await getCurrentUserProfile();
            setProfile(userProfile.data)

            const userTopTracks = await getUsersTopTracks();
            setTopTracks(userTopTracks.data)

            const userTopArtists = await getUsersTopArtists(5);
            setTopArtists(userTopArtists.data)

            const userTopGenres = await getUsersTopGenres(userTopArtists.data);
            setTopGenres(userTopGenres);
        }

        catchErrors(fetchData());
    
    }, []);


    return (
        <div className="container">
            <div className="header">
                {profile && (<h1 className="title"> {profile.display_name}'s Spotify Library</h1>)}
            </div>
            <div>
                <div className="content">                
                    { topArtists && topArtists.items.length && topTracks && 
                        <Canvas 
                            className="canvas" 
                            width={1150} 
                            height={1500} 
                            tracks={topTracks.items} 
                            artistImgs={topArtists.items.slice(0, 4)} 
                            genres={topGenres}
                            imageURL={getImageUrl}
                        /> 
                    }

                    <button> <Link to="/library" state={{ imageURL: image, profile: profile }}> See your Library! </Link> </button>

                    {/* <h1> Top Artists </h1>

                    {topArtists && topArtists.items.length ? (
                        <ul>
                            {topArtists.items.slice(0, 5).map((artist, index) => {
                                return <li key={index}> {artist.name}</li>
                            })}
                        </ul>
                        
                    ) : (
                        <h1> artists not found :( </h1>
                    )}

                    <h1> Top Songs </h1>

                    {topTracks && topTracks.items.length ? (
                        <ul>
                            {topTracks.items.map((track, index) => {
                                return <li key={index}>{track.name}</li>
                            })}
                        </ul>
                        
                    ) : (
                        <h1> tracks not found :( </h1>
                    )}

                    <h1> Top Genres </h1>

                    {topGenres && topGenres.length ? (
                        <ul>
                            {topGenres.map((genre, index) => {
                                return <li key={index}>{genre}</li>
                            })}
                        </ul>
                        
                    ) : (
                        <h1> genres not found :( </h1>
                    )} */}
                </div>

            </div>
        </div>
    )
}

export default MainPage;