// link will be used for page navigation
import { Link, useLocation } from 'react-router-dom'
import DeleteCounterButton from './DeleteCounterButton';
import AddCounterButton from './AddCounterButton';
import { createHandleAddFromTopTracks, createHandleAddFromPlaylists, createHandleDeleteFromLiked, createHandleDeleteAllLiked } from '../utils/helpers';
// return navbar template
// remember curly braces inside parentheses, destructing, reading data contained within the object
const NavBar = ({ user, itemIds, setClickedCards, setTracks = null }) => {
    // using location to handle knowing which page we are currently on
        // compare the path to the href
    const location = useLocation();
    // convert to a backend controller
    const handleAddFromPlaylists = createHandleAddFromPlaylists();
    const handleAddFromTopTracks = createHandleAddFromTopTracks();
    const handleDeleteFromLiked = createHandleDeleteFromLiked();
    const handleDeleteAllLiked = createHandleDeleteAllLiked();

    const navigation = [
        {name: 'Liked Songs', href:'/likedsongs'},
        {name: 'Top Tracks', href:'/toptracks'},
        {name: 'Playlists', href:'/playlists'}
    ]

    return (
        <nav className="w-screen h-fit sticky bg-beige border-b border-brown3 top-0 z-40 py-4">
            <ul className="w-screen flex items-center gap-x-6">
                <li className="ml-4 flex items-center gap-x-6">
                    {navigation.map( (item) => (
                        
                            <Link 
                                to={item.href}
                                key={item.name}
                                aria-current={ location.pathname === item.href ? 'page' : undefined }
                                className={ `${location.pathname === item.href ? 'bg-brown3 text-beige border-2 border-brown3' : 'bg-beige text-brown3 border-2 border-brown3 hover:bg-brown3 hover:text-beige'} rounded-md px-3 py-2 text-sm font-medium`}
                            >
                                {item.name}
                            </Link>
                        
                    ))}
                </li>
                <li className="shrink">
                    <label htmlFor="search" className="mr-2 text-brown3 font-medium">Search</label>
                    <input id="search" className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md focus:outline-none" type="text"/>
                </li>
                <li>
                    {location.pathname === '/likedsongs' ? (
                        <DeleteCounterButton itemIds={itemIds} handleClick={() => handleDeleteFromLiked(user, itemIds, setClickedCards, setTracks)} disabled={itemIds.length === 0}/>
                    ) : (
                        location.pathname === '/playlists' ? 
                            (<AddCounterButton itemIds={itemIds} handleClick={() => handleAddFromPlaylists(user, itemIds, setClickedCards)} disabled={itemIds.length === 0}/>) : 
                            (<AddCounterButton itemIds={itemIds} handleClick={() => handleAddFromTopTracks(user, itemIds, setClickedCards)} disabled={itemIds.length === 0}/>)
                    )}
                </li>
                <li>
                    {location.pathname === '/likedsongs' ? (
                        <button onClick={() => handleDeleteAllLiked(user.accessToken, setTracks)}className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">Delete All</button>
                    ) : (
                        <button className="text-brown3 bg-beige px-3 py-1.5 border-2 border-brown3 rounded-md hover:bg-brown3 hover:text-beige">Add All</button>
                    )}
                </li>
                <li className="grow">
                    <img
                        alt="Profile Pic"
                        src={user.profilePic}
                        className="h-11 w-auto rounded-md border-solid border border-beige"
                    />
                </li>
            </ul>
        </nav>
)}

export default NavBar;