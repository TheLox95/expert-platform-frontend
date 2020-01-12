import React from 'react';
import { NonIdealState } from "@blueprintjs/core";
import { wrapper, WrappedComponent } from "state";
import Table from 'pages/offering/offering-table';


const noSearch = <NonIdealState
    icon={"search"}
    title="Search"
    description={"Write something to search"}
    action={undefined}
/>

const noResultFound = <NonIdealState
    icon={"search"}
    title="No search results"
    description={"Your search didn't match any files.Try searching for something else."}
    action={undefined}
/>

export const OfferingsDirectory: WrappedComponent = ( props ) => {
    const { useGlobalState } = props;
    const [ results ] = useGlobalState("results");
    const [ searchTerm ] = useGlobalState("searchTerm");

    if (results === null) {
        return noSearch
    }

    if (results.length === 0 && searchTerm !== null) {
        return noResultFound
    }

    return (<Table results={results}></Table>)
}

export default wrapper(OfferingsDirectory)