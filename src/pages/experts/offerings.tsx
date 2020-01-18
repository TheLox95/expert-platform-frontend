import React, { useState } from 'react';
import { Callout, Button } from "@blueprintjs/core";
import { Offering } from "models";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';
import Form from 'pages/offering/from';
import FormEdit from 'pages/offering/from-edit';
import { wrapper, WrappedComponent } from 'state';
import HoverIcon from 'tools/HoverIcon';

const Offerings: WrappedComponent<{ canAdd?: boolean }> = (props) => {
    const { useGlobalState, requests } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)
    const [ creating, updateCreating ] = useState(false)
    const [ editing, updateEditing ] = useState(false)
    const [ isHovering, updateHovering ] = useState<number | null>(null)
    const [ offeringToEdit, updateOfferingToEdit ] = useState<Offering | undefined>(undefined)
    const [ user ] = useGlobalState('user');
    const [ , updateSuccess ] = useGlobalState('success');

    const updateUser = () => {
        requests.user.getUser(user?.id);
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
                        { isHovering === idx ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <HoverIcon color='red' icon='delete' onClick={() => {
                                    requests.offering.delete(user?.offerings[idx].id)
                                    .then(() => {
                                        requests.user.getUser(user?.id)
                                        updateSuccess(`Offering ${user?.offerings[idx].name} deleted!`);
                                    });
                                }}/>

                                <HoverIcon color='green' icon='edit' onClick={() => {
                                    updateEditing(true)
                                    updateOfferingToEdit(o)
                                }}/>

                            </div>
                        ) : null}
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
            {creating ? <Form close={() => updateCreating(false)} onSendOk={updateUser}/>: null}
            {editing && offeringToEdit ? <FormEdit close={() => updateEditing(false)} onSendOk={updateUser} offering={offeringToEdit}/>: null}
        </>
    );
}

export default wrapper(Offerings);