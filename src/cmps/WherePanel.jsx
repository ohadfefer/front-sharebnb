// src/cmps/WherePanel.jsx
import { WhereSuggestionsPanel } from "./WhereSuggestionsPanel.jsx"
import { AutoCompletePanel } from "./AutoCompletePanel.jsx"

export function WherePanel(props) {
    const q = (props.value?.address || "").trim();
    const useAutocomplete = q.length >= 2;      // your threshold
    return useAutocomplete
        ? <AutoCompletePanel {...props} />
        : <WhereSuggestionsPanel {...props} />;
}
