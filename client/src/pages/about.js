import { Link } from 'react-router-dom';



export default function About() {

    return (
        <div>
            <h1> About this App: </h1>
            <p> This is an app to connect to spotify. It will show a library that reflects your spotify stats (hopefully)</p>
            <Link to="/" >Home</Link>
        </div>
    )
}