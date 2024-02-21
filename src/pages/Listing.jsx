import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../component/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'


import 'swiper/swiper-bundle.css'

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


const Listing = () => {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()

    }, [navigate, params.listingId])

    if (loading) {
        return (
            <Spinner />
        )
    }

    return (
        <main>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                autoplay
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                scrollbar={{ draggable: true }}
            >
                {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                            className='swiperSlideDiv'
                        >
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>


            <div
                className="shareIconDiv"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setShareLinkCopied(true)
                    setTimeout(() => {
                        setShareLinkCopied(false)
                    }, 2000)
                }}
            >
                <img src={shareIcon} alt='Share' />
            </div>
            {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}

            <div className='listingsDetails'>
                <p className='listingName'>
                    {listing.name} - £{
                        listing.offer

                            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

                            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className='listingLocation'>
                    {listing.location}
                </p>
                <p className='listingType'>
                    For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                </p>
                {listing.offer && (
                    <p className='discountPrice'>
                        £{(listing.regularPrice - listing.discountedPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Discount
                    </p>
                )}

                <ul className="listingDetailsList" >
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : '1 bathroom'}
                    </li>
                    <li>
                        {listing.parking ? `Parking Spot` : 'No Parking'}
                    </li>
                    <li>
                        {listing.furnished ? `Furnished` : 'Not Furnished'}
                    </li>
                </ul>
                <p className='listingLocationTitle'></p>

                <div className='leafletContainer'>
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>
                                {listing.location}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>



                {auth.currentUser?.uid !== listing.useRef && (
                    <Link
                        to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'
                    >
                        Contact Landlord
                    </Link>
                )}
            </div>

        </main >

    )
}

export default Listing
