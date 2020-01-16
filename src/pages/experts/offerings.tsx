import React, { useState } from 'react';
import { Callout, Button } from "@blueprintjs/core";
import { User, Offering, Opinion } from "models";
import axios from "axios";
import removeMd from 'remove-markdown';
import Preview from './offeringPreview';
import Form from 'pages/offering/from';
import { wrapper, WrappedComponent } from 'state';
import { HttpInstance } from 'state/http';

const getUser = (id: number, http: HttpInstance) => http({ method: 'get', url: `http://localhost:1337/users/${id}` }).then(r => r.data)
const getOfferings = (http: HttpInstance) => http({ method: 'get', url: `http://localhost:1337/offerings?_sort=created_at:desc` }).then(r => r.data)
const getOpinions = (http: HttpInstance) => http({ method: 'get', url: `http://localhost:1337/opinions` }).then(r => r.data)

const Offerings: WrappedComponent<{ user: User, canAdd?: boolean }> = (props) => {
    const { http, useGlobalState, dispatch } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)
    const [ creating, updateCreating ] = useState(false)
    const [ user ] = useGlobalState('user');

    const updateUser = () => {
        axios.all([
            getUser(user?.id || 0, http),
            getOfferings(http),
            getOpinions(http)
        ])
        .then(axios.spread((user, offerings, opinions) => {
            offerings = (offerings as Offering[]).map((offering: Offering) => {
                offering.opinions = offering.opinions.map(originalOpinion => {
                    return (opinions as Opinion[]).filter((fullOpiniion: Opinion) => {
                        if (typeof fullOpiniion.user === 'object') {
                            return fullOpiniion.user.id === originalOpinion.user
                        }
                        return null;
                    })
                }).flat()
                return offering;
            })
            user = {
                ...user,
                offerings
            }
            dispatch({ type: 'user', payload: user})
        }))
    }

    return (
        <>
            <Callout style={{ marginBottom: '0.5rem'}}>
                <Button fill={true} large={true} text={"Add new"} onClick={() => updateCreating(true)}/>
            </Callout>
            {user?.offerings.map((o, idx) => {
                return (
                    <Callout key={idx} style={{ marginBottom: '0.5rem'}}>
                        <h2 onClick={() => updateOffering(o)}>{o?.name}</h2>
                        {removeMd(o.description).substring(0, 120)}...
                    </Callout>
                );
            })}
            <Preview offering={offering} updateOffering={updateOffering}/>
            <Form isOpen={creating} close={() => updateCreating(false)} onSendOk={updateUser}/>
        </>
    );
}

export default wrapper(Offerings);