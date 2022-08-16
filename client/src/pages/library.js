import { useLocation } from "react-router-dom";
import '../styles/library.css'


const Library = () => {


    const location = useLocation()
    const { imageURL, profile } = location.state

    const libraryImage = new Image()
    libraryImage.src = imageURL;

    return (
        <div>

            <div className="header">
                {profile && (<h1 className="title"> {profile.display_name}'s Spotify Library</h1>)}
            </div>

            <div className="library-container">
                <img className="library" src={imageURL} alt="spotify library" />
            </div>

        </div >
    )

}

export default Library;
