import React, { useCallback, useEffect, useRef, useState } from 'react';
import Loader from '../../../structure/Loader';

const InfiniteScrolling = props => {
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        totalPages,
        currentPage,
        handleLoadMore,
        dataChange,
        children,
    } = props;

    useEffect(() => {
        if (totalPages > currentPage) {
            setHasMore(true);
        } else {setHasMore(false)}
    }, [totalPages, currentPage]);

    useEffect(() => {
        if (dataChange && loading) {
            setLoading(false);
        }
    }, [dataChange, loading]);

    const observer = useRef();
    const lastItemRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
              setLoading(true);
              handleLoadMore();
          }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, handleLoadMore]);

    return (
        <React.Fragment>
            <div className='scroller'>
                {children}
                {loading && <Loader mini={true}/>}
                <div ref={lastItemRef} />
            </div>
        </React.Fragment>
    )
}

export default InfiniteScrolling;