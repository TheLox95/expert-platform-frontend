import React, { useState } from 'react';
import { Callout, Tag } from "@blueprintjs/core";
import Preview from './offeringPreview';

export default function Offerings(props){
    const { user } = props;
    const [ offering, updateOffering ] = useState(null)

    const opinions = user.offerings.map(o => {
        o.opinions = o.opinions.map(op => ({ ...op, offering: o}))
        return o.opinions;
    }).flat();

    return (
        <>
            {opinions.map((o, idx) => {
                return (
                    <Callout key={idx}>
                        <Tag>Score {o?.score}</Tag>{' '}
                        by <span>{o?.user.username}</span>{' '}
                        for <span onClick={() => updateOffering(o.offering)}>{o?.offering.name}</span>
                        <h2>{o?.description}</h2>
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
        </>
    );
}