import React, { useState } from 'react';
import { Callout, Button } from "@blueprintjs/core";
import { User, Offering } from "models";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';
import Form from 'pages/offering/from';

export default function Offerings(props: { user: User, canAdd?: boolean }){
    const { user } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)
    const [ creating, updateCreating ] = useState(false)

    return (
        <>
            <Callout>
                <Button fill={true} large={true} text={"Add new"} onClick={() => updateCreating(true)}/>
            </Callout>
            {user.offerings.map((o, idx) => {
                return (
                    <Callout key={idx}>
                        <h2 onClick={() => updateOffering(o)}>{o?.name}</h2>
                        {removeMd(o.description).substring(0, 120)}...
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
            <Form isOpen={creating} close={() => updateCreating(false)} />
        </>
    );
}