import React from 'react';
import { Drawer } from "@blueprintjs/core";
import Markdown from 'markdown-to-jsx';
import { wrapper, WrappedComponent } from 'state';
import { Offering } from 'models';

const OfferingPreview: WrappedComponent<{offering: Offering, updateOffering: (o: Offering | null) => void}> = ({ offering, updateOffering }) => {
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

export default wrapper(OfferingPreview);