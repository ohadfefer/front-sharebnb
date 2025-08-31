import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { setFilter, loadStays } from '../store/actions/stay.actions'
import { parseSearchParams } from '../services/util.service'
import { StayList } from '../cmps/StayList'
import { ExploreMap } from '../cmps/ExploreMap'

export function StayExplore() {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()

    const filterFromUrl = useMemo(() => parseSearchParams(searchParams), [searchParams])
    const { stays, isLoading } = useSelector(state => state.stayModule)
console.log("from explore:",stays);

    // hydrate store from URL & load
    useEffect(() => {
        setFilter(filterFromUrl)
        loadStays(filterFromUrl)
    }, [filterFromUrl])
    if(!stays.length) {
        return <div>Loading</div>
    }
    return (
        <section className="explore">
            <div className="results-col">
                {isLoading ? (
                    <div className="loading">Loading…</div>
                ) : (
                    <StayList stays={stays} />
                )}
            </div>

            <aside className="map-col">
                <ExploreMap stays={stays} />
            </aside>
        </section>
    )
}
