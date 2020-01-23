import React from 'react';
import { HTMLTable, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { Offering } from "models";
import removeMd from 'remove-markdown';

export const OfferingsTable = ( props: { results: Offering[] } ) => {
    const { results } = props;

    return (<HTMLTable style={{ width: '100%' }}>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Expert</th>
            </tr>
        </thead>
        <tbody>
            {results && results.map((r) => (
                <tr key={r.id}>
                    <td>
                        <Link to={`/offering/${r.id}`}>
                            {r.name}
                        </Link>
                    </td>
                    <td>{removeMd(r.description).substring(0, 120)}...</td>
                    <td>
                        <Link to={`/profile/${r.user.id}`}>
                            <Button>
                                {r.user.username.charAt(0).toUpperCase() + r.user.username.slice(1)}
                            </Button>
                        </Link>
                    </td>
                </tr>
                ))}
        </tbody>
    </HTMLTable>)
}

export default OfferingsTable