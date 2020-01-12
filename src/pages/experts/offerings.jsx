import React, { useState } from 'react';
import { Callout } from "@blueprintjs/core";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';

export default function Offerings(props){
    const { user } = props;
    const [ offering, updateOffering ] = useState(null)

    return (
        <>
            {user.offerings.map((o, idx) => {
                return (
                    <Callout key={idx}>
                        <h2 onClick={() => updateOffering(o)}>{o?.name}</h2>
                        {removeMd(o.description).substring(0, 120)}...
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
        </>
    );
}