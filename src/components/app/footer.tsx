import React, { useState } from 'react';
import { wrapper, WrappedComponent } from "state";
import { Callout, Popover, Button, Intent, Tag } from "@blueprintjs/core";

const Footer: WrappedComponent = ({ useGlobalState }) => {
    const [ lang, updateLang ] = useGlobalState('lang');
    const [ availableLangs ] = useGlobalState('availableLangs');
    const [ isOpen, updateIsOpen ] = useState(false);

    const tag = <Tag onClick={() => updateIsOpen(true)} interactive={true} round={true} large={true}>{lang.toUpperCase()}</Tag>;
    const LangList = (
        <>
        {availableLangs.map(l => {
            return <Tag
                key={l}
                interactive={true}
                round={true}
                large={true}
                style={{ margin: '0.5rem'}}
                onClick={() => {
                    updateLang(l);
                    updateIsOpen(false);
                }}
            >{l.toUpperCase()}</Tag>
        })}
        </>
    );

    return (<Callout className="flex-item" style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div>
            Footer
        </div>
        <div>
            <Popover isOpen={isOpen} content={LangList} target={tag} />
        </div>
    </Callout>);
}

export default wrapper(Footer);
