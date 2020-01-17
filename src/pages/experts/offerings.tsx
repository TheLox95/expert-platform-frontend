import React, { useState } from 'react';
import { Callout, Button, Icon } from "@blueprintjs/core";
import { User, Offering } from "models";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';
import Form from 'pages/offering/from';
import { wrapper, WrappedComponent } from 'state';

const Offerings: WrappedComponent<{ user: User, canAdd?: boolean }> = (props) => {
    const { useGlobalState, requests } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)
    const [ creating, updateCreating ] = useState(false)
    const [ isHovering, updateHovering ] = useState<number | null>(null)
    const [ user ] = useGlobalState('user');

    const updateUser = () => {
        requests.user.getUser();
    }

    return (
        <>
            <Callout style={{ marginBottom: '0.5rem'}}>
                <Button fill={true} large={true} text={"Add new"} onClick={() => updateCreating(true)}/>
            </Callout>
            {user?.offerings.map((o, idx) => {
                return (
                    <Callout
                        key={idx}
                        style={{ marginBottom: '0.5rem', display: "flex", justifyContent: 'space-between'}}
                        onMouseEnter={() => updateHovering(idx)}
                        onMouseLeave={() => updateHovering(null)}
                    >
                        <div>
                            <h2 onClick={() => updateOffering(o)}>{o?.name}</h2>
                            {removeMd(o.description).substring(0, 120)}...
                        </div>
                        {isHovering === idx ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon icon="edit" />
                            </div>
                        ) : null}
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
            {creating ? <Form close={() => updateCreating(false)} onSendOk={updateUser}/>: null}
        </>
    );
}

export default wrapper(Offerings);