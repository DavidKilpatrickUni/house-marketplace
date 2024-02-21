import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, where, query, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../component/Spinner'
import ListingItem from '../component/ListingItem'

const Category = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, 'listings')

                console.log(listingsRef)

                //categoryName is the same name I gave the params in App.js i.e /:categoryName
                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                )

                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]

                setLastFetchedListing(lastVisible)

                let listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)

            } catch (err) {
                toast.error('Cant get listings')
            }
        }

        fetchListings()
    }, [params.categoryName])

    const moreFetchListings = async () => {
        try {
            const listingsRef = collection(db, 'listings')

            //categoryName is the same name I gave the params in App.js i.e /:categoryName
            const q = query(
                listingsRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(1)
            )

            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]

            setLastFetchedListing(lastVisible)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prev) => [...prev, ...listings])
            setLoading(false)

        } catch (err) {
            toast.error('Cant get listings')
        }
    }

    return (
        <div className='category'>
            <header>
                <p className='pageHeader'>
                    {params.categoryName === 'rent' ? 'Places For Rent' : 'Places For Sale'}
                </p>
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ? <>
                <main>
                    <ul className='categoryListings'>
                        {listings.map((listing) => (
                            <ListingItem
                                listing={listing.data}
                                id={listing.id}
                                key={listing.id} />
                        ))}
                    </ul>
                </main>
                <br />
                <br />

                {lastFetchedListing && (
                    <p className='loadMore' onClick={moreFetchListings}>
                        Load More
                    </p>
                )}

            </> : <p>No listings for {params.categoryName}</p>}
        </div>
    )
}

export default Category
