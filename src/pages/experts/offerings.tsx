import React, { useState, useEffect } from 'react';
import { Callout, Button } from "@blueprintjs/core";
import { Offering } from "models";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';
import Form from 'pages/offering/from';
import FormEdit from 'pages/offering/from-edit';
import { wrapper, WrappedComponent } from 'state';
import HoverIcon from 'tools/HoverIcon';
import ConfirmAction from 'tools/ConfirmAction';

const Offerings: WrappedComponent<{ canAdd?: boolean }> = (props) => {
    const { useGlobalState, requests } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)
    const [ creating, updateCreating ] = useState(false)
    const [ editing, updateEditing ] = useState(false)
    const [ isHovering, updateHovering ] = useState<number | null>(null)
    const [ offeringToEdit, updateOfferingToEdit ] = useState<Offering | undefined>(undefined)
    const [ confirm, updateConfirm ] = useState<Offering | null>(null)
    const [ user ] = useGlobalState('user');

    const updateUser = () => {
        requests.user.getUser(user?.id);
    }

    const toEdit = user?.offerings.find(o => offeringToEdit?.id === o.id)

    return (
        <>
            {!confirm ? null : (
                <ConfirmAction
                    onCance={() => updateConfirm(null)}
                    onConfirm={() => requests.offering.delete(confirm)}
                    message={`Are you sure you want to delete offering ${confirm.name}`}
                    buttonText='Delete!'
                
                />
            )}
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
                                    updateConfirm(user?.offerings[idx])
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
            {editing && toEdit ? <FormEdit close={() => updateEditing(false)} offering={toEdit}/>: null}
        </>
    );
}

export default wrapper(Offerings);