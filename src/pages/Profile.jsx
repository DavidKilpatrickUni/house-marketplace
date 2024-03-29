import React from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../component/ListingItem'

function Profile() {

    const auth = getAuth()
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const [changeDetails, setChangeDetails] = useState(false)
    const [myListings, setMyListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const { name, email } = formData

    const navigate = useNavigate()

    useEffect(() => {

        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setMyListings(listings)
            setLoading(false)
        }

        fetchUserListings()

    }, [auth.currentUser.uid])

    const handleLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }

            const userRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(userRef, {
                name: name
            })

        } catch (err) {
            toast.error('Could not update profile name')
        }

    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete listing')) {
            await deleteDoc(doc(db, 'listings', listingId))
        }
        const updatedListings = myListings.filter((listing) => (listing.id !== listingId))

        setMyListings(updatedListings)
        toast.success('Listing Deleted')
    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`)
    }



    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>
                    My Profile
                </p>
                <button
                    type='button'
                    className='logOut'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className='profileDetailsText'>
                        Personal Details
                    </p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails((prev) => !prev)
                        }}
                    >
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input
                            type='text'
                            id='name'
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={handleChange}
                        />
                        <input
                            type='text'
                            id='email'
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                            disabled={!changeDetails}
                            value={email}
                            onChange={handleChange}
                        />
                    </form>
                </div>
                <Link
                    to='/create-listing' className='createListing'
                >
                    <img src={homeIcon} alt='home' />
                    <p>
                        Sell Or Rent A Home
                    </p>
                    <img src={arrowRight} alt='right arrow' />
                </Link>

                {!loading && myListings?.length > 0 && (
                    <>
                        <p className='listingText'>
                            Your Listings
                        </p>
                        <ul className='listingsList'>
                            {myListings.map((item) => (
                                <ListingItem key={item.id} id={item.id} listing={item.data} onDelete={() => onDelete(item.id)}

                                    onEdit={() => onEdit(item.id)} />

                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}

export default Profile
