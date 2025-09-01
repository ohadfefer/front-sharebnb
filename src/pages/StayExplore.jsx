// StayExplore.jsx
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { setFilter, loadStays } from '../store/actions/stay.actions'

import { StayIndex } from './StayIndex'
import { ExploreMap } from '../cmps/ExploreMap'
import { parseSearchParams } from '../services/util.service'

export function StayExplore() {
    const [searchParams] = useSearchParams()
    const filterFromUrl = useMemo(() => parseSearchParams(searchParams), [searchParams])
    const { stays, isLoading } = useSelector(state => state.stayModule)

    useEffect(() => {
        setFilter(filterFromUrl)
        loadStays()
    }, [filterFromUrl])

    return (
        <section className="explore">
            <div className="results-col">
                {isLoading ? (
                    <div className="loading">Loading…</div>
                ) : (
                    <StayIndex autoLoad={false} />
        )}
            </div>
            <aside className="map-col">
                <ExploreMap stays={stays} />
            </aside>
        </section>
    )
}
