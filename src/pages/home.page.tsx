import React, { useState, useEffect} from 'react';
import axios from "axios";
import { wrapper, WrappedComponent } from "state";
import Table from 'pages/offering/offering-table';

export const Home: WrappedComponent = ( props ) => {
    const { http } = props;
    const [ results, updateResult ] = useState([]);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        http({url: `${process.env.REACT_APP_BACKEND_URL}/offerings?_sort=created_at:DESC`, method: 'get', cancelToken: source.token })
        .then(r => {
            updateResult(r.data as [])
        })
        .catch(() => {})
        return () => {
            source.cancel();
        };
    }, [http]);

    return (<Table results={results}></Table>)
}

export default wrapper(Home)