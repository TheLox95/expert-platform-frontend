import React from 'react';
import { HTMLTable, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { Offering } from "models";
import removeMd from 'remove-markdown';
import { WrappedComponent, wrapper } from 'state';

export const OfferingsTable: WrappedComponent<{ results: Offering[] }> = ({ results, i18n }) => {
    return (<HTMLTable style={{ width: '100%' }}>
        <thead>
            <tr>
                <th>{i18n.t('offering-table-name')}</th>
                <th>{i18n.t('offering-table-description')}</th>
                <th>{i18n.t('offering-table-expert')}</th>
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

export default wrapper(OfferingsTable);