import React, { useState } from 'react';
import { Callout, Tag } from "@blueprintjs/core";
import Preview from './offeringPreview';
import { WrappedComponent, wrapper } from 'state';
import { User, Opinion, Offering } from 'models';

const Offerings: WrappedComponent<{ user: User | null }> = (props) => {
    const { user } = props;
    const [ offering, updateOffering ] = useState<Offering | null>(null)

    const opinions = user?.offerings.map(o => {
        o.opinions = o.opinions.map(op => ({ ...op, offering: o}))
        return o.opinions;
    }).flat< Opinion & {offering: Offering}>();

    return (
        <>
            {opinions?.map((o, idx) => {
                return (
                    <Callout key={idx}>
                        <Tag>Score {o?.score}</Tag>{' '}
                        by <span>{(o?.user as User).username}</span>{' '}
                        for <span onClick={() => updateOffering(o.offering)}>{o?.offering.name}</span>
                        <h2>{o?.description}</h2>
                    </Callout>
                );
            })}
            {!offering ? null: <Preview offering={offering} updateOffering={updateOffering}/>}
        </>
    );
}

export default wrapper(Offerings);