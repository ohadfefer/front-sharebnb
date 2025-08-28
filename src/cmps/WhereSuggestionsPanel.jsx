// src/cmps/WherePanel.jsx
import { useMemo, useState } from "react"

// tiny, fixed suggestions list (use any images you already have in /src/assets/imgs)
import nearBy from "../assets/imgs/near-by.png"
import telAviv from "../assets/imgs/tel-aviv.png"
import jerusalem from "../assets/imgs/jerusalem.webp"
import paris from "../assets/imgs/paris.png"
import london from "../assets/imgs/london.png"
import athens from "../assets/imgs/athens.png"

const SUGGESTED = [
    { id: "nearby", label: "Nearby", sub: "Find what’s around you", icon: nearBy },
    { id: "tel-aviv", label: "Tel Aviv-Yafo", sub: "Israel", icon: telAviv },
    { id: "jeru", label: "Jerusalem", sub: "Israel", icon: jerusalem },
    { id: "paris", label: "Paris", sub: "France", icon: paris },
    { id: "london", label: "London", sub: "United Kingdom", icon: london },
    { id: "athens", label: "Athens", sub: "Greece", icon: athens },
];

export function WhereSuggestionsPanel({ value = {}, onChange, onAdvance }) {
    const [query, setQuery] = useState(value.address || "")

    const items = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return SUGGESTED;
        return SUGGESTED.filter(i =>
            i.label.toLowerCase().includes(q) || (i.sub || "").toLowerCase().includes(q)
        );
    }, [query])

    function select(item) {
        const address = item.id === "nearby" ? "Nearby" : `${item.label}${item.sub ? `, ${item.sub}` : ""}`
        onChange?.({ address })
        onAdvance?.(); // jump to Check-in
    }

    return (
        <div className="where-panel">
            <ul className="where-list">
                {items.map(item => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className="where-row"
                            onClick={() => select(item)}
                        >
                            <img className="where-icon" src={item.icon} alt="" width={40} height={40} />
                            <span className="where-texts">
                                <span className="where-title">{item.label}</span>
                                {item.sub && <span className="where-sub">{item.sub}</span>}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
