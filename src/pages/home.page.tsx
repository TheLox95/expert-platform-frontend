import React, { useState, useEffect} from 'react';
import axios from "axios";
import { wrapper, WrappedComponent } from "state";
import Table from 'pages/offering/offering-table';

export const Home: WrappedComponent = ( props ) => {
    const { http } = props;
    const [ results, setResult ] = useState([]);

    useEffect(() => {
        http<[]>({url: `${process.env.REACT_APP_BACKEND_URL}/offerings?_sort=created_at:DESC`, method: 'get' })
        .then(r => {
            setResult(r)
        })
        .catch(() => {})

    }, []);

    return (<Table results={results}></Table>)
}

export default wrapper(Home)