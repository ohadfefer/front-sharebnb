import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsPlaces } from "../services/googleMapsLoader";

function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

export function usePlacesAutocomplete() {
    const [ready, setReady] = useState(false);
    const serviceRef = useRef(null);
    const sessionTokenRef = useRef(null);

    useEffect(() => {
        let mounted = true;
        loadGoogleMapsPlaces().then(() => {
            if (!mounted) return;
            serviceRef.current = new window.google.maps.places.AutocompleteService();
            setReady(true);
        });
        return () => (mounted = false);
    }, []);

    const getPredictions = useMemo(
        () =>
            debounce((input, cb) => {
                const service = serviceRef.current;
                if (!service || !input || input.trim().length < 2) {
                    cb([]);
                    return;
                }
                if (!sessionTokenRef.current) {
                    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
                }

                service.getPlacePredictions(
                    {
                        input,
                        sessionToken: sessionTokenRef.current,
                        // Optional: narrow type of results (cities only)
                        // types: ["(cities)"],
                    },
                    (preds, status) => {
                        if (
                            status !== window.google.maps.places.PlacesServiceStatus.OK ||
                            !Array.isArray(preds)
                        ) {
                            cb([]);
                            return;
                        }
                        cb(preds.slice(0, 5));
                    }
                );
            }, 200),
        []
    );

    const resetSession = () => {
        sessionTokenRef.current = null;
    };

    return { ready, getPredictions, resetSession };
}
