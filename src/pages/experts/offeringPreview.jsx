import React from 'react';
import { Drawer } from "@blueprintjs/core";
import Markdown from 'markdown-to-jsx';

export default function OfferingPreview(props){
    const { offering, updateOffering } = props;

    return (
        <Drawer
            isOpen={offering !== null}
            icon="globe"
            onClose={() => updateOffering(null)}
            title={offering? offering.name : ''}
        >
            <Markdown style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                {offering ? offering.description : ''}
            </Markdown>
        </Drawer>
    );
}