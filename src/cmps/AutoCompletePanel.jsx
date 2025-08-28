import { useEffect, useState } from "react"
import { usePlacesAutocomplete } from "../customHooks/usePlacesAutocomplete.js"
import location from "../assets/imgs/location.png"

export function AutoCompletePanel({ value = {}, onChange, onComplete, onAdvance }) {
    const query = value.address || ""
    const { ready, getPredictions, resetSession } = usePlacesAutocomplete()
    const [items, setItems] = useState([])

    useEffect(() => {
        if (!ready || query.trim().length < 2) { setItems([]); return; }
        getPredictions(query, (preds) =>
            setItems((preds || []).slice(0, 5).map(p => ({
                id: p.place_id,
                label: p.structured_formatting?.main_text || p.description,
                sub: p.structured_formatting?.secondary_text || "",
                description: p.description,
            })))
        )
    }, [ready, query, getPredictions])

    function select(item) {
        const address = item.description || item.label
        onChange?.({ address, placeId: item.id })
        resetSession()
        onAdvance?.()
    }

    return (
        <div className="where-suggestions">
            <ul className="where-list">
                {items.map(item => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className="where-row"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                select(item);
                            }}
                        >
                            <span className="where-icon">
                                <img src={location} alt="" />
                            </span>
                            <span className="where-texts">
                                <span className="where-title">{item.label}</span>
                                {item.sub && <span className="where-sub">{item.sub}</span>}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
