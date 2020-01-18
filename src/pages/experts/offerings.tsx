import React, { useState } from 'react';
import { Callout, Button, Icon } from "@blueprintjs/core";
import { User, Offering } from "models";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';
import Form from 'pages/offering/from';
import FormEdit from 'pages/offering/from-edit';
import { wrapper, WrappedComponent } from 'state';

const Offerings: WrappedComponent<{ canAdd?: boolean }> = (props) => {
    const { useGlobalState, requests } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)
    const [ creating, updateCreating ] = useState(false)
    const [ editing, updateEditing ] = useState(false)
    const [ isHovering, updateHovering ] = useState<number | null>(null)
    const [ isHoveringDelete, updateHoveringDelete ] = useState(false)
    const [ isHoveringEdit, updateHoveringEdit ] = useState(false)
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
                        {idx ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Icon
                                    style={{ cursor: 'pointer' }}
                                    icon='delete'
                                    color={isHoveringDelete ? 'red': ''}
                                    onMouseEnter={() => updateHoveringDelete(true)}
                                    onMouseLeave={() => updateHoveringDelete(false)}
                                    onClick={() => {
                                        requests.offering.delete(user?.offerings[idx].id)
                                        .then(() => {
                                            requests.user.getUser(user?.id)
                                            updateSuccess(`Offering ${user?.offerings[idx].name} deleted!`);
                                        });
                                    }}
                                />
                                <Icon
                                    style={{ cursor: 'pointer' }}
                                    icon='edit'
                                    color={isHoveringEdit ? 'green': ''}
                                    onMouseEnter={() => updateHoveringEdit(true)}
                                    onMouseLeave={() => updateHoveringEdit(false)}
                                    onClick={() => {
                                        updateEditing(true)
                                        updateOfferingToEdit(o)
                                    }}
                                />
                            </div>
                        ) : null}
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
            {creating ? <Form close={() => updateCreating(false)} onSendOk={updateUser}/>: null}
            {editing ? <FormEdit close={() => updateEditing(false)} onSendOk={updateUser} offering={offeringToEdit}/>: null}
        </>
    );
}

export default wrapper(Offerings);