import { useEffect, useRef } from 'react'

const AIRBNB_LITE_STYLE = [
    { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#e8f2ca" }] },
    { featureType: "landscape.natural.terrain", elementType: "geometry.fill", stylers: [{ color: "#e8f2ca" }] },
    { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#e1f3ca" }] },
    { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#cae8f2" }] },
]


let mapsPromise
function loadGoogleMaps() {
    // Already loaded?
    if (window.google?.maps) return Promise.resolve(window.google.maps)
    if (mapsPromise) return mapsPromise

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) {
        return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is missing'))
    }

    mapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        // JS Maps API (not Static Maps). Add libraries you use.
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&libraries=marker,places`
        script.async = true
        script.onerror = (error) => reject(new Error('Failed to load Google Maps JS API', error))
        script.onload = () => resolve(window.google.maps)
        document.head.appendChild(script)
    })

    return mapsPromise
}

export function ExploreMap({ stays }) {
    const ref = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef([])

    useEffect(() => {
        let mounted = true;

        loadGoogleMaps()
            .then(() => {
                if (!mounted || !ref.current) return

                const first = stays[0]
                console.log(typeof first.loc.lat);
                const center = first ? { lat: first.loc.lat, lng: first.loc.lng } : { lat: 20, lng: 0 }

                mapRef.current = new window.google.maps.Map(ref.current, {
                    center,
                    zoom: first ? 11 : 2,
                    mapTypeId: 'roadmap',
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    styles: AIRBNB_LITE_STYLE, 
                });

                renderMarkers(stays)
            })
            .catch((err) => {
                console.error('Maps load failed:', err)
            })

        return () => { mounted = false; }
    }, [])

    useEffect(() => {
        if (mapRef.current) renderMarkers(stays)
    }, [stays])

    function renderMarkers(items) {
        // clear old
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []

        if (!items?.length) return

        const bounds = new google.maps.LatLngBounds()

        items.forEach(stay => {
            const pos = { lat: stay.loc.lat, lng: stay.loc.lng }
            const marker = new google.maps.Marker({
                position: pos,
                map: mapRef.current,
                label: {
                    text: `₪${Math.round(stay.price)}`,
                    className: 'price-label',
                }
            })
            markersRef.current.push(marker)
            bounds.extend(pos)
        })

        if (items.length > 1) {
            mapRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 })
        }
    }

    return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}
