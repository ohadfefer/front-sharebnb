import { useEffect, useState } from "react";
import { usePlacesAutocomplete } from "../customHooks/usePlacesAutocomplete.js";

export function AutoCompletePanel({ value = {}, onChange, onComplete }) {
    const query = value.address || "";
    const { ready, getPredictions, resetSession } = usePlacesAutocomplete();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!ready) return;
        getPredictions(query, (preds) =>
            setItems(preds.slice(0, 5).map(p => ({
                id: p.place_id,
                label: p.structured_formatting?.main_text || p.description,
                sub: p.structured_formatting?.secondary_text || "",
                description: p.description,
            })))
        );
    }, [ready, query, getPredictions]);

    function select(item) {
        const address = item.description || item.label;
        onChange?.({ address, placeId: item.id });
        resetSession();
        onComplete?.();
    }

    return (
        <div className="where-suggestions">
            <ul className="where-list">
                {items.map(i => (
                    <li key={i.id}>
                        <button type="button" className="where-row" onClick={() => select(i)}>
                            <span className="where-texts">
                                <span className="where-title">{i.label}</span>
                                {i.sub && <span className="where-sub">{i.sub}</span>}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
